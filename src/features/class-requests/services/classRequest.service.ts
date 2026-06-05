import apiClient from "@/services/apiClient";
import {
    type PageResponse,
    type RequestFilterParams,
    type ClassOpeningResponseDto,
    type ClassOpeningRequestPayload,
    type SemesterResponse,
    type DropdownResponseDto,
    type ApproveClassRequestDto,
} from "../types";

export const classRequestService = {
    // Lấy danh sách đề xuất
    getPendingRequests: async (
        params: RequestFilterParams,
    ): Promise<PageResponse<ClassOpeningResponseDto>> => {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(
                ([_, value]) => value !== null && value !== "" && value !== undefined,
            ),
        );
        const response: any = await apiClient.get("/class-requests/pending-list", {
            params: cleanParams,
        });
        return response.data;
    },

    // Tạo đề xuất mở lớp
    proposeClass: async (payload: ClassOpeningRequestPayload): Promise<void> => {
        await apiClient.post("/class-requests/propose", payload);
    },

    // Duyệt hoặc từ chối đề xuất
    reviewRequest: async (requestId: number, payload: ApproveClassRequestDto): Promise<void> => {
        await apiClient.put(`/class-requests/${requestId}/review`, payload);
    },

    // Lấy dữ liệu Dropdown
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
};