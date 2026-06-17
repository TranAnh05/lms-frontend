import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAccessToken, getRefreshToken, clearTokens } from "../utils/storage";
import { useAuthStore } from "../store/authStore";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

const addSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response.data,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (originalRequest?.url?.includes("/auth/login")) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                const refreshToken = getRefreshToken();

                if (!refreshToken) {
                    clearTokens();
                    useAuthStore.getState().logout();
                    window.location.href = "/login";
                    return Promise.reject(error);
                }

                try {
                    const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
                        params: { refreshToken }
                    });
                    
                    const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data || refreshResponse.data;

                    useAuthStore.getState().updateTokens(accessToken, newRefreshToken);

                    isRefreshing = false;
                    onRefreshed(accessToken);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    isRefreshing = false;
                    refreshSubscribers = [];
                    clearTokens();
                    useAuthStore.getState().logout();
                    
                    console.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                    window.location.href = "/login";

                    return Promise.reject(refreshError);
                }
            }

            return new Promise((resolve) => {
                addSubscriber((token: string) => {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    resolve(apiClient(originalRequest));
                });
            });
        }

        return Promise.reject(error);
    }
);

export default apiClient;