import styles from "./Messages.module.css";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
export default function Messages() {
  return (
    <div className={styles.wrapperpage}>
      <SideBar />
      <div className={styles.pagecontent}>
        <Header title={"پیام ها"} />
        پیام ها
      </div>
    </div>
  );
}
