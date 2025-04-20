import React, { useEffect, useRef, useState } from "react";
import Input from "../../components/module/Input/Input";
import styles from "../../styles/Login.module.css";
import { Col } from "react-bootstrap";
import { Formik } from "formik";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import axios from "axios";
import { MdOutlineMail } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import { MdEmail } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [step, setStep] = useState(1);
  const [isForget, setIsForget] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [password, setPassword] = useState("");
  const [showResendMessage, setShowResendMessage] = useState(false);
  const [showFiledEmail, setShowEmail] = useState(false);
  const [isPrivate, setIsPerivate] = useState(true);
  const [loading, setLoading] = useState(false);
  const phone_number = localStorage.getItem("phone");
  const firstInputRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const sendCodeAgainToEmail = async () => {
    const email = localStorage.getItem("email");

    if (email) {
      const body = { email };
      try {
        await axios.post(`${apiUrl}/user/password-reset/`, body);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred", {
          position: "top-left",
        });
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (password.trim() && phone_number) {
      const body = { phone_number, password };

      try {
        const response = await axios.post(`${apiUrl}/user/admin-login/`, body);
        if (response.status === 200) {
          localStorage.setItem("refresh", response.data.refresh);
          localStorage.setItem("access", response.data.access_token);
          localStorage.removeItem("email");
          localStorage.removeItem("phone");
          navigate("/");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.credential_error[0] || "An error occurred",
          {
            position: "top-left",
          }
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const startTimer = () => {
    setTimeLeft(120);
    setShowResendMessage(false);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setShowResendMessage(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  const handleToggle = () => {
    setIsPerivate((e) => !e);
  };

  // useEffect(() => {
  //     startTimer();
  // }, [step]);

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
      {windowWidth < 768 ? (
        <>
          <div className={styles.logincontainerm}>
            <img className={styles.logoformm} src="/images/logo.svg" alt="" />
            {step === 1 ? (
              <div className={styles.phoneform}>
                <Formik
                  validate={(values) => {
                    const errors = {};
                    const phoneRegex =
                      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

                    if (!values.phone_number) {
                      errors.phone_number =
                        "وارد کردن  شماره تلفن اجباری میباشد";
                    } else if (!phoneRegex.test(values.phone_number)) {
                      errors.phone_number = "شماره تلفن معتبر نیست";
                    }
                    return errors;
                  }}
                  initialValues={{
                    phone_number: "",
                  }}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      const response = await axios.post(
                        `${apiUrl}/user/check-number-admin/`,
                        values
                      );
                      localStorage.setItem("phone", values.phone_number);
                      if (response.status === 200) {
                        setStep(2);
                      }
                    } catch (error) {
                      toast.error(error.response.data.message, {
                        position: "top-left",
                      });
                      setSubmitting(false);
                    }
                  }}
                >
                  {({
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    touched,
                    isSubmitting,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <p className={styles.paneltext}>ورود به پنل Behrizan</p>

                      <div className={`${styles.inputwrapper}`}>
                        <Input
                          name="phone_number"
                          label="شماره تماس"
                          icon={FaPhone}
                          value={values.phone_number}
                          onChange={handleChange}
                          type={"text"}
                          ref={firstInputRef}
                        />
                        {errors.phone_number && touched.phone_number && (
                          <span className={styles.errorinput}>
                            {errors.phone_number}
                          </span>
                        )}
                      </div>

                      <div className={`${styles.btnwrapper}`}>
                        <button
                          className={`${styles.btnphoneform} ${
                            isSubmitting ? styles.disablebtn : ""
                          }`}
                          type="submit"
                          disabled={isSubmitting}
                        >
                          ادامه
                          <FaArrowLeftLong className={styles.iconformphone} />
                        </button>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            ) : step === 2 ? (
              <div className={styles.passwordform}>
                {showFiledEmail ? (
                  <>
                    <div className={styles.formpasswordcontent}>
                      <Formik
                        validate={(values) => {
                          const errors = {};
                          const emailRegex =
                            /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
                          if (values.email === "") {
                            errors.email = "وارد کردن ایمیل اجباری میباشد";
                          } else if (!emailRegex.test(values.email)) {
                            errors.email = "ایمیل معتبر نیست";
                          }
                          return errors;
                        }}
                        initialValues={{
                          email: "",
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                          try {
                            localStorage.setItem("email", values.email);
                            const response = await axios.post(
                              `${apiUrl}/user/password-reset/`,
                              values
                            );
                            if (response.status === 200) {
                              setShowEmail(false);
                              setStep(3);
                            }
                          } catch (error) {
                            toast.error(error.response.data.email[0], {
                              position: "top-left",
                            });

                            setSubmitting(false);
                          }
                        }}
                      >
                        {({
                          values,
                          handleChange,
                          handleSubmit,
                          errors,
                          touched,
                          isSubmitting,
                        }) => (
                          <form onSubmit={handleSubmit}>
                            <div>
                              <Input
                                name="email"
                                label="ایمیل"
                                icon={MdEmail}
                                value={values.email}
                                onChange={handleChange}
                                type={"text"}
                                ref={firstInputRef}
                              />
                              {errors.email && touched.email && (
                                <span className={styles.errorinput}>
                                  {errors.email}
                                </span>
                              )}
                            </div>
                            <div className="text-center mt-5">
                              <button
                                className={`${styles.btnphoneform} ${
                                  isSubmitting ? styles.disablebtn : ""
                                }`}
                                type="submit"
                                disabled={isSubmitting}
                              >
                                ارسال
                                <FaArrowLeftLong
                                  className={styles.iconformphone}
                                />
                              </button>
                            </div>
                          </form>
                        )}
                      </Formik>
                    </div>
                  </>
                ) : (
                  <>
                    <p className={styles.paneltext}>
                      رمز عبور خود را وارد کنید
                    </p>
                    <div className={styles.formpasswordcontent}>
                      <form onSubmit={handlePasswordSubmit}>
                        <div>
                          <Input
                            name="password"
                            label="کلمه عبور"
                            icon={isPrivate ? IoEyeSharp : IoEyeOff}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={isPrivate ? "password" : "text"}
                            handleToggle={handleToggle}
                            ref={firstInputRef}
                          />
                          {/* {errors.password && touched.password && <span className={styles.errorinput}>{errors.password}</span>} */}
                        </div>
                        <p className={styles.helptext}>
                          رمز عبوری را که از قبل، برای خود انتخاب کردید، وارد
                          کنید یا با زدن دکمه زیر "کد ورود یک‌بار مصرف" دریافت
                          کنید.
                        </p>
                        <p
                          className={styles.forgettext}
                          onClick={() => setIsForget(true)}
                        >
                          فراموش کردید؟
                        </p>

                        <div className="text-center mt-5">
                          <button
                            className={`${styles.btnphoneform} ${
                              loading && styles.disablebtn
                            }`}
                            type="submit"
                            disabled={loading}
                          >
                            ادامه
                            <FaArrowLeftLong className={styles.iconformphone} />
                          </button>
                        </div>
                      </form>
                      {isForget && (
                        <>
                          {/* <div className="text-center">
                            <button
                              className={styles.sendcodebtn}
                              onClick={() => setShowEmail(true)}
                            >
                              <MdOutlineMail className={styles.mailicon} />
                              <span className={`mx-2 ${styles.textsendsms}`}>
                                ارسال کد یکبار مصرف به ایمیل
                              </span>
                            </button>
                          </div> */}
                          <div className="text-center">
                            <button className={styles.sendcodebtn}>
                              <MdOutlineMail className={styles.mailicon} />
                              <span className={`mx-2 ${styles.texttosend}`}>
                                ارسال کد یکبار مصرف از طریق پیامک
                              </span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className={styles.sendcodeform}>
                <p className={styles.textpassword}>
                  رمز یکبار مصرف به ارسال شده
                </p>

                <Formik
                  validate={(values) => {
                    const errors = {};
                    const emailRegex =
                      /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

                    if (values.email === "") {
                      errors.email = "وارد کردن ایمیل اجباری میباشد";
                    } else if (!emailRegex.test(values.email)) {
                      errors.email = "ایمیل معتبر نیست";
                    }
                    if (values.new_password === "") {
                      errors.new_password =
                        "وارد کردن رمز عبور جدبد اجباری میباشد";
                    }
                    if (values.code === "") {
                      errors.code = "وارد کردن کد اجباری میباشد";
                    }

                    return errors;
                  }}
                  initialValues={{
                    email: localStorage.getItem("email"),
                    new_password: "",
                    code: "",
                  }}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      const response = await axios.post(
                        `${apiUrl}/user/password-reset-confirm/`,
                        values
                      );
                      if (response.status === 200) {
                        setPassword("");
                        setIsForget(false);
                        setStep(2);
                      }
                    } catch (error) {
                      toast.error(error.response.data.non_field_errors[0], {
                        position: "top-left",
                      });
                      setSubmitting(false);
                    }
                  }}
                >
                  {({
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    touched,
                    isSubmitting,
                  }) => (
                    <form
                      onSubmit={handleSubmit}
                      className={styles.formcontent}
                    >
                      <div>
                        <Input
                          name="email"
                          label="ایمیل"
                          icon={MdEmail}
                          value={values.email}
                          onChange={handleChange}
                          type={"text"}
                          ref={firstInputRef}
                        />
                        {errors.email && touched.email && (
                          <span className={styles.errorinput}>
                            {errors.email}
                          </span>
                        )}
                      </div>
                      <div>
                        <Input
                          name="new_password"
                          label="رمز عبور جدید"
                          icon={isPrivate ? IoEyeSharp : IoEyeOff}
                          value={values.new_password}
                          onChange={handleChange}
                          handleToggle={""}
                          type={isPrivate ? "password" : "text"}
                        />
                        {errors.new_password && touched.new_password && (
                          <span className={styles.errorinput}>
                            {errors.new_password}
                          </span>
                        )}
                      </div>
                      <div>
                        <Input
                          name="code"
                          label="کد"
                          icon={""}
                          value={values.code}
                          onChange={handleChange}
                          type={"text"}
                        />
                        {errors.code && touched.code && (
                          <span className={styles.errorinput}>
                            {errors.code}
                          </span>
                        )}
                      </div>
                      <div className="text-center mt-5">
                        <button
                          className={`${styles.btnphoneform} ${
                            isSubmitting ? styles.disablebtn : ""
                          }`}
                          type="submit"
                          disabled={isSubmitting}
                        >
                          ادامه
                          <FaArrowLeftLong className={styles.iconformphone} />
                        </button>
                      </div>
                    </form>
                  )}
                </Formik>

                {showResendMessage ? (
                  <div className="text-center d-flex justify-content-center">
                    <p
                      className={`${styles.time} ${styles.againcode}`}
                      onClick={() => {
                        sendCodeAgainToEmail();
                        startTimer();
                      }}
                    >
                      ارسال مجدد
                    </p>
                  </div>
                ) : (
                  <p className={styles.time}>{formatTime(timeLeft)}</p>
                )}
              </div>
            )}

            <p className={styles.textco}>Powered By ARIISCO</p>
          </div>
        </>
      ) : (
        <>
          <div className={styles.logincontainer}>
            <Col md={6} className={styles.formcontainer}>
              {step === 1 ? (
                <div className={styles.phoneform}>
                  <Formik
                    validate={(values) => {
                      const errors = {};
                      const phoneRegex =
                        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                      if (!values.phone_number) {
                        errors.phone_number =
                          "وارد کردن  شماره تلفن اجباری میباشد";
                      } else if (!phoneRegex.test(values.phone_number)) {
                        errors.phone_number = "شماره تلفن معتبر نیست";
                      }
                      return errors;
                    }}
                    initialValues={{
                      phone_number: "",
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                      try {
                        const response = await axios.post(
                          `${apiUrl}/user/check-number-admin/`,
                          values
                        );
                        localStorage.setItem("phone", values.phone_number);
                        if (response.status === 200) {
                          setStep(2);
                        }
                      } catch (error) {
                        toast.error(error.response.data.message, {
                          position: "top-left",
                        });
                        setSubmitting(false);
                      }
                    }}
                  >
                    {({
                      values,
                      handleChange,
                      handleSubmit,
                      errors,
                      touched,
                      isSubmitting,
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <p className={styles.paneltext}>ورود به پنل Behrizan</p>

                        <div className={`${styles.inputwrapper}`}>
                          <Input
                            name="phone_number"
                            label="شماره تماس"
                            icon={FaPhone}
                            value={values.phone_number}
                            onChange={handleChange}
                            type={"text"}
                            ref={firstInputRef}
                          />
                          {errors.phone_number && touched.phone_number && (
                            <span className={styles.errorinput}>
                              {errors.phone_number}
                            </span>
                          )}
                        </div>

                        <div className={`${styles.btnwrapper}`}>
                          <button
                            className={`${styles.btnphoneform} ${
                              isSubmitting ? styles.disablebtn : ""
                            }`}
                            type="submit"
                            disabled={isSubmitting}
                          >
                            ادامه
                            <FaArrowLeftLong className={styles.iconformphone} />
                          </button>
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
              ) : step === 2 ? (
                <div className={styles.passwordform}>
                  {showFiledEmail ? (
                    <>
                      <div className={styles.formpasswordcontent}>
                        <Formik
                          validate={(values) => {
                            const emailRegex =
                              /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
                            const errors = {};
                            if (values.email === "") {
                              errors.email = "وارد کردن ایمیل اجباری میباشد";
                            } else if (!emailRegex.test(values.email)) {
                              errors.email = "ایمیل معتبر نیست";
                            }
                            return errors;
                          }}
                          initialValues={{
                            email: "",
                          }}
                          onSubmit={async (values, { setSubmitting }) => {
                            try {
                              localStorage.setItem("email", values.email);
                              const response = await axios.post(
                                `${apiUrl}/user/password-reset/`,
                                values
                              );
                              if (response.status === 200) {
                                setShowEmail(false);
                                setStep(3);
                              }
                            } catch (error) {
                              toast.error(error.response.data.email[0], {
                                position: "top-left",
                              });

                              setSubmitting(false);
                            }
                          }}
                        >
                          {({
                            values,
                            handleChange,
                            handleSubmit,
                            errors,
                            touched,
                            isSubmitting,
                          }) => (
                            <form onSubmit={handleSubmit}>
                              <div>
                                <Input
                                  Input
                                  name="email"
                                  label="ایمیل"
                                  icon={MdEmail}
                                  value={values.email}
                                  onChange={handleChange}
                                  type={"text"}
                                  ref={firstInputRef}
                                />

                                {errors.email && touched.email && (
                                  <span className={styles.errorinput}>
                                    {errors.email}
                                  </span>
                                )}
                              </div>
                              <div className="text-center mt-5">
                                <button
                                  className={`${styles.btnphoneform} ${
                                    isSubmitting ? styles.disablebtn : ""
                                  }`}
                                  type="submit"
                                  disabled={isSubmitting}
                                >
                                  ارسال
                                  <FaArrowLeftLong
                                    className={styles.iconformphone}
                                  />
                                </button>
                              </div>
                            </form>
                          )}
                        </Formik>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className={styles.paneltext}>
                        رمز عبور خود را وارد کنید
                      </p>
                      <div className={styles.formpasswordcontent}>
                        <form onSubmit={handlePasswordSubmit}>
                          <div>
                            <Input
                              name="password"
                              label="کلمه عبور"
                              icon={isPrivate ? IoEyeSharp : IoEyeOff}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              type={isPrivate ? "password" : "text"}
                              handleToggle={handleToggle}
                              ref={firstInputRef}
                            />
                            {/* {errors.password && touched.password && <span className={styles.errorinput}>{errors.password}</span>} */}
                          </div>
                          <p className={styles.helptext}>
                            رمز عبوری را که از قبل، برای خود انتخاب کردید، وارد
                            کنید یا با زدن دکمه زیر "کد ورود یک‌بار مصرف" دریافت
                            کنید.
                          </p>

                          <div className="text-center mt-5">
                            <button
                              className={`${styles.btnphoneform} ${
                                loading && styles.disablebtn
                              }`}
                              type="submit"
                              disabled={loading}
                            >
                              ادامه
                              <FaArrowLeftLong
                                className={styles.iconformphone}
                              />
                            </button>
                          </div>
                        </form>

                        <p
                          className={styles.forgettext}
                          onClick={() => setIsForget(true)}
                        >
                          فراموش کردید؟
                        </p>

                        {isForget && (
                          <>
                            <div className="text-center">
                              <button className={styles.sendcodebtn}>
                                <MdOutlineMail className={styles.mailicon} />
                                <span className={`mx-2 ${styles.texttosend}`}>
                                  ارسال کد یکبار مصرف از طریق پیامک
                                </span>
                              </button>
                            </div>
                            {/* <div
                              className="text-center"
                              onClick={() => setShowEmail(true)}
                            >
                              <button className={styles.sendcodebtn}>
                                <MdOutlineMail className={styles.mailicon} />
                                <span className={`mx-2 ${styles.texttosend}`}>
                                  ارسال کد یکبار مصرف به ایمیل
                                </span>
                              </button>
                            </div> */}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className={styles.sendcodeform}>
                  <p className={styles.textpassword}>
                    رمز یکبار مصرف به شماره شما ارسال شد
                  </p>
                  <div className={styles.sendcodecontent}>
                    <Formik
                      validate={(values) => {
                        const errors = {};
                        const emailRegex =
                          /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

                        if (values.email === "") {
                          errors.email = "وارد کردن ایمیل اجباری میباشد";
                        } else if (!emailRegex.test(values.email)) {
                          errors.email = "ایمیل معتبر نیست";
                        }
                        if (values.new_password === "") {
                          errors.new_password =
                            "وارد کردن رمز عبور جدبد اجباری میباشد";
                        }
                        if (values.code === "") {
                          errors.code = "وارد کردن کد اجباری میباشد";
                        }

                        return errors;
                      }}
                      initialValues={{
                        email: localStorage.getItem("email"),
                        new_password: "",
                        code: "",
                      }}
                      onSubmit={async (values, { setSubmitting }) => {
                        try {
                          const response = await axios.post(
                            `${apiUrl}/user/password-reset-confirm/`,
                            values
                          );
                          if (response.status === 200) {
                            setPassword("");
                            setIsForget(false);
                            setStep(2);
                          }
                        } catch (error) {
                          toast.error(error.response.data.non_field_errors[0], {
                            position: "top-left",
                          });
                          setSubmitting(false);
                        }
                      }}
                    >
                      {({
                        values,
                        handleChange,
                        handleSubmit,
                        errors,
                        touched,
                        isSubmitting,
                      }) => (
                        <form
                          onSubmit={handleSubmit}
                          className={styles.formcontent}
                        >
                          <div>
                            <Input
                              name="email"
                              label="ایمیل"
                              icon={MdEmail}
                              value={values.email}
                              onChange={handleChange}
                              type={"text"}
                              ref={firstInputRef}
                            />
                            {errors.email && touched.email && (
                              <span className={styles.errorinput}>
                                {errors.email}
                              </span>
                            )}
                          </div>
                          <div>
                            <Input
                              name="new_password"
                              label="رمز عبور جدید"
                              icon={isPrivate ? IoEyeSharp : IoEyeOff}
                              value={values.new_password}
                              onChange={handleChange}
                              handleToggle={handleToggle}
                              type={isPrivate ? "password" : "text"}
                            />
                            {errors.new_password && touched.new_password && (
                              <span className={styles.errorinput}>
                                {errors.new_password}
                              </span>
                            )}
                          </div>
                          <div>
                            <Input
                              name="code"
                              label="کد"
                              icon={""}
                              value={values.code}
                              onChange={handleChange}
                              type={"text"}
                            />
                            {errors.code && touched.code && (
                              <span className={styles.errorinput}>
                                {errors.code}
                              </span>
                            )}
                          </div>
                          <div className="text-center mt-5">
                            <button
                              className={`${styles.btnphoneform} ${
                                isSubmitting ? styles.disablebtn : ""
                              }`}
                              type="submit"
                              disabled={isSubmitting}
                            >
                              ادامه
                              <FaArrowLeftLong
                                className={styles.iconformphone}
                              />
                            </button>
                          </div>
                        </form>
                      )}
                    </Formik>

                    {showResendMessage ? (
                      <div className="text-center d-flex justify-content-center">
                        <p
                          className={`${styles.time} ${styles.againcode}`}
                          onClick={() => {
                            sendCodeAgainToEmail();
                            startTimer();
                          }}
                        >
                          ارسال مجدد
                        </p>
                      </div>
                    ) : (
                      <p className={styles.time}>{formatTime(timeLeft)}</p>
                    )}
                  </div>
                </div>
              )}
            </Col>
            <Col md={6} className={styles.logocontainer}>
              <img className={styles.logo} src="/images/logo.svg" alt="logo" />
              <p className={styles.textco}>Powered By ARIISCO</p>
            </Col>
          </div>
        </>
      )}
      <ToastContainer />
    </>
  );
}

// const handleInputChange = (e, index) => {
//     const { value } = e.target;
//     if (/^[0-9]$/.test(value)) {
//         const newValues = [...values];
//         newValues[index] = value;
//         setValues(newValues);
//         if (index < inputRefs.current.length - 1) {
//             inputRefs.current[index + 1].focus();
//         }
//     }
// };
