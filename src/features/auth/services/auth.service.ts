/* eslint-disable @typescript-eslint/no-explicit-any */
import { type LoginResponse } from "@/types/auth";
import apiClient from "@/services/apiClient";
import axios from "axios";

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
};
