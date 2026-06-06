/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/services/apiClient";
import {
    type PageResponse,
    type RequestFilterParams,
    type ClassOpeningResponseDto,
    type ClassOpeningRequestPayload,
    type SemesterResponse,
    type DropdownResponseDto,
    type RejectClassRequestDto,
    type GenerateClassRequestDto,
} from "../types";

export const classRequestService = {
    // Đề xuất mở lớp
    getPendingRequests: async (
        params: RequestFilterParams,
    ): Promise<PageResponse<ClassOpeningResponseDto>> => {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(
                ([value]) => value !== null && value !== "" && value !== undefined,
            ),
        );
        const response: any = await apiClient.get("/class-requests/pending-list", {
            params: cleanParams,
        });
        return response.data;
    },

    proposeClass: async (payload: ClassOpeningRequestPayload): Promise<void> => {
        await apiClient.post("/class-requests/propose", payload);
    },

    // Phê duyệt / Từ chối
    approveRequest: async (requestId: number): Promise<void> => {
        await apiClient.put(`/class-requests/${requestId}/approve`);
    },

    rejectRequest: async (requestId: number, payload: RejectClassRequestDto): Promise<void> => {
        await apiClient.put(`/class-requests/${requestId}/reject`, payload);
    },

    // Dữ liệu Dropdown
    getSemesters: async (): Promise<SemesterResponse[]> => {
        const response: any = await apiClient.get("/semesters/all");
        return response.data || response;
    },

    getCourseDropdown: async (): Promise<DropdownResponseDto[]> => {
        const response: any = await apiClient.get("/class-requests/dropdown/dean-courses");
        return response.data;
    },

    getShiftsDropdown: async (): Promise<DropdownResponseDto[]> => {
        const response: any = await apiClient.get("/class-requests/dropdown/shifts");
        return response.data;
    },

    getRoomsDropdown: async (): Promise<DropdownResponseDto[]> => {
        const response: any = await apiClient.get("/class-requests/dropdown/rooms");
        return response.data;
    },

    generateClasses: async (requestId: number, payload: GenerateClassRequestDto): Promise<void> => {
        await apiClient.post(`/class-requests/${requestId}/generate-classes`, payload);
    },
};