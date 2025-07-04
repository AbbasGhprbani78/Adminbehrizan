import axios from "axios";
import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const CountContext = createContext();

export function CountProvaider({ children }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const validateUser = async () => {
    const refresh = sessionStorage.getItem("refresh");

    if (refresh) {
      const body = {
        refresh: refresh,
      };

      try {
        const response = await axios.post(`${apiUrl}/user/refresh/`, body);

        if (response.status === 200) {
          sessionStorage.setItem("access", response.data.access);
        }
      } catch (e) {
        if (e.response.status === 401) {
          sessionStorage.removeItem("refresh");
          sessionStorage.removeItem("access");
          navigate("/login");
        }
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    validateUser();
  }, []);

  return <CountContext.Provider value={{}}>{children}</CountContext.Provider>;
}
