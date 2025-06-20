import Header from "../../components/module/Header/Header";
import SideBar from "../../components/module/SideBar/SideBar";
import styles from "./User.module.css";
import SearchBox from "../../components/module/SearchBox/SearchBox";
import { useCallback, useEffect, useState } from "react";
import CustomerItem from "../../components/module/CustomerItem/CustomerItem";
import axios from "axios";
import Modal from "../../components/module/Modal/Modal";
import { TiDeleteOutline } from "react-icons/ti";
import Input from "../../components/module/Input/Input";
import { MdOutlineDone } from "react-icons/md";
import swal from "sweetalert";
import Loading from "../../components/module/Loading/Loading";
import Switch from "@mui/material/Switch";
import apiClient from "../../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Users() {
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const apiUrl = import.meta.env.VITE_API_URL;
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [filtredUsers, setFiltredUsers] = useState([]);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitChange, setSubmitChange] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    full_name: "",
    national_id: "",
    phone_number: "",
    username: "",
    password: "",
    is_active: false,
  });

  const changeHnadler = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleActive = (event) => {
    setUserInfo((prev) => ({
      ...prev,
      is_active: event.target.checked,
    }));
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

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`${apiUrl}/user/users/`);
      if (response.status == 200) {
        setAllUsers(response.data);
        setFiltredUsers(response.data);
      }
    } catch (error) {
      toast.error("مشکلی سمت سرور پیش آمده", {
        position: "top-left",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const chanageUserHandler = async (e) => {
    e.preventDefault();

    try {
      setSubmitChange(true);
      const response = await apiClient.put(
        `${apiUrl}/user/users/${id}`,
        userInfo
      );
      if (response.status === 200) {
        getAllUsers();
        setShowModal(false);
        setUserInfo({
          email: "",
          full_name: "",
          national_id: "",
          phone_number: "",
          username: "",
          password: "",
        });
        swal({
          title: "اطلاعات کاربر با موفقیت تغییر کرد",
          icon: "success",
          button: {
            text: "باشه",
          },
        });
      }
    } catch (error) {
      toast.error("مشکلی سمت سرور پیش آمده", {
        position: "top-left",
      });
    } finally {
      setSubmitChange(false);
    }
  };

  console.log(userInfo);
  return (
    <>
      <div className={styles.wrapperpage}>
        <SideBar />
        <div className={styles.pagecontent}>
          <Header title={"کاربران"} />
          {loading ? (
            <Loading />
          ) : (
            <div className={styles.ordercontent}>
              <div className={styles.topsec}>
                <SearchBox
                  placeholder={"جستجو ..."}
                  value={search || ""}
                  onChange={searchHandler}
                />
              </div>
              <div className={styles.wrap_users_list}>
                {filtredUsers?.length > 0 &&
                  filtredUsers.map((item, i) => (
                    <CustomerItem
                      key={i}
                      user={item}
                      setUserInfo={setUserInfo}
                      setShowModal={setShowModal}
                      setId={setId}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <div className={styles.top_modal}>
          <span>ویرایش</span>
          <span onClick={() => setShowModal(false)}>
            <TiDeleteOutline className={styles.icon_close} />
          </span>
        </div>
        <form onSubmit={chanageUserHandler} className={styles.edit_form}>
          <div
            className="my-2"
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            فعال
            <Switch
              {...label}
              checked={userInfo?.is_active}
              onChange={handleToggleActive}
              color="warning"
            />
            غیر فعال
          </div>
          <Input
            label="نام و نام خانوادگی"
            name="full_name"
            value={userInfo.full_name}
            onChange={changeHnadler}
            type="text"
            icon={""}
          />
          <Input
            label="شماره تلفن"
            name="phone_number"
            value={userInfo.phone_number}
            onChange={changeHnadler}
            type="text"
            icon={""}
          />
          <Input
            label="ایمیل"
            name="email"
            value={userInfo.email}
            onChange={changeHnadler}
            type="text"
            icon={""}
          />
          <Input
            label="کد ملی"
            name="national_id"
            value={userInfo.national_id}
            onChange={changeHnadler}
            type="text"
            icon={""}
          />
          <Input
            label="نام کاربری"
            name="username"
            value={userInfo.username}
            onChange={changeHnadler}
            type="text"
            icon={""}
          />
          <Input
            label="رمز"
            name="password"
            value={userInfo.password}
            onChange={changeHnadler}
            type="text"
            icon={""}
          />
          <div className={styles.wrap_actions}>
            <button
              className={`${styles.btn_form} ${styles.btn_submit} ${
                submitChange && styles.disablebtn
              }`}
              type="submit"
              disabled={submitChange}
            >
              تایید
              <MdOutlineDone className={styles.icon_don} />
            </button>
            <button
              className={`${styles.btn_form} ${styles.btn_close}`}
              onClick={() => setShowModal(false)}
              type="button"
            >
              لغو
            </button>
          </div>
        </form>
      </Modal>
      <ToastContainer />
    </>
  );
}
