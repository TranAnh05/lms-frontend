/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/services/apiClient";
import {
    type ClassDetailResponse,
    type ClassListParams,
    type PageResponse,
    type DepartmentBasic,
    type SemesterBasic,
    type LecturerBasic,
    type AssignLecturerPayload,
    type DropdownResponseDto,
} from "../types";

export const classService = {
    getClasses: async (params: ClassListParams): Promise<PageResponse<ClassDetailResponse>> => {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([v]) => v !== undefined && v !== null && v !== "")
        );
        const response: any = await apiClient.get("/classes", { params: cleanParams });
        return response.data || response;
    },

    getClassById: async (id: number): Promise<ClassDetailResponse> => {
        const response: any = await apiClient.get(`/classes/${id}`);
        return response.data || response;
    },

    getDepartments: async (): Promise<DepartmentBasic[]> => {
        const response: any = await apiClient.get("/departments");
        return response.data || response;
    },

    getSemesters: async (): Promise<SemesterBasic[]> => {
        const response: any = await apiClient.get("/semesters/all");
        return response.data || response;
    },

    getLecturers: async (departmentId?: number): Promise<LecturerBasic[]> => {
        const params = departmentId ? { departmentId } : {};
        const response: any = await apiClient.get("/lecturers", { params }).catch(() => ({ data: [] }));
        return response.data || [];
    },

    getInstructorsDropdown: async (classId: number): Promise<DropdownResponseDto[]> => {
        const response: any = await apiClient.get(`/class-requests/classes/${classId}/dropdown/instructors`);
        return response.data;
    },

    assignLecturer: async (classId: number, payload: AssignLecturerPayload): Promise<void> => {
        await apiClient.put(`/class-requests/classes/${classId}/assign-lecturer`, payload);
    },
};