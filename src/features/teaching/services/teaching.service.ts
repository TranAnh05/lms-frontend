/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/services/apiClient";
import { 
    type LecturerClassResponse, 
    type LecturerClassDetailResponse,
    type LessonBasic, 
    type ExamBasic, 
    type CreateExamPayload,
    type StudentOfClassResponse,
    type ClassGradeListResponse
} from "../types";

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

   getClassGrades: async (classId: number): Promise<ClassGradeListResponse> => {
        const response = await apiClient.get(`/classes/${classId}/grades`);
        return (response as any).data;
    },

    finalizeGrades: async (classId: number): Promise<void> => {
        await apiClient.post("/grades/lock", null, {
            params: { classId }
        });
    },

    openExam: async (classId: number, examId: number): Promise<void> => {
        await apiClient.put(`/classes/${classId}/exams/${examId}/open`);
    },

    closeExam: async (classId: number, examId: number): Promise<void> => {
        await apiClient.put(`/classes/${classId}/exams/${examId}/close`);
    },
};