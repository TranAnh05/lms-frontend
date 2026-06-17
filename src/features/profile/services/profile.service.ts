import apiClient from "@/services/apiClient";
import { type ChangePasswordPayload, type UserProfileResponse } from "../types";

export const profileService = {
    getCurrentProfile: async (): Promise<UserProfileResponse> => {
        return apiClient.get<never, UserProfileResponse>("/auth/profile/me");
    },

    updateAvatar: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        return apiClient.put<never, string>("/profile/avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    changePassword: async (payload: ChangePasswordPayload): Promise<string> => {
        const response = await apiClient.post<never, { message?: string }>(
            "/auth/auth/change-password",
            payload
        );
        return response.message || "Thay đổi mật khẩu tài khoản thành công!";
    },
};