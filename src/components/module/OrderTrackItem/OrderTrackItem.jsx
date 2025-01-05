
import React, { useEffect, useState } from 'react'
import styles from './OrderTrackItem.module.css'
import { IoBagAddOutline } from "react-icons/io5";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { FiTruck } from "react-icons/fi";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { BsBox2 } from "react-icons/bs";
import { FaWpforms } from "react-icons/fa6";
import { AiOutlineFileDone } from "react-icons/ai";
import { Link } from 'react-router-dom';

export default function OrderTrackItem({ order, number }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [allNumberSold, setAllNumberSold] = useState(0)
    const [latestItem, setLatestItem] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fa-IR");
    };


    useEffect(() => {
        const latest = order?.order_details[0]?.status_details?.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

        setLatestItem(latest?.status_name);
    }, []);


    useEffect(() => {
        switch (latestItem) {
            case 1:
                setCurrentStep(1);
                break;
            case 2:
                setCurrentStep(2);
                break;
            case 3:
                setCurrentStep(3);
                break;
            case 4:
                setCurrentStep(4);
                break;
            case 5:
                setCurrentStep(5);
                break;
            case 6:
                setCurrentStep(6);
                break;
            case 7:
                setCurrentStep(7);
                break;
            case 8:
                setCurrentStep(8);
                break;
        }
    }, [latestItem]);



    const calcTotalNumberSold = () => {
        let number = 0;
        if (order) {
            number = order.order_details?.reduce(
                (prev, current) => prev + current.number_sold,
                0
            );
            setAllNumberSold(number);
        }
        setAllNumberSold(number);

    }

    useEffect(() => {
        calcTotalNumberSold()
    }, [order])


    return (
        <div className={styles.ordertrackitemwrappper}>
            <div className={styles.ordertrackdetail}>
                <div className={styles.rightdetail}>
                    <span className={styles.titlebold}>سفارش {number + 1}</span>
                    <div className={styles.reqnumberwrapper} style={{ marginRight: "30px" }}>
                        <span className={styles.titlebold}>شماره درخواست :</span>
                        <span style={{ marginRight: "10px" }}>{order?.cart_id}</span>
                    </div>
                </div>
                <div className={styles.leftdetail}>
                    <div className={`${styles.numberorder} mx-5`}>
                        <span style={{ marginLeft: "15px" }}>تعداد سفارش :</span>
                        <span>{allNumberSold}</span>
                    </div>
                    <div>
                        <span style={{ marginLeft: "15px" }}>تاریخ سفارش :</span>
                        <span>{formatDate(order?.date_time)}</span>
                    </div>
                </div>
            </div>
            <div className={`${styles.mapstatus} mt-4`}>

                <div className={styles.wrap_link_number}>
                    <span className={styles.number_mobile}>تعداد سفارش : {allNumberSold}</span>
                    <Link to={`/orders/${order.cart_id}`} className={styles.detailbtn}>
                        جزئیات
                    </Link>

                </div>

                {/* <span>تعداد سفارش : {}</span> */}

                <div className={styles.wrapper} style={{ direction: "ltr" }}>
                    <div className={`${styles.progressc}`}>
                        <div className={`${styles.pragressContainer}`}>
                            <div className={styles.progress} style={{ width: `${(currentStep - 1) * 14.28}%` }}></div>
                            <div className={`${styles.circle} ${currentStep >= 1 ? `${styles.active}` : ''}`}>
                                <FaWpforms className={`${styles.iconstatus} ${currentStep >= 1 ? `${styles.activeicon}` : ''}`} />
                                <p className={styles.itemprogtext}>صدور درخواست</p>
                            </div>
                            <div className={`${styles.circle} ${currentStep >= 2 ? `${styles.active}` : ''}`}>
                                <AiOutlineFileDone className={`${styles.iconstatus} ${currentStep >= 2 ? `${styles.activeicon}` : ''}`} />
                                <p className={styles.itemprogtext}>تایید درخواست</p>
                            </div>
                            <div className={`${styles.circle} ${currentStep >= 3 ? `${styles.active}` : ''}`}>
                                <IoBagAddOutline className={`${styles.iconstatus} ${currentStep >= 3 ? `${styles.activeicon}` : ''}`} />
                                <p className={styles.itemprogtext}>صدور سفارش</p>
                            </div>
                            <div className={`${styles.circle} ${currentStep >= 4 ? `${styles.active}` : ''}`}>
                                <MdOutlineShoppingCartCheckout className={`${styles.iconstatus} ${currentStep >= 4 ? `${styles.activeicon}` : ''}`} />
                                <p className={styles.itemprogtext}>تایید فروش</p>
                            </div>
                            <div className={`${styles.circle} ${currentStep >= 5 ? `${styles.active}` : ''}`}>
                                <IoMdDoneAll className={`${styles.iconstatus} ${currentStep >= 5 ? `${styles.activeicon}` : ''}`} />
                                <p className={styles.itemprogtext}>تایید نهایی</p>
                            </div>
                            <div className={`${styles.circle} ${currentStep >= 6 ? `${styles.active}` : ''}`}>
                                <FiTruck className={`${styles.iconstatus} ${currentStep >= 6 ? `${styles.activeicon}` : ''}`} />
                                <p className={styles.itemprogtext}>در حال ارسال</p>
                            </div>
                            <div className={`${styles.circle} ${currentStep >= 7 ? `${styles.active}` : ''}`}>
                                <BsBox2 className={`${styles.iconstatus} ${currentStep >= 7 ? `${styles.activeicon}` : ''}`} />
                                <p className={styles.itemprogtext}>کامل ارسال شده</p>
                            </div>
                            <div className={`${styles.circle} ${currentStep >= 8 ? `${styles.active}` : ''}`}>
                                <HiOutlineNewspaper className={`${styles.iconstatus} ${currentStep >= 8 ? `${styles.activeicon}` : ''}`} />
                                <p className={styles.itemprogtext}>مختومه</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
