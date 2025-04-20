import React, { useState } from "react";
import styles from "./Select.module.css";

const provinces = [
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "اردبیل",
  "اصفهان",
  "البرز",
  "ایلام",
  "بوشهر",
  "تهران",
  "چهارمحال و بختیاری",
  "خراسان جنوبی",
  "خراسان رضوی",
  "خراسان شمالی",
  "خوزستان",
  "زنجان",
  "سمنان",
  "سیستان و بلوچستان",
  "فارس",
  "قزوین",
  "قم",
  "کردستان",
  "کرمان",
  "کرمانشاه",
  "کهگیلویه و بویراحمد",
  "گلستان",
  "گیلان",
  "لرستان",
  "مازندران",
  "مرکزی",
  "هرمزگان",
  "همدان",
  "یزد",
];

export default function Select({ value, onChange, label, icon: Icon }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredProvinces = provinces.filter((province) =>
    province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onChange(e.target.value);
  };

  const handleSelectProvince = (province) => {
    setSearchTerm(province);
    onChange(province);
    setIsDropdownOpen(false);
  };

  return (
    <div className={`${styles.container} mt-4`}>
      <label className={styles.lableinput}>{label}</label>
      <input
        type="text"
        value={searchTerm || value}
        onChange={handleSearchChange}
        className={styles.input}
        onFocus={() => setIsDropdownOpen(true)}
        maxLength={200}
      />
      <Icon className={styles.icon} />
      {isDropdownOpen && (
        <ul className={styles.dropdown}>
          {filteredProvinces.map((province, index) => (
            <li
              key={index}
              onClick={() => handleSelectProvince(province)}
              className={styles.dropdownitem}
            >
              {province}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
