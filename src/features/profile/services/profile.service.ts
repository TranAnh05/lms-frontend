import apiClient from "@/services/apiClient";
import { type ApiResponse, type ChangePasswordPayload, type UserProfileResponse } from "../types";

export const profileService = {
    getCurrentProfile: async (): Promise<UserProfileResponse> => {
        return apiClient.get<never, UserProfileResponse>("/auth/profile/me");
    },

    updateAvatar: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.put<never, ApiResponse<string>>("/profile/avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        
        return response?.data ? response.data : (response as unknown as string);
    },

    changePassword: async (payload: ChangePasswordPayload): Promise<string> => {
        const response = await apiClient.post<never, { message?: string }>(
            "/auth/auth/change-password",
            payload
        );
        return response.message || "Thay đổi mật khẩu tài khoản thành công!";
    },
};