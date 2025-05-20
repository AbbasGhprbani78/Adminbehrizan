import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: apiUrl,
});

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem("refresh");
        if (!refreshToken) {
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const res = await axios.post(`${apiUrl}/user/refresh/`, {
          refresh: sessionStorage.getItem("refresh"),
        });

        const newAccessToken = res.data.access;
        sessionStorage.setItem("access", newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        sessionStorage.removeItem("access");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
