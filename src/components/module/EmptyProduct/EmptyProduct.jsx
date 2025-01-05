import React from 'react'
import styles from './EmptyProduct.module.css'

export default function EmptyProduct() {
    return (
        <div className={styles.cartempty}>
            <div className={styles.imgcartwrapper}>
                <img src="/images/carticon.svg" alt="basket" />
            </div>
            <p className={styles.text_empty}>فعلا سفارش جدیدی وجود ندارد</p>
        </div>
    )
}
