import React from 'react'
import styles from './Filter.module.css'
import { IoIosArrowDown } from "react-icons/io";
export default function Filter({ setOpenmodal, all }) {
    return (
        <div className={styles.filterwrapper}>
            فیلتر بر اساس
            <IoIosArrowDown className={styles.arrow_icon} />
            <div className={`${styles.item_filter} ${styles.item_first}`} onClick={() => {
                all()
                setOpenmodal("")
            }}>همه</div>
            <div className={`${styles.item_filter} ${styles.item_second}`} onClick={() => setOpenmodal("date")}>تاریخ</div>
            <div className={`${styles.item_filter} ${styles.item_third}`} onClick={() => setOpenmodal("user")}>کاربر</div>
        </div>

    )
}
