import apiClient from "@/services/apiClient";
import {
    type User,
    type RoleDropdown,
    type Department,
    type UserFilterParams,
    type PageResponse,
    type CreateUserPayload,
    type ApiResponse,
    type UpdateUserPayload,
    type DropdownOption,
    type LockUserRequest,
} from "../types";

export const userService = {
    getUsers: async (params: UserFilterParams): Promise<PageResponse<User>> => {
        return apiClient.get<never, PageResponse<User>>("/users", { params });
    },

    getUserById: async (id: number): Promise<User> => {
        return apiClient.get<never, User>(`/users/${id}`);
    },

    getRoles: async (): Promise<RoleDropdown[]> => {
        const response = await apiClient.get<never, ApiResponse<RoleDropdown[]>>("/users/roles/dropdown");
        return response.data; 
    },

    getDepartments: async (keyword?: string, isActive?: boolean): Promise<Department[]> => {
        return apiClient.get<never, Department[]>("/departments", {
            params: { keyword, isActive },
        });
    },

    createUser: async (payload: CreateUserPayload): Promise<ApiResponse<string>> => {
        return apiClient.post<never, ApiResponse<string>>("/users/create-with-roles", payload);
    },

    updateUser: async (id: number, payload: UpdateUserPayload): Promise<ApiResponse<User>> => {
        return apiClient.put<never, ApiResponse<User>>(`/users/${id}`, payload);
    },

    getMajorsDropdown: async (departmentId?: number | null): Promise<DropdownOption[]> => {
        return apiClient.get<never, DropdownOption[]>("/majors/dropdown", {
            params: { departmentId: departmentId || undefined },
        });
    },

    lockUser: async (id: number, payload: LockUserRequest): Promise<ApiResponse<void>> => {
        return apiClient.patch<never, ApiResponse<void>>(`/users/${id}/lock`, payload);
    },

    unlockUser: async (id: number): Promise<ApiResponse<void>> => {
        return apiClient.patch<never, ApiResponse<void>>(`/users/${id}/unlock`);
    },
};