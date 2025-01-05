import React from 'react'
import styles from './UserFilterItem.module.css'
export default function UserFilterItem({ item }) {

    return (
        <div className={styles.user_wrapper}>
            <span className={styles.userInfo}>{item?.user_full_name}</span>
        </div>
    )
}
