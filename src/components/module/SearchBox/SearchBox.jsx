import React from 'react'
import styles from './SearchBox.module.css'
import { RiSearch2Line } from "react-icons/ri";
export default function SearchBox({ value, onChange, placeholder }) {
    return (
        <div className={styles.searchboxwrapper}>
            <div className={styles.searchboxcontant}>
                <input
                    value={value}
                    className={styles.inputsearch}
                    name='search'
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete='off'
                />
                <div className={styles.searhiconwrapper}>
                    <RiSearch2Line className={styles.searchicon} />
                </div>
            </div>
        </div>
    )
}
