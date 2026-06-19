import apiClient from "@/services/apiClient";
import {
    type CreateMajorInput,
    type Department,
    type Major,
    type MajorFilterParams,
    type PageResponse,
    type UpdateMajorInput,
} from "../types";

export const majorService = {
    getDepartments: async (
        keyword?: string,
        isActive?: boolean,
    ): Promise<Department[]> => {
        return apiClient.get<never, Department[]>("/departments", {
            params: { keyword, isActive },
        });
    },

    getMajors: async (
        params: MajorFilterParams,
    ): Promise<PageResponse<Major>> => {
        return apiClient.get<never, PageResponse<Major>>("/majors", { params });
    },

    getMajorById: async (id: number): Promise<Major> => {
        return apiClient.get<never, Major>(`/majors/${id}`);
    },

    createMajor: async (data: CreateMajorInput): Promise<Major> => {
        return apiClient.post<never, Major>("/majors", data);
    },

    updateMajor: async (id: number, data: UpdateMajorInput): Promise<Major> => {
        return apiClient.put<never, Major>(`/majors/${id}`, data);
    },

    deleteMajor: async (id: number): Promise<string> => {
        return apiClient.delete<never, string>(`/majors/${id}`);
    },
};