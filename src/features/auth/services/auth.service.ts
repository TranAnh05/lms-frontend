import { type LoginResponse } from "@/types/auth";
import apiClient from "@/services/apiClient";

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
};
