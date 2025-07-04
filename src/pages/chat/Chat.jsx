import { useState, useEffect, useRef } from "react";
import styles from "../../styles/Chat.module.css";
import { IoSend } from "react-icons/io5";
import ChatMessage from "../../components/module/ChatMesaage/ChatMessage";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
import UserItem from "../../components/module/UserItem/UserItem";
import { Col } from "react-bootstrap";
import { FaLongArrowAltLeft } from "react-icons/fa";
import Loading from "../../components/module/Loading/Loading";
import useSWR from "swr";
import apiClient from "../../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";

const fetcher = async (url) => {
  const response = await apiClient.get(url);
  return response.data;
};

const useUsers = () => {
  const { data, error } = useSWR(`/chat/get-user-roomid/`, fetcher, {
    dedupingInterval: 0,
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  return {
    users: data || [],
    isLoading: !error && !data,
    isError: error,
  };
};
export default function Chat() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [filtreduser, setFiltredusers] = useState([]);
  const [mainUser, setMainUser] = useState("");
  const socketRef = useRef(null);
  const messageEndRef = useRef(null);
  const [search, setSearch] = useState("");
  const [loading, setIsLoading] = useState(false);
  const access_token = sessionStorage.getItem("access");
  const socketUrl = `wss://behrizanpanel.ariisco.com/ws/chat/?token=${access_token}&receiver_code=${mainUser.supplier_code}`;
  const { users } = useUsers();
  useEffect(() => {
    if (users.length > 0) {
      setFiltredusers(users);
      setMainUser(users[0]?.supplier_code);
    }
  }, [users]);

  useEffect(() => {
    socketRef.current = new WebSocket(socketUrl);

    socketRef.current.onopen = (event) => {
      console.log("WebSocket connection opened:", event);
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
      setIsLoading(false);
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== "pending").concat(data)
      );

      setIsLoading(false);
    };

    socketRef.current.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    socketRef.current.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
    };
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [socketUrl]);

  const getMessages = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(
        `/chat/get-message/${mainUser.supplier_code}`
      );

      if (response.status === 200) {
        setIsLoading(false);
        setMessages(response.data);
      }
    } catch (e) {
      toast.error("مشکلی سمت سرور پیش آمده", {
        position: "top-left",
      });
    }
  };

  const sendMessage = () => {
    if (
      message.trim() !== "" &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      const tempMessage = {
        id: "pending",
        message,
        sender_is_admin: true,
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, tempMessage]);

      const messagePayload = {
        message,
      };

      socketRef.current.send(JSON.stringify(messagePayload));
      setMessage("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const searchHandler = (e) => {
    const searchValue = e.target.value.trim().toLowerCase();
    setSearch(e.target.value);

    if (!searchValue) {
      setFiltredusers(users);
      return;
    }

    const filterResult = users.filter(
      (user) =>
        user.full_name && user.full_name.toLowerCase().includes(searchValue)
    );

    setFiltredusers(filterResult);
  };

  useEffect(() => {
    setMessages([]);
    if (mainUser) {
      getMessages();
    }
  }, [mainUser.supplier_code]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <>
      <div className={styles.wrapperpage}>
        <SideBar />
        <div className={styles.pagecontent}>
          {windowWidth < 769 ? (
            <>
              {showChat ? (
                <>
                  <div className={styles.wrapper_chat}>
                    <div className={styles.chat_content}>
                      <div className={styles.chat_header}>
                        <div>
                          <img
                            src={"/images/user2.jpg"}
                            alt=""
                            className={styles.img_chat}
                          />
                          <span className={styles.user_info}>
                            {mainUser?.full_name}
                          </span>
                        </div>
                        <FaLongArrowAltLeft
                          style={{ fontSize: "1.3rem", color: "#fff" }}
                          onClick={() => setShowChat(false)}
                        />
                      </div>
                      <div className={styles.chat_body}>
                        {loading ? (
                          <Loading />
                        ) : (
                          messages.length > 0 &&
                          messages.map((message, index) => (
                            <ChatMessage key={index} message={message} />
                          ))
                        )}
                        <div ref={messageEndRef} />
                      </div>
                      <div className={styles.action_wrapper}>
                        <input
                          type="text"
                          className={styles.input_chat}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={handleKeyDown}
                          maxLength={400}
                        />
                        <IoSend
                          className={styles.icon_send}
                          onClick={sendMessage}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Header title={"چت"} />
                  <div className={styles.wrapper}>
                    <div className={styles.list_user}>
                      <span className={styles.content}>مخاطبان</span>
                      <div className={styles.wrap_search}>
                        <input
                          type="text"
                          value={search}
                          onChange={searchHandler}
                          placeholder="جستوجو ..."
                          maxLength={200}
                        />
                      </div>
                      <div className={styles.userContent}>
                        {filtreduser.length > 0 &&
                          filtreduser.map((user) => (
                            <UserItem
                              key={user.id}
                              user={user}
                              setMainUser={setMainUser}
                              setShowChat={setShowChat}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <Header title={"چت"} />
              <div className={styles.chat_container}>
                <Col md={9}>
                  <div className={styles.chat_content}>
                    <div className={styles.chat_header}>
                      <img
                        src={"/images/user2.jpg"}
                        alt=""
                        className={styles.img_chat}
                      />
                      <span className={styles.user_info}>
                        {mainUser?.full_name}
                      </span>
                    </div>
                    <div className={styles.chat_body}>
                      {loading ? (
                        <Loading />
                      ) : (
                        messages.length > 0 &&
                        messages.map((message, index) => (
                          <ChatMessage key={index} message={message} />
                        ))
                      )}

                      <div ref={messageEndRef} />
                    </div>
                    <div className={styles.action_wrapper}>
                      <input
                        type="text"
                        className={styles.input_chat}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        maxLength={200}
                      />
                      <IoSend
                        className={styles.icon_send}
                        onClick={sendMessage}
                      />
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className={styles.list_user}>
                    <span className={styles.content}>مخاطبان</span>
                    <div className={styles.wrap_search}>
                      <input
                        type="text"
                        value={search}
                        onChange={searchHandler}
                        placeholder="جستوجو ..."
                        maxLength={200}
                      />
                    </div>
                    <div className={styles.userContent}>
                      {filtreduser.length > 0 ? (
                        filtreduser.map((user) => (
                          <UserItem
                            key={user.id}
                            user={user}
                            setMainUser={setMainUser}
                            setShowChat={setShowChat}
                          />
                        ))
                      ) : (
                        <p className={styles.not_found}>موردی یافت نشد !!</p>
                      )}
                    </div>
                  </div>
                </Col>
              </div>
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

// const getUsers = async () => {
//   const access = sessionStorage.getItem("access");
//   const headers = {
//     Authorization: `Bearer ${access}`,
//   };
//   try {
//     const response = await axios.get(`${apiUrl}/chat/get-user-roomid/`, {
//       headers,
//     });

//     if (response.status === 200) {
//       setFiltredusers(response.data);
//       setMainUser(response.data[0].supplier_code);
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };
