// src/api/axiosInstance.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"; // Change to your Django backend URL

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken && config.headers) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

// Add response interceptor for 401 token refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh_token")
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const tokenResponse = await axios.post(
          `${baseURL}/api/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = tokenResponse.data.access;
        localStorage.setItem("access_token", newAccessToken);

        if (axiosInstance.defaults.headers)
          axiosInstance.defaults.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;

        if (originalRequest.headers)
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login"; // or use navigate from react-router
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
