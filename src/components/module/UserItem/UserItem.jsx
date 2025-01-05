import React from 'react'
import styles from './UserItem.module.css'
export default function UserItem({ user, setMainUser, setShowChat }) {
    return (
        <div className={styles.useritem} onClick={() => { setShowChat(true), setMainUser(user) }}>
            <div className={styles.image_user_wrappper}>
                <img src="/images/user2.jpg" alt="" />
            </div>
            <span className={styles.user_info}>{user?.full_name}</span>
        </div>
    )
}
