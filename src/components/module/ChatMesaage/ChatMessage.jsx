import React from 'react'
import styles from './ChatMessage.module.css'

export default function ChatMessage({ message }) {

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    return (
        <div className={`${styles.chat_row} ${message?.sender_is_admin ? styles.content_sender : styles.content_receiver}`}>
            <div className={`${styles.message_wrapper} ${!message?.sender_is_admin && styles.time_receiver}`}>
                <div
                    className={`${styles.message_contnet} ${message?.sender_is_admin ? styles.message_sender : styles.message_receiver}`}>
                    {
                        message?.content
                    }
                </div>
                <div className={styles.message_time}>
                    <span>{formatTime(message.timestamp)}</span>
                </div>
            </div>
        </div>
    )
}
