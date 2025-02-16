import { useState } from "react";
import styles from "./ModalFilter.module.css";
import { CiCalendarDate } from "react-icons/ci";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Calendar } from "react-multi-date-picker";
import DateObject from "react-date-object";

export default function ModalFilter({
  setOpenmodal,
  openModal,
  filterOrdersByDate,
}) {
  const [selectedDayRange, setSelectedDayRange] = useState([null, null]);
  const [shamsiRange, setShamsiRange] = useState(["", ""]);

  const handleDateChange = (dates) => {
    setSelectedDayRange(dates);

    if (dates[0] && dates[1]) {
      setShamsiRange([
        new DateObject(dates[0]).convert(persian).format("YYYY/MM/DD"),
        new DateObject(dates[1]).convert(persian).format("YYYY/MM/DD"),
      ]);
    } else {
      setShamsiRange(["", ""]);
    }
  };

  const handleDateFilter = () => {
    if (shamsiRange[0] && shamsiRange[1]) {
      filterOrdersByDate(shamsiRange[0], shamsiRange[1], 1);
      setOpenmodal(false);
    }
  };

  return (
    <div
      className={`${styles.modal_container} ${openModal ? styles.active : ""}`}
    >
      <div
        className={styles.close_modal}
        onClick={() => setOpenmodal(false)}
      ></div>
      <div
        className={`${styles.modal_content} ${
          openModal ? styles.data_content : ""
        }`}
      >
        <div className={styles.date_picker_container}>
          <div className={styles.date_header}>
            <span className={styles.date_text}>انتخاب تاریخ</span>
          </div>
          <div className={styles.wrapper_calender}>
            <div className={styles.date_show_range}>
              <div className="mb-4">
                <p>از تاریخ</p>
                <div className={styles.date_input_wrapper}>
                  <input
                    type="text"
                    className={styles.date_input}
                    value={shamsiRange[0]}
                    readOnly
                  />
                  <CiCalendarDate className={styles.icon_ca} />
                </div>
              </div>
              <div className="mb-4">
                <p>تا تاریخ</p>
                <div className={styles.date_input_wrapper}>
                  <input
                    type="text"
                    className={styles.date_input}
                    value={shamsiRange[1]}
                    readOnly
                  />
                  <CiCalendarDate className={styles.icon_ca} />
                </div>
              </div>
            </div>
            <Calendar
              range
              value={selectedDayRange}
              onChange={handleDateChange}
              calendar={persian}
              locale={persian_fa}
              weekStartDayIndex={6}
              className={styles.custom_calendar}
            />
          </div>
          <div className="text-center">
            <button className={styles.calender_btn} onClick={handleDateFilter}>
              اعمال
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
