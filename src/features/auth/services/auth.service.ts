import { type LoginResponse } from "@/types/auth";
import apiClient from "@/services/apiClient";
import type { ForgotPasswordPayload, ResetPasswordPayload } from "../types";

export interface LoginCredentials {
    username: string;
    password: string;
}

export const authService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        return await apiClient.post<never, LoginResponse>(
            "/auth/login",
            credentials,
        );
    },

    forgotPassword: async (payload: ForgotPasswordPayload): Promise<void> => {
        return await apiClient.post("/auth/forgot-password", payload);
    },

    resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
        return await apiClient.post("/auth/reset-password", payload);
    },
};
