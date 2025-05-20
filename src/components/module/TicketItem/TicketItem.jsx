import { useEffect, useState } from "react";
import styles from "./TicketItem.module.css";
import { HiOutlineMailOpen } from "react-icons/hi";
import { HiOutlineMail } from "react-icons/hi";
import apiClient from "../../../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { convertToPersianNumbers } from "../../../utils/helper";
import swal from "sweetalert";
export default function TicketItem({ ticket, onClick }) {
  const [windowWidth, setWindowWidth] = useState(0);
  const [isClose, setIsClose] = useState(ticket?.ticket_close);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR");
  };

  const closeTicket = async () => {
    const willclose = await swal({
      title: isClose
        ? "ایا از بازکردن تیکت اطمینان دارید ؟"
        : "آیا از بستن تیکت اطمینان دارید ؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    });

    if (willclose) {
      try {
        const body = {
          ticket_id: ticket.ticket_id,
          close: !isClose,
        };
        setIsLoading(true);

        const response = await apiClient.put(`/app/ticket-admin/`, body);

        if (response.status === 200) {
          setIsClose(!isClose);
          ticket.ticket_close = !isClose;
          ticket.ticket_close_date = !isClose
            ? response.data.ticket_close_date
            : null;

          swal({
            title: "وضعیت تیکت با موفقیت تغییر کرد",
            icon: "success",
            button: "باشه",
          });
        }
      } catch (e) {
        if (e.response?.status === 500) {
          toast.error(e.response?.data?.message || "مشکلی سمت سرور پیش آمده", {
            position: "top-left",
          });
        }
      } finally {
        setIsLoading(false);
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

  console.log(ticket);
  return (
    <>
      {windowWidth < 1136 ? (
        <>
          <div className={styles.TicketLine_m}>
            <div className="d-flex align-items-center" onClick={onClick}>
              {ticket.ticket_close ? (
                <HiOutlineMail className={styles.ticketicon} />
              ) : (
                <HiOutlineMailOpen className={styles.ticketicon} />
              )}
              <span className={styles.number_ticket}>
                {convertToPersianNumbers(ticket.ticket_id)}_
              </span>
              <span className="fw-bold">
                {ticket?.ticket_informations[0]?.title}
              </span>
            </div>
            <div className={styles.wrap_date}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "1rem 0",
                }}
              >
                <span className={styles.open} style={{ marginLeft: "5px" }}>
                  تاریخ ایجاد تیکت
                </span>
                <span> : {formatDate(ticket?.ticket_date)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "1rem 0",
                }}
              >
                <span className={styles.closed} style={{ marginLeft: "5px" }}>
                  تاریخ بسته شدن تیکت
                </span>
                <span>
                  {" "}
                  :{" "}
                  {ticket?.ticket_close_date
                    ? formatDate(ticket?.ticket_close_date)
                    : " _ "}
                </span>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button
                className={`${styles.btn_ticket} ${
                  isLoading && styles.disable_btn_ticket
                }`}
                onClick={closeTicket}
                disabled={isLoading}
              >
                {isClose ? "باز کردن تیکت" : "بستن تیکت"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={`${styles.TicketLine}`}>
            <div className="d-flex align-items-center" onClick={onClick}>
              {ticket.ticket_close ? (
                <HiOutlineMail className={styles.ticketicon} />
              ) : (
                <HiOutlineMailOpen className={styles.ticketicon} />
              )}
              <span className={styles.number_ticket}>
                {convertToPersianNumbers(ticket.ticket_id)}_
              </span>
              <span className="fw-bold">
                {ticket?.ticket_informations[0]?.title}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <span className={styles.closed} style={{ marginLeft: "5px" }}>
                تاریخ بسته شدن تیکت
              </span>
              <span>
                :
                {ticket?.ticket_close_date
                  ? formatDate(ticket?.ticket_close_date)
                  : " _ "}
              </span>
            </div>
            <div className={styles.wrapper_left_ticket}>
              <span>تاریخ ایجاد تیکت : </span>
              <span style={{ margin: "0 10px" }}>
                {formatDate(ticket?.ticket_date)}
              </span>

              <button
                className={`${styles.btn_ticket} ${
                  isLoading && styles.disable_btn_ticket
                }`}
                onClick={closeTicket}
                disabled={isLoading}
              >
                {isClose ? "باز کردن تیکت" : "بستن تیکت"}
              </button>
            </div>
          </div>
          <ToastContainer />
        </>
      )}
    </>
  );
}
