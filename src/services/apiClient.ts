import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAccessToken, clearTokens } from "../utils/storage";
import { useAuthStore } from "../store/authStore";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest) {
            console.error("Token hết hạn hoặc không hợp lệ. Đang đăng xuất...");
            clearTokens();

            useAuthStore.getState().logout();
            window.location.href = "/login";
        }

        return Promise.reject(error);
    },
);

export default apiClient;
