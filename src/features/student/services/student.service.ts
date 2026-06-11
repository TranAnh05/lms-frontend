/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/services/apiClient";

import {
    type StudentClassResponse,
    type StudentLessonBasic,
    type StudentExamBasic,
    type ExamTakingResponse,
    type ExamSubmitPayload,
    type ExamSubmitResponse,
    type StudentGradeResponse,
    type ExamAttemptResponse,
    type SaveAnswerRequest,
} from "../types";

export const studentService = {
    getMyClasses: async (): Promise<StudentClassResponse[]> => {
        return apiClient.get("/enrollments/my");
    },

    getMyClassesRegitered: async (): Promise<StudentClassResponse[]> => {
        return apiClient.get("/enrollments/my/registered")
    },

    getLessons: async (classId: number): Promise<StudentLessonBasic[]> => {
        const response = await apiClient.get(`/classes/${classId}/lessons`);
        return (response as any).data || [];
    },

    getExams: async (classId: number): Promise<StudentExamBasic[]> => {
        const response = await apiClient.get(
            `/classes/${classId}/exams/active`,
        );
        return (response as any).data || [];
    },

    startExam: async (examId: number): Promise<ExamAttemptResponse> => {
        const response = await apiClient.post(`/exams/${examId}/attempts`);
        return (response as any).data;
    },

    getExamQuestions: async (examId: number): Promise<ExamTakingResponse> => {
        const response = await apiClient.get(`/exams/${examId}/paper`);
        return (response as any).data;
    },

    saveStudentAnswer: async (
        attemptId: number,
        payload: SaveAnswerRequest
    ): Promise<string> => {
        const response = await apiClient.put(
            `/attempts/${attemptId}/answers`,
            payload
        );
        return (response as any).data;
    },

    submitExam: async (
        attemptId: number,
        acceptIncomplete: boolean = false
    ): Promise<ExamSubmitResponse> => {
        const response = await apiClient.post(
            `/attempts/${attemptId}/submit?acceptIncomplete=${acceptIncomplete}`
        );
        return (response as any).data;
    },

    getGradeByClass: async (
        classId: number,
    ): Promise<StudentGradeResponse | null> => {
        const response = await apiClient.get(`/classes/${classId}/my-grade`);
        return (response as any).data || null;
    },

    downloadMaterial: async (materialId: number): Promise<Blob> => {
        const response = await apiClient.get(`/classes/materials/${materialId}/download`, {
            responseType: "blob",
        });
        
        return response as unknown as Blob; 
    },
};
