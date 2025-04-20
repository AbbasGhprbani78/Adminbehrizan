import { useEffect, useState } from "react";
import styles from "./OrderTrackItem.module.css";
import { IoBagAddOutline } from "react-icons/io5";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { FiTruck } from "react-icons/fi";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { BsBox2 } from "react-icons/bs";
import { FaWpforms } from "react-icons/fa6";
import { AiOutlineFileDone } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
  addSlashesToDate,
  convertToPersianNumbers,
} from "../../../utils/helper";

export default function OrderTrackItem({ order, number }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [latestItem, setLatestItem] = useState(null);
  const navigate = useNavigate();

  function getFieldByStatus(order) {
    let fieldValue = "فیلد نامعتبر";
    switch (order?.status) {
      case "1":
        fieldValue = order.sal_order_date;
        break;
      case "2":
        fieldValue = order.confirm_date;
        break;
      case "3":
        fieldValue = order.final_confirm_date;
        break;
      case "4":
        fieldValue = order?.deliever_date_max;
        break;
      case "5":
        fieldValue = order?.deliever_date_max;
        break;
      case "7":
        fieldValue = order?.request_date;
        break;
      case "8":
        fieldValue = order?.request_date;
        break;
      default:
        fieldValue = "فیلد نامعتبر";
    }

    return fieldValue;
  }

  useEffect(() => {
    setLatestItem(order?.status);
  }, []);

  useEffect(() => {
    switch (latestItem) {
      case "7":
        setCurrentStep(1);
        break;
      case "8":
        setCurrentStep(2);
        break;
      case "1":
        setCurrentStep(3);
        break;
      case "2":
        setCurrentStep(4);
        break;
      case "3":
        setCurrentStep(5);
        break;
      case "4":
        setCurrentStep(6);
        break;
      case "5":
        setCurrentStep(7);
        break;
      case "6":
        setCurrentStep(8);
        break;
    }
  }, [latestItem]);

  return (
    <>
      <div className={styles.ordertrackitemwrapper}>
        <div className={styles.ordertrackdetail}>
          <div className={styles.rightdetail}>
            <span className={`${styles.titlebold} ${styles.number_order}`}>
              سفارش {convertToPersianNumbers(number + 1)}
            </span>
            <div className={styles.reqnumberwrapper}>
              <span className={styles.titlebold}>شماره درخواست :</span>
              <span style={{ marginRight: "10px" }}>
                {convertToPersianNumbers(order?.id)}
              </span>
            </div>
          </div>

          <div className={styles.leftdetail}>
            <div className={`${styles.numberorder}`}>
              <span style={{ marginLeft: "15px" }}>تعداد اقلام :</span>
              <span>{convertToPersianNumbers(order?.order_details_count)}</span>
            </div>
            <div>
              <span style={{ marginLeft: "15px" }}> تاریخ درخواست:</span>
              <span>
                {addSlashesToDate(convertToPersianNumbers(order?.request_date))}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.customer_name}>
          <span className={styles.titlebold}> مشتری : </span>
          <span style={{ fontSize: ".9rem" }}>{order?.user_full_name}</span>
        </div>
        <div className={`${styles.mapstatus} mt-4`}>
          <div className={styles.wrap_detail_icon}>
            <button
              className={`${styles.detailbtn}`}
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              جزئیات محصول
            </button>
          </div>
          <div className={styles.wrapper} style={{ direction: "ltr" }}>
            <div className={`${styles.progressc}`}>
              <div className={`${styles.pragressContainer}`}>
                <div
                  className={styles.progress}
                  style={{ width: `${(currentStep - 1) * 14.28}%` }}
                ></div>
                <div
                  className={`${styles.circle} ${
                    currentStep >= 1 ? `${styles.active}` : ""
                  }`}
                >
                  <FaWpforms
                    className={`${styles.iconstatus} ${
                      currentStep >= 1 ? `${styles.activeicon}` : ""
                    }`}
                  />
                  <p className={styles.itemprogtext}>صدور درخواست</p>
                </div>
                <div
                  className={`${styles.circle} ${
                    currentStep >= 2 ? `${styles.active}` : ""
                  }`}
                >
                  <AiOutlineFileDone
                    className={`${styles.iconstatus} ${
                      currentStep >= 2 ? `${styles.activeicon}` : ""
                    }`}
                  />
                  <p className={styles.itemprogtext}>تایید درخواست</p>
                </div>
                <div
                  className={`${styles.circle} ${
                    currentStep >= 3 ? `${styles.active}` : ""
                  }`}
                >
                  <IoBagAddOutline
                    className={`${styles.iconstatus} ${
                      currentStep >= 3 ? `${styles.activeicon}` : ""
                    }`}
                  />
                  <p className={styles.itemprogtext}>صدور سفارش</p>
                </div>
                <div
                  className={`${styles.circle} ${
                    currentStep >= 4 ? `${styles.active}` : ""
                  }`}
                >
                  <MdOutlineShoppingCartCheckout
                    className={`${styles.iconstatus} ${
                      currentStep >= 4 ? `${styles.activeicon}` : ""
                    }`}
                  />
                  <p className={styles.itemprogtext}>تایید فروش</p>
                </div>
                <div
                  className={`${styles.circle} ${
                    currentStep >= 5 ? `${styles.active}` : ""
                  }`}
                >
                  <IoMdDoneAll
                    className={`${styles.iconstatus} ${
                      currentStep >= 5 ? `${styles.activeicon}` : ""
                    }`}
                  />
                  <p className={styles.itemprogtext}>تایید نهایی</p>
                </div>
                <div
                  className={`${styles.circle} ${
                    currentStep >= 6 ? `${styles.active}` : ""
                  }`}
                >
                  <FiTruck
                    className={`${styles.iconstatus} ${
                      currentStep >= 6 ? `${styles.activeicon}` : ""
                    }`}
                  />
                  <p className={styles.itemprogtext}>در حال ارسال</p>
                </div>
                <div
                  className={`${styles.circle} ${
                    currentStep >= 7 ? `${styles.active}` : ""
                  }`}
                >
                  <BsBox2
                    className={`${styles.iconstatus} ${
                      currentStep >= 7 ? `${styles.activeicon}` : ""
                    }`}
                  />
                  <p className={styles.itemprogtext}>کامل ارسال شده</p>
                </div>
                <div
                  className={`${styles.circle} ${
                    currentStep >= 8 ? `${styles.active}` : ""
                  }`}
                >
                  <HiOutlineNewspaper
                    className={`${styles.iconstatus} ${
                      currentStep >= 8 ? `${styles.activeicon}` : ""
                    }`}
                  />
                  <p className={styles.itemprogtext}>مختومه</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div className={styles.orderdetailitem}>
            <span className={styles.orderdetailtitle}>
              {order.status == 6 ? "علت مختومه :" : "تاریخ اخرین وضعیت : "}
            </span>
            <span className={styles.orderdetailtext}>
              {order.status == 6
                ? order?.dismissreason
                : order?.request_date
                ? addSlashesToDate(
                    convertToPersianNumbers(getFieldByStatus(order))
                  )
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
