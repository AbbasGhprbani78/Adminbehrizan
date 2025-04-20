import { useState } from "react";
import styles from "./SearchBox.module.css";
import { RiSearch2Line } from "react-icons/ri";
import { convertToPersianNumbers } from "../../../utils/helper";

export default function SearchBox({ value, onChange, placeholder }) {
  const [displayValue, setDisplayValue] = useState("");

  function handleInputChange(event) {
    const englishValue = event.target.value.replace(/[۰-۹]/g, (char) =>
      "۰۱۲۳۴۵۶۷۸۹".indexOf(char)
    );
    setDisplayValue(convertToPersianNumbers(englishValue));
    onChange(englishValue);
  }

  return (
    <div className={styles.searchboxwrapper}>
      <div className={styles.searchboxcontant}>
        <input
          value={displayValue}
          className={styles.inputsearch}
          name="search"
          onChange={handleInputChange}
          placeholder={placeholder}
          autoComplete="off"
          maxLength={200}
        />
        <div className={styles.searhiconwrapper}>
          <RiSearch2Line className={styles.searchicon} />
        </div>
      </div>
    </div>
  );
}
