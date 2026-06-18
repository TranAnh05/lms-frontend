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
    // Lay danh sach lop hoc duoc phan cong cho giang vien
    getAssignedClasses: async (status?: string): Promise<LecturerClassResponse[]> => {
        const response = await apiClient.get<LecturerClassResponse[]>("/classes/my-assigned", {
            params: { status } 
        });
        return response.data;
    },

    // Lay danh sach sinh vien thuoc lop hoc
    getStudentsOfClass: async (classId: number): Promise<StudentOfClassResponse[]> => {
        const response = await apiClient.get<StudentOfClassResponse[]>(`/classes/${classId}/students`);
        return response.data;
    },

    // Lay thong tin chi tiet cua lop hoc
    getClassDetail: async (classId: number): Promise<LecturerClassDetailResponse> => {
        const response = await apiClient.get<LecturerClassDetailResponse>(`/classes/${classId}/detail-with-students`);
        return response.data;
    },

    // Lay danh sach bai hoc cua lop
    getLessons: async (classId: number): Promise<LessonBasic[]> => {
        const response = await apiClient.get<LessonBasic[]>(`/classes/${classId}/lessons`);
        return response.data;
    },

    // Tao bai hoc moi kem tài lieu (Multipart Form Data)
    createLesson: async (classId: number, formData: FormData): Promise<string> => {
        const response = await apiClient.post<string>(`/classes/${classId}/lessons`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },

    // Lay danh sach cac bai kiem tra cua lop
    getExams: async (classId: number): Promise<ExamBasic[]> => {
        const response = await apiClient.get<ExamBasic[]>(`/classes/${classId}/exams`);
        return response.data;
    },

    // Tao de thi moi cho lop hoc
    createExam: async (classId: number, payload: CreateExamPayload): Promise<string> => {
        const response = await apiClient.post<string>(`/classes/${classId}/exams`, payload);
        return response.data;
    },

    // Toi uu: Dinh nghia kieu du lieu ro rang, loai bo hoan toan ep kieu 'any'
    getClassGrades: async (classId: number): Promise<ClassGradeListResponse> => {
        const response = await apiClient.get<ClassGradeListResponse>(`/classes/${classId}/grades`);
        return response.data;
    },

    // Khoa va chot bang diem cua lop hoc
    finalizeGrades: async (classId: number): Promise<void> => {
        await apiClient.post("/grades/lock", null, {
            params: { classId }
        });
    },

    // Mo de thi de sinh vien co the vao lam bai
    openExam: async (classId: number, examId: number): Promise<void> => {
        await apiClient.put(`/classes/${classId}/exams/${examId}/open`);
    },

    // Dong/Khoa de thi lai
    closeExam: async (classId: number, examId: number): Promise<void> => {
        await apiClient.put(`/classes/${classId}/exams/${examId}/close`);
    },
};