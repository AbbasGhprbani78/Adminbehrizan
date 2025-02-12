import { useState } from "react";
import styles from "./Filter.module.css";
import { IoIosArrowDown } from "react-icons/io";
export default function Filter({ setOpenmodal, all }) {
  const [itemActive, setItemActive] = useState(1);
  return (
    <div className={styles.filterwrapper}>
      فیلتر بر اساس
      <IoIosArrowDown className={styles.arrow_icon} />
      <div
        className={`${styles.item_filter} ${styles.item_first} ${
          itemActive === 1 && styles.active
        }`}
        onClick={() => {
          all();
          setOpenmodal(false);
          setItemActive(1);
        }}
      >
        همه
      </div>
      <div
        className={`${styles.item_filter} ${styles.item_second} ${
          itemActive === 2 && styles.active
        }`}
        onClick={() => {
          setItemActive(2);
          setOpenmodal(true);
        }}
      >
        تاریخ
      </div>
    </div>
  );
}
