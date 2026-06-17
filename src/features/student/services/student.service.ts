import apiClient from "@/services/apiClient";
import {
    type StudentClassResponse,
    type StudentLessonBasic,
    type StudentExamBasic,
    type ExamTakingResponse,
    type ExamSubmitResponse,
    type StudentGradeResponse,
    type ExamAttemptResponse,
    type SaveAnswerRequest,
} from "../types";

export const studentService = {
    getMyClasses: async (): Promise<StudentClassResponse[]> => {
        return apiClient.get("/enrollments/my");
    },

    getMyClassesRegistered: async (): Promise<StudentClassResponse[]> => {
        return apiClient.get("/enrollments/my/registered");
    },

    getLessons: async (classId: number): Promise<StudentLessonBasic[]> => {
        const response = (await apiClient.get(
            `/classes/${classId}/lessons`,
        )) as { data: StudentLessonBasic[] };
        return response.data || [];
    },

    getExams: async (classId: number): Promise<StudentExamBasic[]> => {
        const response = (await apiClient.get(
            `/classes/${classId}/exams/active`,
        )) as { data: StudentExamBasic[] };
        return response.data || [];
    },

    startExam: async (examId: number): Promise<ExamAttemptResponse> => {
        const response = (await apiClient.post(
            `/exams/${examId}/attempts`,
        )) as { data: ExamAttemptResponse };
        return response.data;
    },

    getExamQuestions: async (examId: number): Promise<ExamTakingResponse> => {
        const response = (await apiClient.get(`/exams/${examId}/paper`)) as {
            data: ExamTakingResponse;
        };
        return response.data;
    },

    saveStudentAnswer: async (
        attemptId: number,
        payload: SaveAnswerRequest,
    ): Promise<string> => {
        const response = (await apiClient.put(
            `/attempts/${attemptId}/answers`,
            payload,
        )) as { data: string };
        return response.data;
    },

    submitExam: async (
        attemptId: number,
        acceptIncomplete: boolean = false,
    ): Promise<ExamSubmitResponse> => {
        const response = (await apiClient.post(
            `/attempts/${attemptId}/submit?acceptIncomplete=${acceptIncomplete}`,
        )) as { data: ExamSubmitResponse };
        return response.data;
    },

    getGradeByClass: async (
        classId: number,
    ): Promise<StudentGradeResponse | null> => {
        const response = (await apiClient.get(
            `/classes/${classId}/my-grade`,
        )) as { data: StudentGradeResponse | null };
        return response.data || null;
    },

    downloadMaterial: async (materialId: number): Promise<Blob> => {
        const response = (await apiClient.get(
            `/classes/materials/${materialId}/download`,
            {
                responseType: "blob",
            },
        )) as { data: Blob };

        return response.data;
    },
};
