"use client";
import { useEffect, useState, useRef } from "react";
import styles from "../../styles/Ticket.module.css";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
import { SlSocialDropbox } from "react-icons/sl";
import TicketItem from "../../components/module/TicketItem/TicketItem";
import Massage from "../../components/module/Massage/Massage";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import swal from "sweetalert";
import { MdAttachFile } from "react-icons/md";
import { CircularProgressbar } from "react-circular-progressbar";
import { BsFillFileEarmarkArrowDownFill } from "react-icons/bs";
import { CiLock } from "react-icons/ci";
import Loading from "../../components/module/Loading/Loading";
import useSWR from "swr";
const apiUrl = import.meta.env.VITE_API_URL;
const fetcher = async (url) => {
  const access = localStorage.getItem("access");
  const headers = {
    Authorization: `Bearer ${access}`,
  };
  const response = await axios.get(url, { headers });
  if (response.status === 200) {
    return response.data;
  }
};

export default function Ticket() {
  const [tab, setTab] = useState(1);
  const [windowWidth, setWindowWidth] = useState(0);
  // const [allTickets, setAllTickets] = useState([]);
  const [openTicket, setOpenTicket] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [ticket, setTicket] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const messageEndRef = useRef(null);
  const [showfile, setShowFile] = useState(false);

  const {
    data: allTickets,
    mutate,
    isLoading,
  } = useSWR(`${apiUrl}/app/ticket-admin/`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 15 * 60 * 1000,
  });

  // const getAllTicket = async () => {
  //   setLoading(true);
  //   const access = localStorage.getItem("access");
  //   const headers = {
  //     Authorization: `Bearer ${access}`,
  //   };

  //   try {
  //     const response = await axios.get(`${apiUrl}/app/ticket-admin/`, {
  //       headers,
  //     });

  //     if (response.status === 200) {
  //       console.log(response.data);
  //       setAllTickets(response.data);
  //     }
  //   } catch (e) {
  //     if (e.response?.status === 401) {
  //       localStorage.removeItem("access");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleTicketCloseChange = (ticketId, isChecked) => {
    if (!allTickets) return;

    mutate(
      (prevTickets) =>
        prevTickets?.map((ticket) =>
          ticket.ticket_id === ticketId
            ? { ...ticket, ticket_close: isChecked }
            : ticket
        ) || [],
      false
    );

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
      const access = localStorage.getItem("access");
      const headers = {
        Authorization: `Bearer ${access}`,
      };

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
        const response = await axios.post(
          `${apiUrl}/chat/send-ticket/`,
          formData,
          {
            headers,
          }
        );

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
        console.log(e);
      }
    }
  };

  const sendFile = async (e) => {
    const maxSize = 1 * 1024 * 1024;
    const access = localStorage.getItem("access");
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

    const headers = {
      Authorization: `Bearer ${access}`,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/chat/send-ticket/`,
        formData,
        {
          headers,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadPercentage(progress);
          },
        }
      );

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
      console.log(e);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftkey) {
      event.preventDefault();
      sendmessage();
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
          {isLoading ? (
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
                    <div className={styles.allTickets}>
                      {allTickets.length > 0 ? (
                        <div className={styles.TicketListBox}>
                          <div className={styles.text}>
                            <span>تعداد کل تیکت‌ها: {allTickets.length} </span>
                            <span>تیکت‌های باز: {openTicket}</span>
                          </div>
                          <div className={styles.TicketItemBox}>
                            {allTickets
                              .slice()
                              .reverse()
                              .map((ticket) => (
                                <TicketItem
                                  key={ticket.ticket_id}
                                  ticket={ticket}
                                  onClick={() => getSelectedTicket(ticket)}
                                  onCheckboxChange={handleTicketCloseChange}
                                />
                              ))}
                          </div>
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
                    <div>
                      {allTickets.length > 0 ? (
                        <div className={styles.TicketListBox}>
                          <div className={styles.text}>
                            <span>تعداد کل تیکت‌ها: {allTickets.length} </span>
                            <span>تیکت‌های باز: {openTicket}</span>
                          </div>
                          <div className={styles.TicketItemBox}>
                            {allTickets
                              .slice()
                              .reverse()
                              .map((ticket) => (
                                <TicketItem
                                  key={ticket.ticket_id}
                                  ticket={ticket}
                                  onClick={() => getSelectedTicket(ticket)}
                                  onCheckboxChange={handleTicketCloseChange}
                                />
                              ))}
                          </div>
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
    </div>
  );
}
