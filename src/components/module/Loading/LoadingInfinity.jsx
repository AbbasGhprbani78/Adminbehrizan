import styles from "./Loading.module.css";
export default function LoadingInfity() {
  return (
    <div className={styles.loading_container}>
      <span className={styles.loader}></span>
    </div>
  );
}
