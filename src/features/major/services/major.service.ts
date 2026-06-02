import apiClient from "@/services/apiClient";
import {
    type Department,
    type Major,
    type MajorFilterParams,
    type PageResponse,
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
};
