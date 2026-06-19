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
    type ClassDetailForStudentResponse,
} from "../types";

// Định dạng cấu trúc phản hồi linh hoạt từ API Client
interface ApiResponse<T> {
    data?: T;
}

export const classService = {
    // Lấy danh sách lớp học có phân trang và bộ lọc
    getClasses: async (params: ClassListParams): Promise<PageResponse<ClassDetailResponse>> => {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([value]) => value !== undefined && value !== null && value !== "")
        );
        const response = await apiClient.get("/classes", { params: cleanParams }) as ApiResponse<PageResponse<ClassDetailResponse>>;
        return response.data || (response as unknown as PageResponse<ClassDetailResponse>);
    },

    // Lấy thông tin chi tiết của một lớp học theo ID
    getClassById: async (id: number): Promise<ClassDetailResponse> => {
        const response = await apiClient.get(`/classes/${id}`) as ApiResponse<ClassDetailResponse>;
        return response.data || (response as unknown as ClassDetailResponse);
    },

    // Lấy danh sách tất cả các khoa
    getDepartments: async (): Promise<DepartmentBasic[]> => {
        const response = await apiClient.get("/departments") as ApiResponse<DepartmentBasic[]>;
        return response.data || (response as unknown as DepartmentBasic[]);
    },

    // Lấy danh sách tất cả các học kỳ
    getSemesters: async (): Promise<SemesterBasic[]> => {
        const response = await apiClient.get("/semesters/all") as ApiResponse<SemesterBasic[]>;
        return response.data || (response as unknown as SemesterBasic[]);
    },

    // Lấy danh sách giảng viên theo khoa
    getLecturers: async (departmentId?: number): Promise<LecturerBasic[]> => {
        const params = departmentId ? { departmentId } : {};
        try {
            const response = await apiClient.get("/lecturers", { params }) as ApiResponse<LecturerBasic[]>;
            return response.data || (response as unknown as LecturerBasic[]);
        } catch (error) {
            console.error("Lỗi khi tải danh sách giảng viên:", error);
            return [];
        }
    },

    // Lấy danh sách dropdown giảng viên có thể phân công cho lớp
    getInstructorsDropdown: async (classId: number): Promise<DropdownResponseDto[]> => {
        const response = await apiClient.get(`/class-requests/classes/${classId}/dropdown/instructors`) as ApiResponse<DropdownResponseDto[]>;
        return response.data || (response as unknown as DropdownResponseDto[]);
    },

    // Thực hiện phân công giảng viên vào lớp học
    assignLecturer: async (classId: number, payload: AssignLecturerPayload): Promise<void> => {
        await apiClient.put(`/class-requests/classes/${classId}/assign-lecturer`, payload);
    },

    // Lấy thông tin chi tiết lớp học dành cho giao diện sinh viên
    getClassDetailForStudent: async (classId: number): Promise<ClassDetailForStudentResponse> => {
        const response = await apiClient.get(`/classes/${classId}/student-detail`) as ApiResponse<ClassDetailForStudentResponse>;
        return response.data || (response as unknown as ClassDetailForStudentResponse);
    },
};