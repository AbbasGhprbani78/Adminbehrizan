import styles from "./CustomerItem.module.css";
import { CiEdit } from "react-icons/ci";
export default function CustomerItem({
  setUserInfo,
  setShowModal,
  user,
  setId,
}) {
  const fillUserInfo = () => {
    setId(user.supplier_code);
    setUserInfo((prev) => ({
      ...prev,
      email: user.email,
      full_name: user.full_name,
      national_id: user.national_id,
      phone_number: user.phone_number,
      username: user.username,
      is_active: user.is_active,
    }));
    setShowModal(true);
  };

  return (
    <div className={styles.CustomerItem}>
      <div className={styles.wrap_info}>
        <div className={styles.wrap_img}>
          <img src="/public/images/user.png" alt="photo user" />
        </div>
        <span className={styles.user_fullname}>{user?.full_name}</span>
      </div>
      <button className={styles.edit_btn} onClick={fillUserInfo}>
        ویرایش
        <CiEdit className={styles.icon} />
      </button>
    </div>
  );
}
