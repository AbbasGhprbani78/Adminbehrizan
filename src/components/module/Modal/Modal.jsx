import styles from "./Modal.module.css";
export default function Modal({ children, showModal, setShowModal }) {
  return (
    <>
      <div
        className={`${styles.modal_container} ${showModal && styles.active}`}
      >
        <div
          className={styles.modal_close}
          onClick={() => setShowModal(true)}
        ></div>
        <div className={styles.modal_content}>{children}</div>
      </div>
    </>
  );
}
