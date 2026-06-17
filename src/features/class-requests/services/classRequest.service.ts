import apiClient from "@/services/apiClient";
import type {
    PageResponse,
    RequestFilterParams,
    ClassOpeningResponseDto,
    ClassOpeningRequestPayload,
    SemesterResponse,
    DropdownResponseDto,
    RejectClassRequestDto,
    GenerateClassRequestDto,
} from "../types";

export const classRequestService = {
    // Lấy danh sách các yêu cầu đang chờ xử lý kèm bộ lọc
    getPendingRequests: async (
        params: RequestFilterParams,
    ): Promise<PageResponse<ClassOpeningResponseDto>> => {
        // Loại bỏ các tham số có giá trị rỗng, null hoặc undefined
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(
                ([value]) => value !== null && value !== "" && value !== undefined,
            ),
        );

        const response = (await apiClient.get("/class-requests/pending-list", {
            params: cleanParams,
        })) as { data: PageResponse<ClassOpeningResponseDto> };
        
        return response.data;
    },

    // Gửi yêu cầu đề xuất mở lớp học mới
    proposeClass: async (payload: ClassOpeningRequestPayload): Promise<void> => {
        await apiClient.post("/class-requests/propose", payload);
    },

    // Phê duyệt yêu cầu mở lớp
    approveRequest: async (requestId: number): Promise<void> => {
        await apiClient.put(`/class-requests/${requestId}/approve`);
    },

    // Từ chối yêu cầu mở lớp kèm lý do cụ thể
    rejectRequest: async (requestId: number, payload: RejectClassRequestDto): Promise<void> => {
        await apiClient.put(`/class-requests/${requestId}/reject`, payload);
    },

    // Lấy danh sách toàn bộ các học kỳ trong hệ thống
    getSemesters: async (): Promise<SemesterResponse[]> => {
        const response = (await apiClient.get("/semesters/all")) as { data?: SemesterResponse[] } & SemesterResponse[];
        // Giữ nguyên tương thích cho cả dữ liệu bọc trong data hoặc trả về trực tiếp
        return response.data || response;
    },

    // Lấy danh sách môn học cho dropdown của Chủ nhiệm khoa
    getCourseDropdown: async (): Promise<DropdownResponseDto[]> => {
        const response = (await apiClient.get("/class-requests/dropdown/dean-courses")) as { data: DropdownResponseDto[] };
        return response.data;
    },

    // Lấy danh sách các ca học cho dropdown
    getShiftsDropdown: async (): Promise<DropdownResponseDto[]> => {
        const response = (await apiClient.get("/class-requests/dropdown/shifts")) as { data: DropdownResponseDto[] };
        return response.data;
    },

    // Lấy danh sách phòng học cho dropdown
    getRoomsDropdown: async (): Promise<DropdownResponseDto[]> => {
        const response = (await apiClient.get("/class-requests/dropdown/rooms")) as { data: DropdownResponseDto[] };
        return response.data;
    },

    // Tự động khởi tạo danh sách lớp học từ yêu cầu được duyệt
    generateClasses: async (requestId: number, payload: GenerateClassRequestDto): Promise<void> => {
        await apiClient.post(`/class-requests/${requestId}/generate-classes`, payload);
    },
};