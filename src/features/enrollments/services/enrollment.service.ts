/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/services/apiClient";
import {
    type CourseWithClassesResponse,
    type EnrollmentResponse,
} from "../types";

export const enrollmentService = {
    // Lấy danh sách môn học và lớp học đang mở
    getAvailableCourses: async (): Promise<CourseWithClassesResponse[]> => {
        const response: any = await apiClient.get("/class-requests/courses-with-classes");
        return response.data || response;
    },

    // Lấy danh sách các học phần đã đăng ký của sinh viên
    getRegisteredClasses: async (): Promise<EnrollmentResponse[]> => {
        const response: any = await apiClient.get("/enrollments/my");
        return response.data || response;
    },

    // Đăng ký lớp học phần 
    registerClass: async (classId: number): Promise<EnrollmentResponse> => {
        const response: any = await apiClient.post(`/enrollments/${classId}`);
        return response.data || response;
    },

    // Hủy đăng ký học phần
    cancelRegistration: async (enrollmentId: number): Promise<void> => {
        await apiClient.delete(`/enrollments/${enrollmentId}`);
    },
};