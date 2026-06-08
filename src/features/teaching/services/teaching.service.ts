import apiClient from "@/services/apiClient";
import { 
    type ClassBasic, 
    type StudentInClass, 
    type LessonBasic, 
    type ExamBasic, 
    type StudentGrade 
} from "../types";

import { 
    MOCK_CLASSES, 
    MOCK_STUDENTS, 
    MOCK_LESSONS, 
    MOCK_EXAMS, 
    MOCK_GRADES 
} from "../data/mockTeachingData";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const teachingService = {
    // 1. Danh sách lớp học được phân công
    getAssignedClasses: async (): Promise<ClassBasic[]> => {
        await delay(500);
        return MOCK_CLASSES;
        
        // const response = await apiClient.get<ClassBasic[]>("/teaching/classes");
        // return response.data;
    },

    // 2. Chi tiết lớp học
    getClassDetail: async (classId: number): Promise<ClassBasic | undefined> => {
        await delay(300);
        return MOCK_CLASSES.find(c => c.id === classId);

        // const response = await apiClient.get<ClassBasic>(`/teaching/classes/${classId}`);
        // return response.data;
    },

    // 2. Danh sách sinh viên trong lớp
    getStudentsInClass: async (classId: number): Promise<StudentInClass[]> => {
        await delay(400);
        return MOCK_STUDENTS[classId] || [];

        // const response = await apiClient.get<StudentInClass[]>(`/teaching/classes/${classId}/students`);
        // return response.data;
    },

    // 3. Xem bảng điểm
    getClassGrades: async (classId: number): Promise<StudentGrade[]> => {
        await delay(400);
        return MOCK_GRADES[classId] || [];

        // const response = await apiClient.get<StudentGrade[]>(`/teaching/classes/${classId}/grades`);
        // return response.data;
    },

    // 4. Danh sách bài học
    getLessons: async (classId: number): Promise<LessonBasic[]> => {
        await delay(400);
        return MOCK_LESSONS[classId] || [];

        // const response = await apiClient.get<LessonBasic[]>(`/teaching/classes/${classId}/lessons`);
        // return response.data;
    },

    // 4. Tạo bài học kèm file (Sử dụng FormData để upload file)
    createLesson: async (classId: number, formData: FormData): Promise<LessonBasic> => {
        await delay(600);
        return MOCK_LESSONS[1][0]; // Trả về mock data giả định

        // const response = await apiClient.post<LessonBasic>(`/teaching/classes/${classId}/lessons`, formData, {
        //     headers: { "Content-Type": "multipart/form-data" }
        // });
        // return response.data;
    },

    // 5. Danh sách bài kiểm tra
    getExams: async (classId: number): Promise<ExamBasic[]> => {
        await delay(400);
        return MOCK_EXAMS[classId] || [];

        // const response = await apiClient.get<ExamBasic[]>(`/teaching/classes/${classId}/exams`);
        // return response.data;
    },

    // 5. Tạo bài kiểm tra
    createExam: async (classId: number, payload: Partial<ExamBasic>): Promise<ExamBasic> => {
        await delay(600);
        return MOCK_EXAMS[1][0]; 

        // const response = await apiClient.post<ExamBasic>(`/teaching/classes/${classId}/exams`, payload);
        // return response.data;
    },

    // 6. Chốt điểm học phần
    finalizeGrades: async (classId: number): Promise<void> => {
        await delay(800);
        return; 

        // await apiClient.post(`/teaching/classes/${classId}/grades/finalize`);
    }
};