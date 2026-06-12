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
        const response = await apiClient.get("/departments", {
            params: { keyword, isActive },
        });
        return (
            response.data !== undefined ? response.data : response
        ) as Department[];
    },

    getMajors: async (
        params: MajorFilterParams,
    ): Promise<PageResponse<Major>> => {
        const response = await apiClient.get("/majors", { params });
        return (
            response.data !== undefined ? response.data : response
        ) as PageResponse<Major>;
    },

    getMajorById: async (id: number): Promise<Major> => {
        const response = await apiClient.get(`/majors/${id}`);
        return (
            response.data !== undefined ? response.data : response
        ) as Major;
    },

    createMajor: async (data: CreateMajorInput): Promise<Major> => {
        const response = await apiClient.post("/majors", data);
        return (
            response.data !== undefined ? response.data : response
        ) as Major;
    },

    updateMajor: async (id: number, data: UpdateMajorInput): Promise<Major> => {
        const response = await apiClient.put(`/majors/${id}`, data);
        return (
            response.data !== undefined ? response.data : response
        ) as Major;
    },

    deleteMajor: async (id: number): Promise<string> => {
        const response = await apiClient.delete(`/majors/${id}`);
        return (
            response.data !== undefined ? response.data : response
        ) as string;
    },
};
