import styles from "./UserItemMessage.module.css";
export default function UserItemMessage() {
  return (
    <div className={styles.user_item_wrapper}>
      <div className={styles.user_info}>
        <div className={styles.img_wrapper}>
          <img src="/public/images/user.png" alt="imageuser" />
        </div>
        <span className={styles.user_name}></span>
      </div>

      <input type="checkbox" className={styles.checkbox} />
    </div>
  );
}
