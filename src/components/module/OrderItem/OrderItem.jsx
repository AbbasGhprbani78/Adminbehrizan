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
                <span>
                  {" "}
                  {convertToPersianNumbers(item?.product?.item_code)}
                </span>
              </div>
              <div className={styles.cartinfoitem}>
                <span className={styles.infoitem}>تعداد</span>
                <span>{convertToPersianNumbers(item?.qty)}</span>
              </div>
              {/* <div className={styles.cartinfoitem}>
                <span className={styles.infoitem}>گنجایش</span>
                <span> {convertToPersianNumbers(item?.box_cap)}</span>
              </div>
              <div className={styles.cartinfoitem}>
                <span className={styles.infoitem}>مقدار کل</span>
                <span>{convertToPersianNumbers(item?.qty)}</span>
              </div> */}
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
                        تعداد
                      </TableCell>
                      {/* <TableCell
                        align="center"
                        style={{
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#fff",
                          fontFamily: "iranYekan",
                          fontWeight: "bold",
                        }}
                      >
                        گنجایش
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
                        مقدار کل
                      </TableCell> */}
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
                        {convertToPersianNumbers(item?.qty)}
                      </TableCell>
                      {/* <TableCell
                        align="center"
                        sx={{ fontFamily: "iranYekan", fontWeight: "bold" }}
                      >
                        {convertToPersianNumbers(item?.box_cap)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontFamily: "iranYekan", fontWeight: "bold" }}
                      >
                        {convertToPersianNumbers(item?.qty)}
                      </TableCell> */}
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
