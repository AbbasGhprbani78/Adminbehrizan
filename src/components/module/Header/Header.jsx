
import React, { useEffect, useRef, useState } from 'react';
import styles from './Header.module.css'
import { IoCartOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import OffcanvasMenu from '../OffcanvasMenu/OffcanvasMenu';
import { Link } from 'react-router-dom';


export default function Header({ title }) {
    const [windowWidth, setWindowWidth] = useState(0);
    const [showSideBar, setShowSideBar] = useState(false);
    const titleRef = useRef(null);

    useEffect(() => {

        const updateWindowWidth = () => {
            setWindowWidth(window.innerWidth);
        };

        updateWindowWidth();
        window.addEventListener('resize', updateWindowWidth);

        return () => {
            window.removeEventListener('resize', updateWindowWidth);
        };
    }, []);


    useEffect(() => {
        if (titleRef.current) {
            document.documentElement.style.setProperty('--title-width', `${titleRef.current.offsetWidth}px`);
        }
    }, [title]);

    return (
        <>
            {windowWidth < 1025 ? (
                <>
                    <OffcanvasMenu setShowSideBar={setShowSideBar} showSideBar={showSideBar} />
                    <div className={styles.headermobile}>
                        <RxHamburgerMenu className={styles.iconham} onClick={() => setShowSideBar(true)} />
                        <Link to={"/"}>
                            <img src="/images/logo.svg" alt="logo" className={styles.logomobile} />
                        </Link>
                    </div>
                </>
            ) : (
                <div className={styles.headercontainer}>
                    <span className={styles.headertext} ref={titleRef}>{title}</span>
                    <Link to={"/"} className={styles.wrap_logo}>
                        <img src="/images/logo.svg" alt="logo" className={styles.logomobile} />
                    </Link>
                </div>
            )}
        </>
    );
}
