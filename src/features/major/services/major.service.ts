import apiClient from "@/services/apiClient";
import {
    type CreateMajorInput,
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

    createMajor: async (data: CreateMajorInput): Promise<Major> => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockNewMajor: Major = {
            id: Math.floor(Math.random() * 1000) + 100, 
            code: data.code.toUpperCase(),
            name: data.name,
            requiredMinimumCredits: Number(data.requiredMinimumCredits),
            description: data.description,
            isActive: true,
            lockReason: null,
            departmentId: data.departmentId,
            departmentCode: `DEPT_${data.departmentId}`, 
            departmentName: `Khoa chức năng mẫu ${data.departmentId}`, 
        };

        return mockNewMajor;

    }    
};
