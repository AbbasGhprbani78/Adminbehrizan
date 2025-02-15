import { useEffect, useState } from "react";
import styles from "./TicketItem.module.css";
import { HiOutlineMailOpen } from "react-icons/hi";
import { HiOutlineMail } from "react-icons/hi";
import axios from "axios";
export default function TicketItem({ ticket, onClick, onCheckboxChange }) {
  const [windowWidth, setWindowWidth] = useState(0);
  const [isClose, setIsClose] = useState(ticket?.ticket_close);
  const apiUrl = import.meta.env.VITE_API_URL;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR");
  };

  const closeTicketHnadler = async (e) => {
    const checked = e.target.checked ? 1 : 0;
    setIsClose(checked);
    onCheckboxChange(ticket.ticket_id, checked);

    const access = localStorage.getItem("access");
    const headers = {
      Authorization: `Bearer ${access}`,
    };

    const body = {
      ticket_id: ticket.ticket_id,
      close: checked,
    };

    try {
      await axios.put(`${apiUrl}/app/ticket-admin/`, body, { headers });
    } catch (e) {
      console.log(e);
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

  return (
    <>
      {windowWidth < 768 ? (
        <>
          <div className={styles.TicketLine_m}>
            <div className="d-flex align-items-center" onClick={onClick}>
              {ticket.ticket_close ? (
                <HiOutlineMail className={styles.ticketicon} />
              ) : (
                <HiOutlineMailOpen className={styles.ticketicon} />
              )}
              <div className="">
                <span className="fw-bold">
                  {ticket?.ticket_informations[0]?.title}
                </span>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <span>{formatDate(ticket?.ticket_informations[0]?.date)}</span>
              <label className={styles.custom_checkbox}>
                <input
                  type="checkbox"
                  className={styles.checkbox_input}
                  checked={isClose}
                  onChange={(e) => closeTicketHnadler(e)}
                />
                <span className={styles.checkmark}></span>
                <span className={styles.label_text}>بستن تیکت</span>
              </label>
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
              <span className="fw-bold">
                {ticket?.ticket_informations[0]?.title}
              </span>
            </div>
            <div className={styles.wrapper_left_ticket}>
              <span>{formatDate(ticket?.ticket_informations[0]?.date)}</span>
              <label className={styles.custom_checkbox}>
                <input
                  type="checkbox"
                  className={styles.checkbox_input}
                  checked={isClose}
                  onChange={(e) => closeTicketHnadler(e)}
                />
                <span className={styles.checkmark}></span>
                <span className={styles.label_text}>بستن تیکت</span>
              </label>
            </div>
          </div>
        </>
      )}
    </>
  );
}
