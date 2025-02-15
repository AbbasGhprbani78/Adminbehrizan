import styles from "./Messages.module.css";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
import UserItemMessage from "../../components/module/UserItemMessage/UserItemMessage";
import { Box, Grid } from "@mui/material";
export default function Messages() {
  return (
    <div className={styles.wrapperpage}>
      <SideBar />
      <div className={styles.pagecontent}>
        <Header title={"پیام ها"} />
        <Box sx={{ flexGrow: 1, marginTop: "1.5rem" }}>
          <Grid container spacing={5} sx={{ paddingTop: 0 }}>
            <Grid item xs={12} md={8} sx={{ paddingTop: 0 }}>
              <div className={styles.text_texteara}>
                <p className={styles.text_message}>متن پیام</p>
                <textarea
                  className={styles.texteara}
                  maxLength={1000}
                ></textarea>
                <button className={styles.btn_message}>ارسال پیام</button>
              </div>
            </Grid>
            <Grid item xs={12} md={4} sx={{ paddingTop: 0 }}>
              <div className={styles.list_users_container}>
                <div className={styles.top_list}>
                  <span className={styles.list_text}>مخاطبان</span>
                  <span className={styles.text_check_all}>انتخاب همه</span>
                </div>
                <div className={styles.list_users}>
                  <UserItemMessage />
                </div>
              </div>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
}
