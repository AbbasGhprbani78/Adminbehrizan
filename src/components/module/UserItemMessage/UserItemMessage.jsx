import styles from "./UserItemMessage.module.css";
export default function UserItemMessage({ item, onCheck, isChecked }) {
  return (
    <div className={styles.user_item_wrapper}>
      <div className={styles.user_info}>
        <div className={styles.img_wrapper}>
          <img src="/images/user.png" alt="imageuser" />
        </div>
        <span className={styles.user_name}>{item?.full_name}</span>
      </div>

      <input
        type="checkbox"
        className={styles.checkbox}
        checked={isChecked}
        onChange={() => onCheck(item.supplier_code)}
      />
    </div>
  );
}
