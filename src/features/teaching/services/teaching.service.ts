import apiClient from "@/services/apiClient";
import { 
    type LecturerClassResponse, 
    type LecturerClassDetailResponse,
    type LessonBasic, 
    type ExamBasic, 
    type CreateExamPayload,
    type StudentGrade, 
    type StudentOfClassResponse
} from "../types";

import { MOCK_GRADES } from "../data/mockTeachingData";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const teachingService = {
    getAssignedClasses: async (status?: string): Promise<LecturerClassResponse[]> => {
        const response = await apiClient.get<LecturerClassResponse[]>("/classes/my-assigned", {
            params: { status } 
        });
        return response.data;
    },

    getStudentsOfClass: async (classId: number): Promise<StudentOfClassResponse[]> => {
        const response = await apiClient.get<StudentOfClassResponse[]>(`/classes/${classId}/students`);
        return response.data;
    },

    getClassDetail: async (classId: number): Promise<LecturerClassDetailResponse> => {
        const response = await apiClient.get<LecturerClassDetailResponse>(`/classes/${classId}/detail-with-students`);
        return response.data;
    },

    getLessons: async (classId: number): Promise<LessonBasic[]> => {
        const response = await apiClient.get<LessonBasic[]>(`/classes/${classId}/lessons`);
        return response.data;
    },

    createLesson: async (classId: number, formData: FormData): Promise<string> => {
        const response = await apiClient.post<string>(`/classes/${classId}/lessons`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },

    getExams: async (classId: number): Promise<ExamBasic[]> => {
        const response = await apiClient.get<ExamBasic[]>(`/classes/${classId}/exams`);
        return response.data;
    },

    createExam: async (classId: number, payload: CreateExamPayload): Promise<string> => {
        const response = await apiClient.post<string>(`/classes/${classId}/exams`, payload);
        return response.data;
    },

    // --- Giữ lại Mock Data cho các tính năng chưa có API ---

    getClassGrades: async (classId: number): Promise<StudentGrade[]> => {
        await delay(400);
        return MOCK_GRADES[classId] || [];
    },

    finalizeGrades: async (classId: number): Promise<void> => {
        await delay(800);
    },

    openExam: async (examId: number): Promise<void> => {
        await delay(500); 
    },

    closeExam: async (examId: number): Promise<void> => {
        await delay(500);
    }
};