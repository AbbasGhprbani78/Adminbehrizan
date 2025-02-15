import React, { useEffect, useState } from "react";
import styles from "../../styles/Orders.module.css";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
import OrderItem from "../../components/module/OrderItem/OrderItem";
import SearchBox from "../../components/module/SearchBox/SearchBox";
import axios from "axios";
import NoneSearch from "../../components/module/NoneSearch/NoneSearch";
import EmptyProduct from "../../components/module/EmptyProduct/EmptyProduct";
import { useParams } from "react-router-dom";

export default function Orders() {
  const [search, setSearch] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [filterProduct, setFilterProduct] = useState([]);
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;

  const getOrderDetails = async () => {
    const access = localStorage.getItem("access");
    const headers = {
      Authorization: `Bearer ${access}`,
    };
    try {
      const response = await axios.get(`${apiUrl}/app/get-product/${id}`, {
        headers,
      });

      if (response.status === 200) {
        setOrderDetails(response.data);
        setFilterProduct(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getDetails = async () => {
    const access = localStorage.getItem("access");
    const headers = {
      Authorization: `Bearer ${access}`,
    };
    try {
      const response = await axios.get(
        `${apiUrl}/app/order-detail-bill-code/${id}`,
        {
          headers,
        }
      );
      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.removeItem("access");
      }
    } finally {
      // setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR");
  };

  const searchHandler = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);

    const filterProducts = orderDetails.filter(
      (product) =>
        product.product.item_code.includes(searchTerm) ||
        product.product.descriptions.toLowerCase().includes(searchTerm) ||
        product.number_sold.toString().includes(searchTerm) ||
        product.product.specifications[0].property_name
          .toLowerCase()
          .includes(searchTerm)
    );

    setFilterProduct(filterProducts);
  };

  useEffect(() => {
    getOrderDetails();
    getDetails();
  }, []);

  return (
    <div className={styles.wrapperpage}>
      <SideBar />
      <div className={styles.pagecontent}>
        <Header title={"سفارشات"} />
        {orderDetails.length > 0 ? (
          <>
            <div className={styles.ordertitlewrapper}>
              <div className={styles.detailorderwrapper}>
                <span>تاریخ سفارش :</span>
                <span>
                  {formatDate(orderDetails[0]?.order_confirmation_time)}
                </span>
              </div>
              <SearchBox
                value={search}
                onChange={searchHandler}
                placeholder={"جستوجو براساس کد کالا , شرح , تعداد , واحد"}
              />
            </div>
            <div className={styles.maincontent}>
              <div className={styles.orderitemcontainer}>
                {filterProduct.length > 0 ? (
                  filterProduct.map((item) => (
                    <OrderItem key={item.product.id} item={item} />
                  ))
                ) : (
                  <>
                    <NoneSearch />
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <EmptyProduct />
          </>
        )}
      </div>
    </div>
  );
}
