import apiClient from "@/services/apiClient";
import { type UserProfileResponse } from "../types";

export const profileService = {
    getCurrentProfile: async (): Promise<UserProfileResponse> => {
        const response = await apiClient.get("/auth/profile/me");
        return (response.data !== undefined ? response.data : response) as UserProfileResponse;
    },

    updateAvatar: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.put("/profile/avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        
        return (response.data !== undefined ? response.data : response) as string;
    },
};