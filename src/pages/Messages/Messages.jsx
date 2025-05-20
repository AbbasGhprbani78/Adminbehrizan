import styles from "./Messages.module.css";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
import UserItemMessage from "../../components/module/UserItemMessage/UserItemMessage";
import {
  Box,
  Grid,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import swal from "sweetalert";
import "react-toastify/dist/ReactToastify.css";
import { Table } from "react-bootstrap";
import { convertToPersianNumbers } from "../../utils/helper";
import apiClient from "../../config/axiosConfig";
import SearchBox from "../../../../behrizanpanel/src/components/module/SearchBox/SearchBox";
import Filter from "../../../../behrizanpanel/src/components/module/Filter/Filter";
import InfiniteScroll from "react-infinite-scroll-component";
import ModalFilter from "../../../../behrizanpanel/src/components/module/ModalFilter/ModalFilter";
import NoneSearch from "../../../../behrizanpanel/src/components/module/NoneSearch/NoneSearch";
import LoadingInfity from "../../../../behrizanpanel/src/components/module/Loading/LoadingInfinity";
import Loading from "../../components/module/Loading/Loading";
export default function Messages() {
  const [isSmsTab, setIsSmsTab] = useState(false);
  const [allSms, setAllsms] = useState([]);
  const [filterSms, setFiltersms] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filtredUsers, setFiltredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [disablebtn, setDisableBtn] = useState(false);
  const [openModal, setOpenmodal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isSearch, setIsSearch] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [messageInfo, setMessageInfo] = useState({
    supplier_codes: [],
    message_text: "",
  });

  const chnageHandler = (e) => {
    const { name, value } = e.target;
    setMessageInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheck = (id) => {
    setMessageInfo((prev) => {
      const alreadyExists = prev.supplier_codes.includes(id);
      return {
        ...prev,
        supplier_codes: alreadyExists
          ? prev.supplier_codes.filter((code) => code !== id)
          : [...prev.supplier_codes, id],
      };
    });
  };

  const getAllUsers = async () => {
    try {
      const response = await apiClient.get(`/user/users/`);
      if (response.status == 200) {
        setAllUsers(response.data);
        setFiltredUsers(response.data);
      }
    } catch (error) {
      toast.error("مشکلی سمت سرور پیش آمده", {
        position: "top-left",
      });
    }
  };

  const searchHandler = useCallback(
    (value) => {
      setSearch(value);
      if (!value) {
        setFiltredUsers(allUsers);
      } else {
        const filterSearch = allUsers.filter((item) =>
          item.full_name?.toLowerCase().includes(value.toLowerCase())
        );
        setFiltredUsers(filterSearch);
      }
    },
    [allUsers]
  );

  const toggleSelectAll = () => {
    const allIds = filtredUsers.map((u) => u.supplier_code);
    const areAllSelected = allIds.every((id) =>
      messageInfo.supplier_codes.includes(id)
    );

    setMessageInfo((prev) => ({
      ...prev,
      supplier_codes: areAllSelected ? [] : allIds,
    }));
  };

  const sendMessage = async () => {
    if (messageInfo.supplier_codes.length === 0) {
      toast.error("کد  نمی‌تواند خالی باشد", {
        position: "top-left",
      });
      return;
    }

    if (messageInfo.message_text.trim() === "") {
      toast.error("متن پیام نمی‌تواند خالی باشد.", {
        position: "top-left",
      });
      return;
    }
    setDisableBtn(true);
    try {
      const response = await apiClient.post(`/app/send-sms/`, messageInfo);
      if (response.status == 200) {
        swal({
          title: "پیام با موفقیت ارسال  شد",
          icon: "success",
          button: {
            text: "باشه",
          },
        });
        setMessageInfo({
          supplier_codes: [],
          message_text: "",
        });
      }
    } catch (error) {
      toast.error("مشکلی سمت سرور پیش آمده", {
        position: "top-left",
      });
    } finally {
      setDisableBtn(false);
    }
  };

  const getAllSms = async (page = 1, page_size = 25) => {
    if (page === 1 && firstLoad) setLoading(true);
    if (page > 1) setIsFetchingMore(true);

    try {
      const response = await apiClient.get("/app/get-all-sms/", {
        params: { page, page_size },
      });

      if (response.status === 200) {
        setAllsms((prev) =>
          page === 1
            ? response.data.results
            : [...prev, ...response.data.results]
        );
        setFiltersms((prev) =>
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
      setIsSearch(false);
      if (firstLoad) setFirstLoad(false);
    }
  };

  const searchSms = async (query, page = 1, page_size = 25) => {
    if (!query.trim()) return;

    if (page === 1) setIsSearch(true);
    if (page > 1) setIsFetchingMore(true);

    try {
      const response = await apiClient.get("/app/get-all-sms/", {
        params: { search: query, page, page_size },
      });

      if (response.status === 200) {
        const newResults =
          Array.isArray(response.data) && response.data.length === 0
            ? []
            : response.data?.results || [];

        setFiltersms((prev) =>
          page === 1 ? newResults : [...prev, ...newResults]
        );

        if (response.data.results.length < page_size) {
          setHasMore(false);
        } else {
          setPage(page + 1);
        }
      }
    } catch (e) {
      if (e.response?.status !== 404) {
        toast.error("مشکلی سمت سرور پیش آمده", {
          position: "top-left",
        });
      }
    } finally {
      setIsSearch(false);
      setIsFetchingMore(false);
      if (firstLoad) setFirstLoad(false);
    }
  };

  const filterTicketsByDate = async (
    startDate,
    endDate,
    page = 1,
    page_size = 10
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
      const response = await apiClient.get("/app/get-all-sms/", {
        params: {
          page,
          page_size,
          start_date: startDateFormatted,
          end_date: endDateFormatted,
        },
      });

      setSearch("");

      if (response.status === 200) {
        setFiltersms((prev) =>
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

  const resetTickets = () => {
    setFiltersms([]);
    getAllSms(1);
    setIsSearch(true);
    setPage(1);
    setHasMore(true);
  };

  useEffect(() => {
    getAllUsers();
    getAllSms();
  }, []);

  useEffect(() => {
    setPage(1);
    setHasMore(true);

    if (search.trim() === "") {
      setFiltersms([]);
      getAllSms(1);
      setIsSearch(true);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      searchSms(search.trim(), 1);
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className={styles.wrapperpage}>
      <SideBar />
      <div className={styles.pagecontent}>
        <Header title={"پیام ها"} />
        <div className={styles.wrap_btn}>
          <button
            className={styles.btn_send_tab}
            onClick={() => setIsSmsTab((prev) => !prev)}
          >
            {isSmsTab ? "لیست پیام " : "ارسال پیام جدید"}
          </button>
        </div>

        {isSmsTab ? (
          <>
            <Box sx={{ flexGrow: 1, marginTop: "1.5rem" }}>
              <Grid
                container
                spacing={{ xs: 0, md: 5 }}
                sx={{ paddingTop: 0 }}
                className={styles.grid_container}
              >
                <Grid item xs={12} md={8} sx={{ paddingTop: 0 }}>
                  <div className={styles.text_texteara}>
                    <p className={styles.text_message}>متن پیام</p>
                    <textarea
                      name="message_text"
                      value={messageInfo.message_text}
                      onChange={chnageHandler}
                      className={styles.texteara}
                      maxLength={100}
                    ></textarea>
                    <button
                      className={`${styles.btn_message} ${
                        disablebtn && styles.disable
                      }`}
                      onClick={sendMessage}
                      disabled={disablebtn}
                    >
                      ارسال پیام
                    </button>
                  </div>
                </Grid>
                <Grid item xs={12} md={4} sx={{ paddingTop: 0 }}>
                  <div className={styles.list_users_container}>
                    <div className={styles.top_list}>
                      <span className={styles.list_text}>مخاطبان</span>
                      <span
                        className={styles.text_check_all}
                        onClick={toggleSelectAll}
                      >
                        انتخاب همه
                      </span>
                    </div>
                    <div className={styles.topsec}>
                      <input
                        type="text"
                        placeholder={"جستجو ..."}
                        value={search || ""}
                        onChange={(e) => searchHandler(e.target.value)}
                        maxLength={200}
                        style={{
                          padding: "10px",
                          border: "none",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div className={styles.list_users}>
                      {filtredUsers?.length > 0 ? (
                        filtredUsers.map((item) => (
                          <UserItemMessage
                            key={item?.supplier_code}
                            item={item}
                            onCheck={handleCheck}
                            isChecked={messageInfo.supplier_codes.includes(
                              item.supplier_code
                            )}
                          />
                        ))
                      ) : (
                        <p style={{ padding: "10px" }}>کاربر یافت نشد !!</p>
                      )}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          <>
            <div className={styles.topsec}>
              <SearchBox
                value={search}
                onChange={setSearch}
                placeholder={"جستوجو براساس نام مشتری و شماره تماس "}
              />
              <Filter
                setOpenmodal={setOpenmodal}
                all={resetTickets}
                filters={[]}
              />
            </div>
            {loading ? (
              <Loading />
            ) : (
              <>
                {isSearch ? (
                  <p className="text-search">در حال جستوجو ...</p>
                ) : (
                  <InfiniteScroll
                    dataLength={filterSms?.length > 0 ? filterSms : []}
                    next={() => getAllSms(page)}
                    hasMore={hasMore}
                    scrollableTarget="wrapp_ordtable_wrapperers"
                  >
                    <div className={styles.table_wrapper} id="wrapp_orders">
                      {filterSms?.length > 0 ? (
                        <>
                          {filterSms?.map((item) => (
                            <TableContainer
                              style={{
                                maxHeight: 400,
                                margin: "10px 0",
                                overflowX: "auto",
                                scrollbarWidth: "none",
                              }}
                              className={styles.wrap_table}
                              key={item.id}
                              sx={{
                                "&::-webkit-scrollbar": {
                                  display: "none",
                                },
                              }}
                            >
                              <Table style={{ minWidth: "max-content" }}>
                                <TableHead>
                                  <TableRow>
                                    <TableCell
                                      align="center"
                                      style={{
                                        position: "sticky",
                                        top: 0,
                                        backgroundColor: "#fff",
                                        fontFamily: "iranYekan",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      نام مشتری
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      style={{
                                        position: "sticky",
                                        top: 0,
                                        backgroundColor: "#fff",
                                        fontFamily: "iranYekan",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      شماره تماس
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      style={{
                                        position: "sticky",
                                        top: 0,
                                        backgroundColor: "#fff",
                                        fontFamily: "iranYekan",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      تاریخ
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      style={{
                                        position: "sticky",
                                        top: 0,
                                        backgroundColor: "#fff",
                                        fontFamily: "iranYekan",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      متن پیام
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell
                                      align="center"
                                      sx={{
                                        width: "240px",
                                        fontFamily: "iranYekan",
                                      }}
                                    >
                                      {item?.user_full_name}
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      sx={{
                                        width: "300px",
                                        fontFamily: "iranYekan",
                                      }}
                                    >
                                      {convertToPersianNumbers(
                                        item?.phone_number
                                      )}
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      sx={{ fontFamily: "iranYekan" }}
                                    >
                                      {convertToPersianNumbers(
                                        item?.shamsi_date
                                      )}
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      sx={{ fontFamily: "iranYekan" }}
                                    >
                                      {item?.text}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
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
              </>
            )}
          </>
        )}
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
