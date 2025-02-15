import React from 'react'
import styles from './Texteara.module.css'
export default function Texteara({ name, value, onChange, label }) {
    return (
        <div className={`${styles.textareawrapper} mt-4`}>
            <label className={styles.labeltextarea}>{label}</label>
            <textarea
                className={styles.textarea}
                name={name}
                value={value}
                onChange={onChange}
                maxLength={2000}
            ></textarea>
        </div>
    )
}
