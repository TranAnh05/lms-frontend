import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAccessToken, getRefreshToken, clearTokens } from "../utils/storage";
import { useAuthStore } from "../store/authStore";
import { authService } from "../features/auth/services/auth.service";

// Cấu hình mở rộng Axios để thêm cờ đánh dấu request đã được retry (tránh lặp vô tận)
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Khởi tạo instance axios mặc định
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Các biến phục vụ cơ chế Silent Refresh (Khóa & Hàng đợi)
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Xả hàng đợi: Gọi lại tất cả các request đang chờ với token mới
const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

// Đẩy request bị lỗi 401 vào hàng đợi để chờ token mới
const addSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

// Tự động đính kèm Access Token vào Header của mọi API gửi đi
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

// Xử lý dữ liệu và lỗi trả về từ Server (Đặc biệt xử lý mã 401 - Hết hạn token)
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // Bỏ qua logic chặn lỗi nếu đang gọi API đăng nhập
        if (originalRequest && originalRequest.url?.includes("/auth/login")) {
            return Promise.reject(error);
        }

        // Kích hoạt luồng làm mới token khi gặp lỗi 401 và request chưa được retry lần nào
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            // Xử lý cho request đầu tiên bị lỗi (Đóng khóa và gọi API refresh)
            if (!isRefreshing) {
                isRefreshing = true;
                const refreshToken = getRefreshToken();

                // Đăng xuất ngay nếu không có Refresh Token
                if (!refreshToken) {
                    clearTokens();
                    useAuthStore.getState().logout();
                    window.location.href = "/login";
                    return Promise.reject(error);
                }

                try {
                    // Lấy token mới từ server
                    const response = await authService.refreshToken(refreshToken);
                    const { accessToken, refreshToken: newRefreshToken } = response.data;

                    // Lưu token mới
                    useAuthStore.getState().updateTokens(accessToken, newRefreshToken);

                    // Mở khóa và kích hoạt lại các request đang chờ trong hàng đợi
                    isRefreshing = false;
                    onRefreshed(accessToken);

                    // Chạy lại request gốc hiện tại với token mới
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    // Ép đăng xuất nếu API refresh cũng thất bại (hết hạn hoặc lỗi)
                    isRefreshing = false;
                    refreshSubscribers = [];
                    clearTokens();
                    useAuthStore.getState().logout();

                    console.error("Phiên đăng nhập đã hết hạn hoàn toàn. Vui lòng đăng nhập lại.");
                    window.location.href = "/login";

                    return Promise.reject(refreshError);
                }
            }

            // Xử lý cho các request lỗi 401 tiếp theo: Đẩy vào hàng đợi đứng chờ
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
    },
);

export default apiClient;