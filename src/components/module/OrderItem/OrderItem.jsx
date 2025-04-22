import { useEffect, useState } from "react";
import styles from "./OrderItem.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { convertToPersianNumbers } from "../../../utils/helper";
export default function OrderItem({ item }) {
  const [windowWidth, setWindowWidth] = useState(0);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    updateWindowWidth();
    window.addEventListener("resize", updateWindowWidth);

    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);

  return (
    <>
      {windowWidth < 600 ? (
        <>
          <div className={styles.CartItemmwrapper}>
            <div
              className={
                item.product.image
                  ? styles.imageorder_wrapper
                  : styles.image_wrapper_de
              }
            >
              <img
                src={
                  item?.product?.image
                    ? `${apiUrl}${item?.product?.image}`
                    : "/public/images/image1.png"
                }
                alt="product image"
              />
            </div>
            <div className="mt-4">
              <span className={styles.carttext}>
                {item?.product?.descriptions}
              </span>
            </div>
            <div className={styles.cartinfowrapper}>
              <div className={styles.cartinfoitem}>
                <span className={styles.infoitem}>کد کالا</span>
                <span>{convertToPersianNumbers(item?.product?.item_code)}</span>
              </div>
              <div className={styles.cartinfoitem}>
                <span className={styles.infoitem}>مقدار درخواست</span>
                <span>{convertToPersianNumbers(item?.request_qty)}</span>
              </div>
              <div className={styles.cartinfoitem}>
                <span className={styles.infoitem}>مقدار سفارش</span>
                <span> {convertToPersianNumbers(item?.order_qty)}</span>
              </div>
              <div className={styles.cartinfoitem}>
                <span className={styles.infoitem}>وضعیت</span>
                <span>{item?.order_item_status_code}</span>
              </div>
              <div className={styles.cartinfoitem}>
                <span className={styles.infoitem}>مقدار ارسال شده</span>
                <span>{item?.sent_qty}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="d-flex flex-column"
            style={{ marginBottom: "1.3rem" }}
          >
            <div className={styles.cartItemwrappper}>
              <TableContainer component={Paper} style={{ maxHeight: 400 }}>
                <Table sx={{ minWidth: 750, typography: "inherit" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="center"
                        style={{
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#fff",
                          fontFamily: "iranYekan",
                          fontWeight: "bold",
                        }}
                      >
                        کد کالا
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#fff",
                          fontFamily: "iranYekan",
                          fontWeight: "bold",
                        }}
                      >
                        شرح محصول
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#fff",
                          fontFamily: "iranYekan",
                          fontWeight: "bold",
                        }}
                      >
                        مقدار درخواست
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#fff",
                          fontFamily: "iranYekan",
                          fontWeight: "bold",
                        }}
                      >
                        مقدار سفارش
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#fff",
                          fontFamily: "iranYekan",
                          fontWeight: "bold",
                        }}
                      >
                        وضعیت
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#fff",
                          fontFamily: "iranYekan",
                          fontWeight: "bold",
                        }}
                      >
                        مقدار ارسال شده
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#fff",
                          fontFamily: "iranYekan",
                          fontWeight: "bold",
                        }}
                      >
                        تصویر
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        align="center"
                        sx={{
                          width: "240px",
                          fontFamily: "iranYekan",
                          fontWeight: "bold",
                        }}
                      >
                        {convertToPersianNumbers(item?.product?.item_code)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          width: "300px",
                          fontFamily: "iranYekan",
                          fontWeight: "bold",
                        }}
                      >
                        {convertToPersianNumbers(item?.product?.descriptions)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontFamily: "iranYekan", fontWeight: "bold" }}
                      >
                        {convertToPersianNumbers(item?.request_qty)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontFamily: "iranYekan", fontWeight: "bold" }}
                      >
                        {convertToPersianNumbers(item?.order_qty)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontFamily: "iranYekan", fontWeight: "bold" }}
                      >
                        {item?.order_item_status_code}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontFamily: "iranYekan", fontWeight: "bold" }}
                      >
                        {item?.sent_qty}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontFamily: "iranYekan", fontWeight: "bold" }}
                      >
                        <img
                          src={
                            item?.product?.image
                              ? `${apiUrl}${item?.product?.image}`
                              : "/public/images/image1.png"
                          }
                          alt="product image"
                          style={{ width: "70px", height: "70px" }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
}
