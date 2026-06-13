/* eslint-disable @typescript-eslint/no-explicit-any */
import { type LoginResponse } from "@/types/auth";
import apiClient from "@/services/apiClient";
import axios from "axios";
import type { ForgotPasswordPayload, ResetPasswordPayload } from "../types";

export interface LoginCredentials {
    username: string;
    password: string;
}

export const authService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        return await apiClient.post<any, LoginResponse>(
            "/auth/login",
            credentials,
        );
    },

    refreshToken: async (refreshToken: string) => {
        const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
        const response = await axios.post(
            `${baseURL}/auth/refresh`,
            null, 
            {
                params: { refreshToken },
            }
        );
        return response.data;
    },

    forgotPassword: async (payload: ForgotPasswordPayload): Promise<any> => {
        return await apiClient.post("/auth/forgot-password", payload);
    },

    resetPassword: async (payload: ResetPasswordPayload): Promise<any> => {
        return await apiClient.post("/auth/reset-password", payload);
    },
};
