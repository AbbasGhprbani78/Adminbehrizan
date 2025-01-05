import React, { useEffect, useState } from 'react';
import styles from './ModalFilter.module.css';
import UserFilterItem from '../UserFilterItem/UserFilterItem';
import { IoSearchOutline } from "react-icons/io5";
import { CiCalendarDate } from "react-icons/ci";
import { Calendar } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

export default function ModalFilter({
    allOrders,
    filterOrders,
    setOpenmodal,
    openModal,
    filterOrdersByDate,
}) {
    const [inputValue, setInputValue] = useState("");
    const [filterItem, setFilterItem] = useState([]);
    const [selectedDayRange, setSelectedDayRange] = useState([null, null]);

    useEffect(() => {
        const uniqueUsersMap = new Map();
        allOrders.forEach(order => {
            if (!uniqueUsersMap.has(order.user_full_name)) {
                uniqueUsersMap.set(order.user_full_name, order);
            }
        });

        setFilterItem(Array.from(uniqueUsersMap.values()));
    }, [allOrders]);

    const filterHandler = (value) => {
        setInputValue(value);
        const filteredItems = Array.from(new Map(
            allOrders.filter(item => item.user_full_name.toLowerCase().includes(value.toLowerCase()))
                .map(item => [item.user_full_name, item])
        ).values());
        setFilterItem(filteredItems);
    };

    const handleDateFilter = () => {
        const [from, to] = selectedDayRange;
        if (from && to) {
            filterOrdersByDate(from.toDate(), to.toDate());
            setOpenmodal('');
        }
    };

    return (
        <div className={`${styles.modal_container} ${openModal ? styles.active : ""}`}>
            <div className={styles.close_modal} onClick={() => setOpenmodal("")}></div>
            <div className={`${styles.modal_content} ${openModal ? styles.data_content : ""}`}>
                {openModal === "user" ? (
                    <>
                        <div className={styles.wrapper_search}>
                            <input
                                type="text"
                                className={styles.input_search}
                                placeholder='جستوجو ...'
                                value={inputValue}
                                onChange={e => filterHandler(e.target.value)}
                            />
                            <IoSearchOutline className={styles.search_icon} />
                        </div>
                        <div className={styles.users_container}>
                            {filterItem.length > 0 ? (
                                filterItem.map(item => (
                                    <div key={item.id} onClick={() => filterOrders(item)}>
                                        <UserFilterItem item={item} />
                                    </div>
                                ))
                            ) : (
                                <span className={styles.none_users}>کاربر یافت نشد</span>
                            )}
                        </div>
                    </>
                ) : openModal === "date" ? (
                    <>
                        <div className={styles.date_picker_container}>
                            <div className={styles.date_header}>
                                <span className={styles.date_text}>انتخاب تاریخ</span>
                            </div>
                            <div className={styles.wrapper_calender}>
                                <div className={styles.date_show_range}>
                                    <div className='mb-4'>
                                        <p>از تاریخ</p>
                                        <div className={styles.date_input_wrapper}>
                                            <input
                                                type="text"
                                                className={styles.date_input}
                                                value={
                                                    selectedDayRange[0]
                                                        ? `${selectedDayRange[0].format("YYYY/MM/DD")}`
                                                        : ""
                                                }
                                                readOnly
                                            />
                                            <CiCalendarDate className={styles.icon_ca} />
                                        </div>
                                    </div>
                                    <div className='mb-4'>
                                        <p>تا تاریخ</p>
                                        <div className={styles.date_input_wrapper}>
                                            <input
                                                type="text"
                                                className={styles.date_input}
                                                value={
                                                    selectedDayRange[1]
                                                        ? `${selectedDayRange[1].format("YYYY/MM/DD")}`
                                                        : ""
                                                }
                                                readOnly
                                            />
                                            <CiCalendarDate className={styles.icon_ca} />
                                        </div>
                                    </div>
                                </div>
                                <Calendar
                                    range
                                    value={selectedDayRange}
                                    onChange={setSelectedDayRange}
                                    calendar={persian}
                                    locale={persian_fa}
                                    weekStartDayIndex={6}
                                    className={styles.custom_calendar}
                                />
                            </div>
                            <div className='text-center'>
                                <button
                                    className={styles.calender_btn}
                                    onClick={handleDateFilter}
                                >
                                    اعمال
                                </button>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}
