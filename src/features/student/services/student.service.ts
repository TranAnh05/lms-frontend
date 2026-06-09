/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/services/apiClient";

import { MOCK_EXAM_TAKING_DATA, MOCK_STUDENT_GRADES } from "../data/mockdata";
import {
    type StudentClassResponse,
    type StudentLessonBasic,
    type StudentExamBasic,
    type ExamTakingResponse,
    type ExamSubmitPayload,
    type ExamSubmitResponse,
    type StudentGradeResponse,
} from "../types";

const networkDelay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const studentService = {
    getMyClasses: async (): Promise<StudentClassResponse[]> => {
        return apiClient.get("/enrollments/my");
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

    getExamQuestions: async (examId: number): Promise<ExamTakingResponse> => {
        await networkDelay(600);
        if (!MOCK_EXAM_TAKING_DATA[examId]) {
            throw new Error("Không tìm thấy đề thi hoặc đề thi chưa mở.");
        }
        return MOCK_EXAM_TAKING_DATA[examId];
    },

    submitExam: async (
        examId: number,
        payload: ExamSubmitPayload,
    ): Promise<ExamSubmitResponse> => {
        await networkDelay(800);

        const totalQuestions =
            MOCK_EXAM_TAKING_DATA[examId]?.totalQuestions || 10;
        const answeredCount = payload.answers.filter(
            (ans) => ans.selectedOptionId !== null,
        ).length;
        const correctAnswers = Math.min(
            Math.floor(Math.random() * (answeredCount + 1)) +
                Math.floor(totalQuestions * 0.4),
            totalQuestions,
        );

        const rawScore = (correctAnswers / totalQuestions) * 10;
        const finalScore = parseFloat(rawScore.toFixed(2));

        return {
            attemptId: Math.floor(Math.random() * 90000) + 10000,
            score: finalScore,
            correctAnswers,
            totalQuestions,
            submitTime: new Date().toISOString(),
        };
    },

    getGradeByClass: async (
        classId: number,
    ): Promise<StudentGradeResponse | null> => {
        await networkDelay(500);
        return MOCK_STUDENT_GRADES[classId] || null;
    },

    downloadMaterial: async (materialId: number): Promise<Blob> => {
        const response = await apiClient.get(`/classes/materials/${materialId}/download`, {
            responseType: "blob",
        });
        
        return response as unknown as Blob; 
    },
};
