import React from 'react'
import styles from './NoneSearch.module.css'
import { TfiFaceSad } from "react-icons/tfi";

export default function NoneSearch() {
    return (
        <div className="d-flex align-items-center justify-content-canter flex-column">
            <p className={styles.none_result}>
                موردی پیدا نشد
            </p>
            <TfiFaceSad className={styles.notfound} />
        </div>
    )
}
