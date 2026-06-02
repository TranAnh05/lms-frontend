import apiClient from "@/services/apiClient";
import {
    type User,
    type Role,
    type Department,
    type UserFilterParams,
    type PageResponse,
} from "../types";

interface ServerResponse<T> {
    code: number;
    message: string;
    data: T;
}

export const userService = {
    getUsers: async (params: UserFilterParams): Promise<PageResponse<User>> => {
        return (await apiClient.get("/users", {
            params,
        })) as PageResponse<User>;
    },

    getUserById: async (id: number): Promise<User> => {
        return (await apiClient.get(`/users/${id}`)) as User;
    },

    getRoles: async (): Promise<Role[]> => {
        const response = (await apiClient.get(
            "/authorizations/roles",
        )) as ServerResponse<Role[]>;
        return response.data;
    },

    getDepartments: async (
        keyword?: string,
        isActive?: boolean,
    ): Promise<Department[]> => {
        return (await apiClient.get("/departments", {
            params: { keyword, isActive },
        })) as Department[];
    },
};
