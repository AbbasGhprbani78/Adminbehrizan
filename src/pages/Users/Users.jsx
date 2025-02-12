import Header from "../../components/module/Header/Header";
import SideBar from "../../components/module/SideBar/SideBar";
import styles from "./User.module.css";
export default function Users() {
  return (
    <div className={styles.wrapperpage}>
      <SideBar />
      <div className={styles.pagecontent}>
        <Header title={"کاربران"} />
        کاربران
      </div>
    </div>
  );
}
