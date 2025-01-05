
import React, { useEffect, useState } from 'react'
import styles from '../../styles/TrackOrders.module.css'
import SideBar from '../../components/module/SideBar/SideBar'
import Header from '../../components/module/Header/Header'
import OrderTrackItem from '../../components/module/OrderTrackItem/OrderTrackItem'
import SearchBox from '../../components/module/SearchBox/SearchBox'
import Filter from '../../components/module/Filter/Filter'
import axios from 'axios'
import NoneSearch from '../../components/module/NoneSearch/NoneSearch'
import EmptyProduct from '../../components/module/EmptyProduct/EmptyProduct'
import ModalFilter from '../../components/module/ModalFilter/ModalFilter'

export default function Home() {
    const [search, setSearch] = useState("")
    const [filterValue, setFilterValue] = useState([])
    const [allOrders, setAllorders] = useState([])
    const [openModal, setOpenmodal] = useState("")
    const apiUrl = import.meta.env.VITE_API_URL;


    const getAllOrders = async () => {

        const access = localStorage.getItem("access")
        const headers = {
            Authorization: `Bearer ${access}`
        };
        try {
            const response = await axios.get(`${apiUrl}/app/get-order-detail-admin/`, {
                headers,
            })

            if (response.status === 200) {
                setAllorders(response.data)
                setFilterValue(response.data)
                console.log(response.data)
            }

        } catch (e) {
            console.log(e)
        }
    }


    const searchHandler = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearch(searchTerm);

        const filterProducts = allOrders.filter((product) => {
            const totalNumberSold = product.order_details?.reduce(
                (prev, current) => prev + current.number_sold,
                0
            );

            return (
                product.cart_id.toString().includes(searchTerm) ||
                totalNumberSold.toString().includes(searchTerm)
            );
        });

        setFilterValue(filterProducts);
    };

    const filterOrders = (user) => {
        const filtredOrders = allOrders?.filter(order => order?.user_full_name == user?.user_full_name)
        setFilterValue(filtredOrders)
        setOpenmodal('')
    }

    const filterOrdersByDate = (startDate, endDate) => {
        const filteredOrders = allOrders.filter(order => {
            const orderDate = new Date(order.date_time);
            return (!startDate || orderDate >= new Date(startDate)) &&
                (!endDate || orderDate <= new Date(endDate));
        });
        setFilterValue(filteredOrders);
    };

    useEffect(() => {
        getAllOrders()
    }, [])



    return (
        <>
            <div className={styles.wrapperpage}>
                <SideBar />
                <div className={styles.pagecontent}>
                    <Header title={"سفارشات"} />
                    <div className={styles.ordercontent}>
                        {
                            allOrders.length > 0 ?
                                <>
                                    <div className={styles.topsec}>
                                        <SearchBox
                                            value={search}
                                            onChange={searchHandler}
                                            placeholder={"جستوجو براساس شماره درخواست , تعداد سفارش"}
                                        />
                                        <Filter setOpenmodal={setOpenmodal} all={() => setFilterValue(allOrders)} />
                                    </div>
                                    <div className={styles.allorder_wrapper}>
                                        {
                                            filterValue.length > 0 ?

                                                filterValue.slice().reverse().map((order, index) => (
                                                    <OrderTrackItem
                                                        key={order.cart_id}
                                                        order={order}
                                                        number={index}
                                                    />
                                                )) :
                                                <>
                                                    <NoneSearch />
                                                </>
                                        }
                                    </div>
                                </> :
                                <>
                                    <EmptyProduct />
                                </>
                        }

                    </div>
                    <ModalFilter
                        allOrders={allOrders}
                        filterOrders={filterOrders}
                        openModal={openModal}
                        setOpenmodal={setOpenmodal}
                        filterOrdersByDate={filterOrdersByDate}
                    />
                </div>
            </div>
        </>

    )
}


