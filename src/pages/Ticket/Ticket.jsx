"use client";
import { useEffect, useState, useRef } from "react";
import styles from "../../styles/Ticket.module.css";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
import { SlSocialDropbox } from "react-icons/sl";
import TicketItem from "../../components/module/TicketItem/TicketItem";
import Massage from "../../components/module/Massage/Massage";
import { IoSend } from "react-icons/io5";
import swal from "sweetalert";
import { MdAttachFile } from "react-icons/md";
import { CircularProgressbar } from "react-circular-progressbar";
import { BsFillFileEarmarkArrowDownFill } from "react-icons/bs";
import { CiLock } from "react-icons/ci";
import Loading from "../../components/module/Loading/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../../config/axiosConfig";
import SearchBox from "../../../../behrizanpanel/src/components/module/SearchBox/SearchBox";
import Filter from "../../../../behrizanpanel/src/components/module/Filter/Filter";
import ModalFilter from "../../../../behrizanpanel/src/components/module/ModalFilter/ModalFilter";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingInfity from "../../../../behrizanpanel/src/components/module/Loading/LoadingInfinity";
import NoneSearch from "../../../../behrizanpanel/src/components/module/NoneSearch/NoneSearch";
export default function Ticket() {
  const [tab, setTab] = useState(1);
  const [windowWidth, setWindowWidth] = useState(0);
  const [allTickets, setAllTickets] = useState([]);
  const [openTicket, setOpenTicket] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [ticket, setTicket] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const messageEndRef = useRef(null);
  const [showfile, setShowFile] = useState(false);
  const [openModal, setOpenmodal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState([]);
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isSearch, setIsSearch] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const getAllTickets = async (page = 1, page_size = 25) => {
    if (page === 1 && firstLoad) setLoading(true);
    if (page > 1) setIsFetchingMore(true);

    try {
      const response = await apiClient.get("/app/ticket-admin/", {
        params: { page, page_size },
      });

      if (response.status === 200) {
        setAllTickets((prev) =>
          page === 1
            ? response.data.results
            : [...prev, ...response.data.results]
        );
        setFilterValue((prev) =>
          page === 1
            ? response.data.results
            : [...prev, ...response.data.results]
        );

        if (response.data.results.length < page_size) {
          setHasMore(false);
        } else {
          setPage(page + 1);
        }
      }
    } catch (e) {
      if (e.response?.status === 500) {
        toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
          position: "top-left",
        });
      }
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
      if (firstLoad) setFirstLoad(false);
      setIsSearch(false);
    }
  };

  const filterTicketsByDate = async (
    startDate,
    endDate,
    page = 1,
    page_size = 25
  ) => {
    const convertToEnglishDigits = (str) =>
      str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

    const formatDate = (date) =>
      convertToEnglishDigits(date).replace(/\//g, "").replace(/-/g, "");

    const startDateFormatted = formatDate(startDate);
    const endDateFormatted = formatDate(endDate);

    if (page === 1) setIsSearch(true);
    if (page > 1) setIsFetchingMore(true);

    try {
      const response = await apiClient.get("/app/ticket-admin/", {
        params: {
          page,
          page_size,
          start_date: startDateFormatted,
          end_date: endDateFormatted,
        },
      });

      setSearch("");

      if (response.status === 200) {
        console.log(response.data);
        setFilterValue((prev) =>
          page === 1
            ? response.data.results
            : [...prev, ...response.data.results]
        );

        if (response.data.results.length < page_size) {
          setHasMore(false);
        } else {
          setPage(page + 1);
        }
      }
    } catch (e) {
      if (e.response?.status === 500) {
        toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
          position: "top-left",
        });
      }
    } finally {
      setIsSearch(false);
      setIsFetchingMore(false);
    }
  };

  const filterTicketsByStatus = async (status, page = 1, page_size = 25) => {
    if (page === 1) setIsSearch(true);
    if (page > 1) setIsFetchingMore(true);
    try {
      const response = await apiClient.get("/app/ticket-admin/", {
        params: {
          page,
          page_size,
          close: status,
        },
      });

      setSearch("");

      if (response.status === 200) {
        console.log(response.data.results);

        setFilterValue((prev) =>
          page === 1
            ? response.data?.results
            : [...prev, ...response.data.results]
        );

        if (response.data.results.length < page_size) {
          setHasMore(false);
        } else {
          setPage(page + 1);
        }
      }
    } catch (e) {
      toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
        position: "top-left",
      });
    } finally {
      setIsSearch(false);
      setIsFetchingMore(false);
    }
  };

  const filterTicketsByCategory = async (
    category,
    page = 1,
    page_size = 25
  ) => {
    if (page === 1) setIsSearch(true);
    if (page > 1) setIsFetchingMore(true);
    try {
      const response = await apiClient.get("/app/ticket-admin/", {
        params: {
          page,
          page_size,
          category,
        },
      });

      setSearch("");
      if (response.status === 200) {
        setFilterValue((prev) =>
          page === 1
            ? response.data?.results
            : [...prev, ...response.data.results]
        );

        if (response.data.results.length < page_size) {
          setHasMore(false);
        } else {
          setPage(page + 1);
        }
      }
    } catch (e) {
      toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
        position: "top-left",
      });
    } finally {
      setIsSearch(false);
      setIsFetchingMore(false);
    }
  };

  const searchTickets = async (query, page = 1, page_size = 25) => {
    if (!query.trim()) return;

    if (page === 1) setIsSearch(true);
    if (page > 1) setIsFetchingMore(true);

    try {
      const response = await apiClient.get("/app/ticket-admin/", {
        params: { ticket_id: query, page, page_size },
      });

      if (response.status === 200) {
        const newResults =
          Array.isArray(response.data) && response.data.length === 0
            ? []
            : response.data?.results || [];

        setFilterValue((prev) =>
          page === 1 ? newResults : [...prev, ...newResults]
        );

        if (response.data.results.length < page_size) {
          setHasMore(false);
        } else {
          setPage(page + 1);
        }
      }
    } catch (e) {
      toast.error(e.response?.data?.erorr, {
        position: "top-left",
      });
    } finally {
      setIsSearch(false);
      if (firstLoad) setFirstLoad(false);
      setIsFetchingMore(false);
    }
  };

  const resetTickets = () => {
    setFilterValue([]);
    getAllTickets(1);
    setIsSearch(true);
    setPage(1);
    setHasMore(true);
  };

  const handleTicketCloseChange = (ticketId, isChecked) => {
    if (!allTickets) return;

    (prevTickets) =>
      prevTickets?.map((ticket) =>
        ticket.ticket_id === ticketId
          ? { ...ticket, ticket_close: isChecked }
          : ticket
      ) || [],
      false;

    const newOpenTicketCount =
      allTickets.filter(
        (ticket) => ticket.ticket_id !== ticketId && !ticket.ticket_close
      ).length + (isChecked ? 0 : 1);

    setOpenTicket(newOpenTicketCount);
  };

  const getSelectedTicket = (ticket) => {
    setTicket(ticket);
    setSelectedTicket(ticket.ticket_informations);
    setTab(3);
  };

  const sendmessage = async () => {
    if (textInput.trim()) {
      const formData = new FormData();
      formData.append("message", textInput);
      formData.append("ticket_id", ticket.ticket_id);
      formData.append("is_admin", 1);
      formData.append("category", ticket.ticket_category);

      const tempMessage = {
        message: "در حال ارسال...",
        date: new Date(),
        is_admin: true,
        temp: true,
      };

      setSelectedTicket((prevMessages) => [...prevMessages, tempMessage]);

      try {
        const response = await apiClient.post(`/chat/send-ticket/`, formData);

        if (response.status === 201) {
          const newMessage = {
            message: textInput,
            date: new Date(),
            is_admin: true,
          };

          setSelectedTicket((prevMessages) =>
            prevMessages.map((msg) => (msg.temp ? newMessage : msg))
          );

          swal({
            title: "تیکت با موفقیت ارسال  شد",
            icon: "success",
            button: {
              text: "باشه",
            },
          });
          setTextInput("");
        }
      } catch (e) {
        toast.error("مشکلی سمت سرور پیش آمده", {
          position: "top-left",
        });
      }
    }
  };

  const sendFile = async (e) => {
    const maxSize = 1 * 1024 * 1024;
    const fileMessage = e.target.files[0];
    if (fileMessage.size > maxSize) {
      swal(
        "حجم فایل زیاد است!",
        "لطفاً فایلی با حجم کمتر از 1MB انتخاب کنید.",
        "warning"
      );
      e.target.value = "";
      return;
    }
    setShowFile(true);
    const formData = new FormData();
    formData.append("ticket_id", ticket.ticket_id);
    formData.append("file", fileMessage);
    formData.append("is_admin", 1);
    formData.append("category", ticket.ticket_category);

    try {
      const response = await apiClient.post(`/chat/send-ticket/`, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadPercentage(progress);
        },
      });

      if (response.status === 201) {
        setShowFile(false);
        const newMessage = {
          file: URL.createObjectURL(fileMessage),
          date: new Date(),
          is_admin: true,
        };

        setSelectedTicket((prevMessages) => [...prevMessages, newMessage]);
        swal({
          title: "تیکت با موفقیت ارسال  شد",
          icon: "success",
          button: {
            text: "باشه",
          },
        });
      }
    } catch (e) {
      toast.error("مشکلی سمت سرور پیش آمده", {
        position: "top-left",
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftkey) {
      event.preventDefault();
      sendmessage();
    }
  };

  const getUserType = async () => {
    try {
      const response = await apiClient.get("/chat/get-user-type/");

      if (response.status === 200) {
        setUserType(response?.data);
      }
    } catch (e) {
      if (e.response?.status === 500) {
        toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
          position: "top-left",
        });
      }
    }
  };

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    updateWindowWidth();
    window.addEventListener("resize", updateWindowWidth);

    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);

  useEffect(() => {
    getAllTickets();
    getUserType();
  }, []);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    if (search.trim() === "") {
      setFilterValue([]);
      getAllTickets(1);
      setIsSearch(true);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      searchTickets(search.trim(), 1);
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    const allOpenTicket = allTickets?.filter(
      (ticket) => ticket?.ticket_close == false
    );
    setOpenTicket(allOpenTicket?.length);
  }, [allTickets]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket]);

  return (
    <div className={styles.wrapperpage}>
      <SideBar />
      <div className={styles.pagecontent}>
        <Header title={"تیکت ها"} />
        <div className={styles.maincontent}>
          {loading ? (
            <Loading />
          ) : (
            <>
              {windowWidth < 1025 ? (
                <>
                  <div className={styles.ButtonBox}>
                    <div
                      className={`${styles.Button} ${
                        tab === 1 || tab === 3 ? styles.activetab : ""
                      }`}
                      onClick={() => setTab(1)}
                    >
                      <span>تیکت ها</span>
                    </div>
                  </div>
                  {tab === 1 && (
                    <>
                      <div className={styles.topsec}>
                        <SearchBox
                          value={search}
                          onChange={setSearch}
                          placeholder={"جستوجو براساس شماره تیکت"}
                        />
                        <Filter
                          setOpenmodal={setOpenmodal}
                          all={resetTickets}
                          filters={[
                            {
                              label: "وضعیت",

                              submenuItems: [
                                {
                                  label: "باز",
                                  onClick: () => filterTicketsByStatus(false),
                                },
                                {
                                  label: "بسته",
                                  onClick: () => filterTicketsByStatus(true),
                                },
                              ],
                            },
                            {
                              label: "نوع تیکت",
                              onClick: () => console.log("filter by status"),
                              submenuItems: userType.map((item) => ({
                                label: item.name,
                                onClick: () =>
                                  filterTicketsByCategory(item?.id),
                              })),
                            },
                          ]}
                        />
                      </div>
                      <div className={styles.allTickets}>
                        {allTickets.length > 0 ? (
                          <div className={styles.TicketListBox}>
                            <div className={styles.text}>
                              <span>
                                تعداد کل تیکت‌ها: {allTickets.length} 
                              </span>
                              <span>تیکت‌های باز: {openTicket}</span>
                            </div>
                            {isSearch ? (
                              <p className="text-search">در حال جستوجو ...</p>
                            ) : (
                              <>
                                <InfiniteScroll
                                  dataLength={
                                    filterValue?.length > 0 ? filterValue : []
                                  }
                                  next={() => getAllTickets(page)}
                                  hasMore={hasMore}
                                  scrollableTarget="wrapp_orders"
                                >
                                  <div
                                    className={styles.TicketItemBox}
                                    id="wrapp_orders"
                                  >
                                    {filterValue?.length > 0 ? (
                                      <>
                                        {filterValue.map((ticket) => (
                                          <TicketItem
                                            key={ticket.ticket_id}
                                            ticket={ticket}
                                            onClick={() =>
                                              getSelectedTicket(ticket)
                                            }
                                            onCheckboxChange={
                                              handleTicketCloseChange
                                            }
                                          />
                                        ))}
                                      </>
                                    ) : (
                                      <NoneSearch />
                                    )}
                                  </div>
                                </InfiniteScroll>
                              </>
                            )}
                          </div>
                        ) : (
                          <>
                            <div className={styles.none_ticket}>
                              <SlSocialDropbox
                                className={styles.icon_ticket_none}
                              />
                              <p className={styles.ticket_text_none}>
                                موردی یافت نشد
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                  <div
                    className={`${
                      tab === 3 ? styles.TicketMassageBox : styles.noneBox
                    }`}
                  >
                    <div className={styles.MassageBox}>
                      {selectedTicket.length > 0 &&
                        selectedTicket.map((ticket) => (
                          <Massage key={ticket.ticket_id} tikectmsg={ticket} />
                        ))}
                      {showfile && (
                        <div
                          className="d-flex align-items-end mt-4 col-sm-12"
                          style={{ direction: "rtl" }}
                        >
                          <div
                            className="file-content"
                            style={{ position: "relative" }}
                          >
                            <a
                              className="place"
                              href="#"
                              target="blank"
                              download
                            >
                              <BsFillFileEarmarkArrowDownFill className="fileIcon file-right" />
                            </a>
                            <div className="progress-upload">
                              <div style={{ width: "55px", height: "55px" }}>
                                <CircularProgressbar
                                  minValue={0}
                                  maxValue={100}
                                  value={uploadPercentage}
                                  strokeWidth={5}
                                  background={false}
                                  styles={{
                                    path: {
                                      stroke: `#45ABE5`,
                                    },
                                    trail: {
                                      stroke: "#ffffff",
                                    },
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messageEndRef} />
                    </div>

                    {ticket?.ticket_close ? (
                      <>
                        <div
                          className={`${styles.wrapinpt_m_close} ${styles.close_ticket} d-flex align-items-center text-center`}
                        >
                          <span>تیکت بسته شد</span>
                          <CiLock className={styles.lockicon} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.wrapinpt_m}>
                          <div className={styles.file_wrapper}>
                            <label htmlFor="file" className={styles.labelfile}>
                              <MdAttachFile className={styles.fileicon_m} />
                            </label>
                            <input
                              type="file"
                              id="file"
                              onChange={(e) => sendFile(e)}
                              className={styles.input_tick}
                            />
                          </div>
                          <div className={styles.input_ticket_wrap}>
                            <input
                              className={styles.input_ticket}
                              type="text"
                              value={textInput}
                              onChange={(e) => setTextInput(e.target.value)}
                              maxLength={400}
                            />
                            <IoSend
                              className={styles.iconsend}
                              onClick={sendmessage}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.ButtonBox}>
                    <div
                      className={`${styles.Button1} ${styles.activetab}`}
                      onClick={() => setTab(1)}
                    >
                      <span>تیکت ها</span>
                    </div>
                  </div>
                  {tab === 1 && (
                    <>
                      <div className={styles.topsec}>
                        <SearchBox
                          value={search}
                          onChange={setSearch}
                          placeholder={"جستوجو براساس شماره تیکت"}
                        />
                        <Filter
                          setOpenmodal={setOpenmodal}
                          all={resetTickets}
                          filters={[
                            {
                              label: "وضعیت",

                              submenuItems: [
                                {
                                  label: "باز",
                                  onClick: () => filterTicketsByStatus(false),
                                },
                                {
                                  label: "بسته",
                                  onClick: () => filterTicketsByStatus(true),
                                },
                              ],
                            },
                            {
                              label: "نوع تیکت",
                              onClick: () => console.log("filter by status"),
                              submenuItems: userType.map((item) => ({
                                label: item.name,
                                onClick: () =>
                                  filterTicketsByCategory(item?.id),
                              })),
                            },
                          ]}
                        />
                      </div>
                      <div>
                        {allTickets.length > 0 ? (
                          <div className={styles.TicketListBox}>
                            <div className={styles.text}>
                              <span>
                                تعداد کل تیکت‌ها: {allTickets.length} 
                              </span>
                              <span>تیکت‌های باز: {openTicket}</span>
                            </div>
                            {isSearch ? (
                              <p className="text-search">در حال جستوجو ...</p>
                            ) : (
                              <InfiniteScroll
                                dataLength={
                                  filterValue?.length > 0 ? filterValue : []
                                }
                                next={() => getAllTickets(page)}
                                hasMore={hasMore}
                                scrollableTarget="wrapp_orders"
                              >
                                <div
                                  className={styles.TicketItemBox}
                                  id="wrapp_orders"
                                >
                                  {filterValue?.length > 0 ? (
                                    <>
                                      {filterValue.map((ticket) => (
                                        <TicketItem
                                          key={ticket.ticket_id}
                                          ticket={ticket}
                                          onClick={() =>
                                            getSelectedTicket(ticket)
                                          }
                                          onCheckboxChange={
                                            handleTicketCloseChange
                                          }
                                        />
                                      ))}
                                    </>
                                  ) : (
                                    <NoneSearch />
                                  )}
                                  {isFetchingMore && (
                                    <div className={styles.loadingContainer}>
                                      <LoadingInfity />
                                    </div>
                                  )}
                                </div>
                              </InfiniteScroll>
                            )}
                          </div>
                        ) : (
                          <div className={styles.none_ticket}>
                            <SlSocialDropbox
                              className={styles.icon_ticket_none}
                            />
                            <p className={styles.ticket_text_none}>
                              موردی یافت نشد
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <div
                    className={`${
                      tab === 3 ? styles.TicketMassageBox : styles.noneBox
                    }`}
                  >
                    <div className={styles.MassageBox}>
                      {selectedTicket.length > 0 &&
                        selectedTicket.map((ticket) => (
                          <Massage key={ticket.ticket_id} tikectmsg={ticket} />
                        ))}
                      {showfile && (
                        <div
                          className="d-flex align-items-end mt-4 col-sm-12 px-2"
                          style={{ direction: "rtl" }}
                        >
                          <div
                            className="file-content"
                            style={{ position: "relative" }}
                          >
                            <a
                              className="place"
                              href="#"
                              target="blank"
                              download
                            >
                              <BsFillFileEarmarkArrowDownFill className="fileIcon file-right" />
                            </a>
                            <div className="progress-upload">
                              <div style={{ width: "55px", height: "55px" }}>
                                <CircularProgressbar
                                  minValue={0}
                                  maxValue={100}
                                  value={uploadPercentage}
                                  strokeWidth={5}
                                  background={false}
                                  styles={{
                                    path: {
                                      stroke: `#45ABE5`,
                                    },
                                    trail: {
                                      stroke: "#ffffff",
                                    },
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messageEndRef} />
                    </div>
                    {ticket?.ticket_close ? (
                      <>
                        <div
                          className={`${styles.input_message_p}  ${styles.close_ticket} d-flex align-items-center`}
                        >
                          <span>تیکت بسته شد</span>
                          <CiLock className={styles.lockicon} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.input_message_p}>
                          <div className={styles.file_wrapper}>
                            <label htmlFor="file" className={styles.labelfile}>
                              <MdAttachFile className={styles.fileicon_m} />
                            </label>
                            <input
                              type="file"
                              id="file"
                              onChange={(e) => sendFile(e)}
                              className={styles.input_tick}
                            />
                          </div>

                          <div className={styles.input_ticket_wrap}>
                            <input
                              onKeyDown={handleKeyDown}
                              className={styles.input_ticket}
                              type="text"
                              value={textInput}
                              onChange={(e) => setTextInput(e.target.value)}
                              maxLength={400}
                            />
                            <IoSend
                              className={styles.iconsend}
                              onClick={sendmessage}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <ModalFilter
        openModal={openModal}
        setOpenmodal={setOpenmodal}
        filterOrdersByDate={filterTicketsByDate}
        isenglish={true}
      />
      <ToastContainer />
    </div>
  );
}
