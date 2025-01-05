import React from 'react'
import styles from '../../styles/PageNotFound.module.css'
import SideBar from '../../components/module/SideBar/SideBar'
import Header from '../../components/module/Header/Header'
import { FaAngleLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

export default function Notfound() {
    const navigate = useNavigate();
    return (
        <div className={styles.notfound_container}>
            <SideBar />
            <div className={styles.pagecontent}>
                <Header />
                <div className={styles.maincontent}>
                    <div className={styles.img_containeer}>
                        <img src="/images/404background.png" />
                    </div>
                    <p className={styles.notfound_title}>404</p>
                    <p className={styles.notfound_text}>موردی یافت نشد</p>
                    <button onClick={() => navigate(-1)} className={styles.notfound_btn}>
                        بازگشت
                        <FaAngleLeft className={styles.notfound_icon} />
                    </button>
                </div>
            </div>
        </div>
    )
}
