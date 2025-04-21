import { useCallback, useEffect, useState } from "react";
import styles from "../../styles/Orders.module.css";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
import OrderItem from "../../components/module/OrderItem/OrderItem";
import SearchBox from "../../components/module/SearchBox/SearchBox";
import NoneSearch from "../../components/module/NoneSearch/NoneSearch";
import EmptyProduct from "../../components/module/EmptyProduct/EmptyProduct";
import { useParams } from "react-router-dom";
import { addSlashesToDate, convertToPersianNumbers } from "../../utils/helper";
import Loading from "../../components/module/Loading/Loading";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import useSWR from "swr";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import apiClient from "../../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const StyledTableContainer = styled(TableContainer)({
  maxHeight: 400,
  "&::-webkit-scrollbar": {
    width: "4px",
    height: "8px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#888",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#555",
  },
});
export default function Orders() {
  const [tab, setTab] = useState(1);
  const [search, setSearch] = useState("");
  const [filterProduct, setFilterProduct] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [openTableIndex, setOpenTableIndex] = useState(null);
  const [detailProduct, setDetailProduct] = useState([]);
  const naviagte = useNavigate();
  const { id } = useParams();

  const toggleTable = (index) => {
    setOpenTableIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const getDetails = async () => {
    try {
      const response = await apiClient.get(`/app/order-detail-bill-code/${id}`);
      if (response.status === 200) {
        console.log(response.data);
        setDetailProduct(response.data);
      }
    } catch (e) {
      toast.error("مشکلی سمت سرور پیش آمده", {
        position: "top-left",
      });
    }
  };

  const fetcher = async (url) => {
    const response = await apiClient.get(url);
    if (response.status === 200) {
      setFilterProduct(response.data);
      return response.data;
    }
  };

  const { data: orderDetails, isLoading } = useSWR(
    `/app/get-product/${id}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 15 * 60 * 1000,
    }
  );

  const searchHandler = useCallback(
    (value) => {
      setSearch(value);
      if (!value) {
        setFilterProduct(orderDetails);
      } else {
        const filterSearch = orderDetails.filter(
          (item) =>
            item?.product?.item_code
              ?.toLowerCase()
              .includes(value.toLowerCase()) ||
            item?.product?.descriptions
              ?.toLowerCase()
              .includes(value.toLowerCase()) ||
            String(item?.request_qty).includes(value)
        );
        setFilterProduct(filterSearch);
      }
    },
    [orderDetails]
  );

  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    if (tab === 1) {
      setSearch("");
      setFilterProduct(orderDetails);
    }
  }, [tab, orderDetails]);

  return (
    <div className={styles.wrapperpage}>
      <SideBar />
      <div className={styles.pagecontent}>
        <Header title={"سفارشات"} />
        {isLoading ? (
          <Loading />
        ) : orderDetails?.length > 0 ? (
          <>
            <div className={styles.wrap_tabs_btns}>
              <div className="d-flex align-items-center gap-3">
                <button
                  className={`${styles.btn_tab} ${
                    tab === 1 && styles.activetab
                  }`}
                  onClick={() => setTab(1)}
                >
                  سفارشات
                </button>
                <button
                  className={`${styles.btn_tab} ${
                    tab === 2 && styles.activetab
                  }`}
                  onClick={() => setTab(2)}
                >
                  وضعیت ارسالها
                </button>
              </div>
              <span className={styles.arrow_icon} onClick={() => naviagte("/")}>
                <FaArrowLeftLong />
              </span>
            </div>
            {tab === 1 ? (
              <>
                <div className={styles.ordertitlewrapper}>
                  <div className={styles.detailorderwrapper}>
                    <span> تاریخ درخواست : </span>
                    <span>
                      {convertToPersianNumbers(
                        addSlashesToDate(orderDetails[0]?.request_date)
                      )}
                    </span>
                  </div>
                  <SearchBox
                    value={search}
                    onChange={searchHandler}
                    placeholder={"جستوجو براساس کد کالا , شرح , مقدار درخواست"}
                  />
                </div>
                <div className={`${styles.maincontent}`}>
                  <>
                    {isSearch ? (
                      <p className="text-search">درحال جستوجو ...</p>
                    ) : (
                      <div className={styles.orderitemcontainer}>
                        {filterProduct?.length > 0 ? (
                          filterProduct.map((item) => (
                            <OrderItem key={item.order_detail_id} item={item} />
                          ))
                        ) : (
                          <>
                            <NoneSearch />
                          </>
                        )}
                      </div>
                    )}
                  </>
                </div>
              </>
            ) : detailProduct?.length > 0 ? (
              <div
                className={`${styles.maincontent} ${
                  tab === 2 && styles.tab2_style
                }`}
              >
                <p className={styles.bill_title}>لیست وضعیت ارسالها ها</p>
                <div
                  style={{ height: "calc(100dvh - 250px)", overflow: "auto" }}
                >
                  {detailProduct?.length > 0 &&
                    detailProduct.map((item, i) => (
                      <div className={styles.detail_orders_wrap} key={i}>
                        <div className={styles.status_send}>
                          <div className={styles.bilLading_date_wrap}>
                            <div
                              style={{ cursor: "pointer" }}
                              className="d-flex align-items-center gap-2 cursour"
                              onClick={() => toggleTable(i)}
                            >
                              <div className={styles.wrap_icon}>
                                {openTableIndex === i ? (
                                  <FaAngleUp />
                                ) : (
                                  <FaAngleDown />
                                )}
                              </div>
                              <span>بارنامه : </span>
                              <span>{convertToPersianNumbers(item?.bill)}</span>
                            </div>
                            <div>
                              <span>شماره تراکنش : </span>
                              <span>{item?.trans_doc_no}</span>
                            </div>
                            <div>
                              <span> نوع : </span>
                              <span
                                className={`${
                                  item?.trans_type === "33"
                                    ? styles.green_trans
                                    : styles.red_trans
                                }`}
                              >
                                {item?.trans_type === "33"
                                  ? "ارسال شده"
                                  : "برگشتی"}
                              </span>
                            </div>
                          </div>
                          <div className={styles.wrap_date_detail}>
                            <span> تاریخ : </span>
                            <p
                              style={{
                                direction: "ltr",
                                marginBottom: "0",
                                marginRight: "5px",
                              }}
                            >
                              {convertToPersianNumbers(item?.trans_doc_date)}
                            </p>
                          </div>
                        </div>
                        {openTableIndex === i && (
                          <div className={styles.wrap_table}>
                            <StyledTableContainer component={Paper}>
                              <Table
                                stickyHeader
                                aria-label="sticky table"
                                sx={{ minWidth: 750, typography: "inherit" }}
                              >
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
                                      مقدار
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {item?.products.map((rowDetail, j) => (
                                    <TableRow key={j}>
                                      <TableCell
                                        align="center"
                                        sx={{
                                          fontFamily: "iranYekan",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {convertToPersianNumbers(
                                          rowDetail?.item_code
                                        )}
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        sx={{
                                          fontFamily: "iranYekan",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {convertToPersianNumbers(
                                          rowDetail?.descriptions
                                        )}
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        sx={{
                                          fontFamily: "iranYekan",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {convertToPersianNumbers(
                                          rowDetail?.trans_qty
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </StyledTableContainer>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <>
                <NoneSearch />
              </>
            )}
          </>
        ) : (
          <>
            <EmptyProduct />
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
