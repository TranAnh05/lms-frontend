import apiClient from "@/services/apiClient";
import {
    type CourseWithClassesResponse,
    type EnrollmentResponse,
} from "../types";

type WrappedResponse<T> = { data?: T } & T;

export const enrollmentService = {
    // Lấy danh sách môn học và lớp học đang mở
    getAvailableCourses: async (): Promise<CourseWithClassesResponse[]> => {
        const response = await apiClient.get<unknown>("/class-requests/courses-with-classes") as unknown as WrappedResponse<CourseWithClassesResponse[]>;
        return response.data || response;
    },

    // Lấy danh sách các học phần đã đăng ký của sinh viên
    getRegisteredClasses: async (): Promise<EnrollmentResponse[]> => {
        const response = await apiClient.get<unknown>("/enrollments/my") as unknown as WrappedResponse<EnrollmentResponse[]>;
        return response.data || response;
    },

    // Đăng ký lớp học phần 
    registerClass: async (classId: number): Promise<EnrollmentResponse> => {
        const response = await apiClient.post<unknown>(`/enrollments/${classId}`) as unknown as WrappedResponse<EnrollmentResponse>;
        return response.data || response;
    },

    // Hủy đăng ký học phần
    cancelRegistration: async (enrollmentId: number): Promise<void> => {
        await apiClient.delete<void>(`/enrollments/${enrollmentId}`);
    },
};