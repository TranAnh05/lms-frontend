import apiClient from "@/services/apiClient";
import {
    type User,
    type Role,
    type Department,
    type UserFilterParams,
    type PageResponse,
    type CreateUserPayload,
    type ApiResponse,
    type UpdateUserPayload,
    type DropdownOption,
    type LockUserRequest,
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

    createUser: async (
        payload: CreateUserPayload,
    ): Promise<ApiResponse<string>> => {
        return (await apiClient.post(
            "/users/create-with-roles",
            payload,
        )) as ApiResponse<string>;
    },

    updateUser: async (
        id: number,
        payload: UpdateUserPayload,
    ): Promise<ApiResponse<User>> => {
        return (await apiClient.put(
            `/users/${id}`,
            payload
        )) as ApiResponse<User>;
    },

    getMajorsDropdown: async (
        departmentId?: number | null
    ): Promise<DropdownOption[]> => {
        return (await apiClient.get("/majors/dropdown", {
            params: { departmentId: departmentId || undefined },
        })) as DropdownOption[];
    },

    lockUser: async (
        id: number,
        payload: LockUserRequest
    ): Promise<ApiResponse<void>> => {
        return (await apiClient.patch(
            `/users/${id}/lock`,
            payload
        )) as ApiResponse<void>;
    },
};
