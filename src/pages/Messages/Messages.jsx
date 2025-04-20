import styles from "./Messages.module.css";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
import UserItemMessage from "../../components/module/UserItemMessage/UserItemMessage";
import { Box, Grid, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import swal from "sweetalert";
import "react-toastify/dist/ReactToastify.css";
import { Table } from "react-bootstrap";
import { convertToPersianNumbers } from "../../utils/helper";
import apiClient from "../../config/axiosConfig";

export default function Messages() {
  const [tab, setTab] = useState(1);
  const [allUsers, setAllUsers] = useState([]);
  const [filtredUsers, setFiltredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [disablebtn, setDisableBtn] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const [messageInfo, setMessageInfo] = useState({
    supplier_codes: [],
    message_text: "",
  });

  const chnageHandler = (e) => {
    const { name, value } = e.target;
    setMessageInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheck = (id) => {
    setMessageInfo((prev) => {
      const alreadyExists = prev.supplier_codes.includes(id);
      return {
        ...prev,
        supplier_codes: alreadyExists
          ? prev.supplier_codes.filter((code) => code !== id)
          : [...prev.supplier_codes, id],
      };
    });
  };

  const getAllUsers = async () => {
    try {
      const response = await apiClient.get(`/user/users/`);
      if (response.status == 200) {
        setAllUsers(response.data);
        setFiltredUsers(response.data);
      }
    } catch (error) {
      toast.error("مشکلی سمت سرور پیش آمده", {
        position: "top-left",
      });
    }
  };

  const searchHandler = useCallback(
    (value) => {
      setSearch(value);
      if (!value) {
        setFiltredUsers(allUsers);
      } else {
        const filterSearch = allUsers.filter((item) =>
          item.full_name?.toLowerCase().includes(value.toLowerCase())
        );
        setFiltredUsers(filterSearch);
      }
    },
    [allUsers]
  );

  const toggleSelectAll = () => {
    const allIds = filtredUsers.map((u) => u.supplier_code);
    const areAllSelected = allIds.every((id) =>
      messageInfo.supplier_codes.includes(id)
    );

    setMessageInfo((prev) => ({
      ...prev,
      supplier_codes: areAllSelected ? [] : allIds,
    }));
  };

  const sendMessage = async () => {
    if (messageInfo.supplier_codes.length === 0) {
      toast.error("کد  نمی‌تواند خالی باشد", {
        position: "top-left",
      });
      return;
    }

    if (messageInfo.message_text.trim() === "") {
      toast.error("متن پیام نمی‌تواند خالی باشد.", {
        position: "top-left",
      });
      return;
    }
    setDisableBtn(true);
    try {
      const response = await apiClient.post(`/app/send-sms/`, messageInfo);
      if (response.status == 200) {
        swal({
          title: "پیام با موفقیت ارسال  شد",
          icon: "success",
          button: {
            text: "باشه",
          },
        });
        setMessageInfo({
          supplier_codes: [],
          message_text: "",
        });
      }
    } catch (error) {
      toast.error("مشکلی سمت سرور پیش آمده", {
        position: "top-left",
      });
    } finally {
      setDisableBtn(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className={styles.wrapperpage}>
      <SideBar />
      <div className={styles.pagecontent}>
        <Header title={"پیام ها"} />
        <div className={styles.wrap_serach_filter}></div>
        <div className={styles.wrap_btn}>
          <button />
        </div>
        {
          // Array(100).fill(0).map((item,i)=>(
          //   <TableContainer component={Paper} style={{ maxHeight: 400 }}>
          //   <Table sx={{ minWidth: 750, typography: "inherit" }}>
          //     <TableHead>
          //       <TableRow>
          //         <TableCell
          //           align="center"
          //           style={{
          //             position: "sticky",
          //             top: 0,
          //             backgroundColor: "#fff",
          //             fontFamily: "iranYekan",
          //             fontWeight: "bold",
          //           }}
          //         >
          //           کد کالا
          //         </TableCell>
          //         <TableCell
          //           align="center"
          //           style={{
          //             position: "sticky",
          //             top: 0,
          //             backgroundColor: "#fff",
          //             fontFamily: "iranYekan",
          //             fontWeight: "bold",
          //           }}
          //         >
          //           شرح محصول
          //         </TableCell>
          //         <TableCell
          //           align="center"
          //           style={{
          //             position: "sticky",
          //             top: 0,
          //             backgroundColor: "#fff",
          //             fontFamily: "iranYekan",
          //             fontWeight: "bold",
          //           }}
          //         >
          //           مقدار درخواست
          //         </TableCell>
          //         <TableCell
          //           align="center"
          //           style={{
          //             position: "sticky",
          //             top: 0,
          //             backgroundColor: "#fff",
          //             fontFamily: "iranYekan",
          //             fontWeight: "bold",
          //           }}
          //         >
          //           مقدار سفارش
          //         </TableCell>
          //         <TableCell
          //           align="center"
          //           style={{
          //             position: "sticky",
          //             top: 0,
          //             backgroundColor: "#fff",
          //             fontFamily: "iranYekan",
          //             fontWeight: "bold",
          //           }}
          //         >
          //           وضعیت
          //         </TableCell>
          //         <TableCell
          //           align="center"
          //           style={{
          //             position: "sticky",
          //             top: 0,
          //             backgroundColor: "#fff",
          //             fontFamily: "iranYekan",
          //             fontWeight: "bold",
          //           }}
          //         >
          //           تصویر
          //         </TableCell>
          //       </TableRow>
          //     </TableHead>
          //     <TableBody>
          //       <TableRow>
          //         <TableCell
          //           align="center"
          //           sx={{
          //             width: "240px",
          //             fontFamily: "iranYekan",
          //             fontWeight: "bold",
          //           }}
          //         >
          //           {convertToPersianNumbers(item?.product?.item_code)}
          //         </TableCell>
          //         <TableCell
          //           align="center"
          //           sx={{
          //             width: "300px",
          //             fontFamily: "iranYekan",
          //             fontWeight: "bold",
          //           }}
          //         >
          //           {convertToPersianNumbers(item?.product?.descriptions)}
          //         </TableCell>
          //         <TableCell
          //           align="center"
          //           sx={{ fontFamily: "iranYekan", fontWeight: "bold" }}
          //         >
          //           {convertToPersianNumbers(item?.request_qty)}
          //         </TableCell>
          //         <TableCell
          //           align="center"
          //           sx={{ fontFamily: "iranYekan", fontWeight: "bold" }}
          //         >
          //           {convertToPersianNumbers(item?.order_qty)}
          //         </TableCell>
          //         <TableCell
          //           align="center"
          //           sx={{ fontFamily: "iranYekan", fontWeight: "bold" }}
          //         >
          //           {item?.order_item_status_code}
          //         </TableCell>
          //         <TableCell
          //           align="center"
          //           sx={{ fontFamily: "iranYekan", fontWeight: "bold" }}
          //         >
          //           <img
          //             src={
          //               item?.product?.image
          //                 ? `${apiUrl}${item?.product?.image}`
          //                 : "/public/images/image1.png"
          //             }
          //             alt="product image"
          //             style={{ width: "70px", height: "70px" }}
          //           />
          //         </TableCell>
          //       </TableRow>
          //     </TableBody>
          //   </Table>
          // </TableContainer>
          // ))
        }
        {/* <Box sx={{ flexGrow: 1, marginTop: "1.5rem" }}>
          <Grid container spacing={5} sx={{ paddingTop: 0 }}>
            <Grid item xs={12} md={8} sx={{ paddingTop: 0 }}>
              <div className={styles.text_texteara}>
                <p className={styles.text_message}>متن پیام</p>
                <textarea
                  name="message_text"
                  value={messageInfo.message_text}
                  onChange={chnageHandler}
                  className={styles.texteara}
                  maxLength={100}
                ></textarea>
                <button
                  className={`${styles.btn_message} ${
                    disablebtn && styles.disable
                  }`}
                  onClick={sendMessage}
                  disabled={disablebtn}
                >
                  ارسال پیام
                </button>
              </div>
            </Grid>
            <Grid item xs={12} md={4} sx={{ paddingTop: 0 }}>
              <div className={styles.list_users_container}>
                <div className={styles.top_list}>
                  <span className={styles.list_text}>مخاطبان</span>
                  <span
                    className={styles.text_check_all}
                    onClick={toggleSelectAll}
                  >
                    انتخاب همه
                  </span>
                </div>
                <div className={styles.topsec}>
                  <input
                    type="text"
                    placeholder={"جستجو ..."}
                    value={search || ""}
                    onChange={(e) => searchHandler(e.target.value)}
                    maxLength={200}
                    style={{ padding: "10px", border: "none", outline: "none" }}
               
                  />
                </div>
                <div className={styles.list_users}>
                  {filtredUsers?.length > 0 ? (
                    filtredUsers.map((item) => (
                      <UserItemMessage
                        key={item?.supplier_code}
                        item={item}
                        onCheck={handleCheck}
                        isChecked={messageInfo.supplier_codes.includes(
                          item.supplier_code
                        )}
                      />
                    ))
                  ) : (
                    <p style={{ padding: "10px" }}>کاربر یافت نشد !!</p>
                  )}
                </div>
              </div>
            </Grid>
          </Grid>
        </Box> */}
      </div>
      <ToastContainer />
    </div>
  );
}
