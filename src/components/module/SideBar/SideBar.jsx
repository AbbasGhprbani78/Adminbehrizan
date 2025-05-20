import styles from "./Sidebar.module.css";
import { Link } from "react-router-dom";
import { MdWindow } from "react-icons/md";
import { FaHeadphones } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import swal from "sweetalert";
import { BsChatRightFill } from "react-icons/bs";
import { HiUsers } from "react-icons/hi2";
import { TiMessages } from "react-icons/ti";

export default function SideBar() {
  const naviagte = useNavigate();
  const { pathname } = useLocation();
  const logoutHandler = () => {
    swal({
      title: "آیا از خروج اطمینان دارید ؟",
      icon: "warning",
      buttons: ["خیر", "بله"],
    }).then((willLogout) => {
      if (willLogout) {
        sessionStorage.removeItem("refresh");
        sessionStorage.removeItem("access");
        naviagte("/login");
      }
    });
  };

  return (
    <div className={styles.sidebarcontainer}>
      <div className={styles.sidebarcontent}>
        <div className={styles.sidebarheader}>
          <img src="/images/logo.svg" alt="logo" />
        </div>
        <div className={styles.sidebarlistwrapper}>
          <ul className={styles.sidebarlist}>
            <Link
              to={"/"}
              className={`${styles.listitem} ${
                pathname === "/" ? styles.active : ""
              }`}
            >
              <MdWindow className={styles.iconsidebar} />
              <span className={styles.listitemtext}>خانه</span>
            </Link>
            <Link
              to={"/users"}
              className={`${styles.listitem} ${
                pathname === "/users" ? styles.active : ""
              }`}
            >
              <HiUsers className={styles.iconsidebar} />
              <span className={styles.listitemtext}>کاربران</span>
            </Link>
            <Link
              to={"/messages"}
              className={`${styles.listitem} ${
                pathname === "/messages" ? styles.active : ""
              }`}
            >
              <TiMessages className={styles.iconsidebar} />
              <span className={styles.listitemtext}>پیام ها</span>
            </Link>
            <Link
              to={"/chat"}
              className={`${styles.listitem} ${
                pathname === "/chat" ? styles.active : ""
              }`}
            >
              <BsChatRightFill className={styles.iconsidebar} />
              <span className={styles.listitemtext}>چت</span>
            </Link>
            <Link
              to={"/ticket"}
              className={`${styles.listitem} ${
                pathname === "/ticket" ? styles.active : ""
              }`}
            >
              <FaHeadphones className={styles.iconsidebar} />
              <span className={styles.listitemtext}>پشتیبانی</span>
            </Link>
            <Link
              to={"#"}
              className={`${styles.listitem} ${styles.logoutsidebar}`}
            >
              <FiLogOut className={styles.iconsidebar} />
              <span className={styles.listitemtext} onClick={logoutHandler}>
                خروج
              </span>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
