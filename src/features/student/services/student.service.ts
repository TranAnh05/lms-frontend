import { 
    MOCK_STUDENT_CLASSES, 
    MOCK_STUDENT_LESSONS, 
    MOCK_STUDENT_EXAMS, 
    MOCK_EXAM_TAKING_DATA, 
    MOCK_STUDENT_GRADES
} from "../data/mockdata";
import { 
    type StudentClassResponse, 
    type StudentLessonBasic, 
    type StudentExamBasic, 
    type ExamTakingResponse, 
    type ExamSubmitPayload, 
    type ExamSubmitResponse, 
    type StudentGradeResponse
} from "../types";

const networkDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const studentService = {
    // 1. Lấy danh sách lớp đang học của sinh viên
    getMyClasses: async (): Promise<StudentClassResponse[]> => {
        await networkDelay(500);
        return MOCK_STUDENT_CLASSES;
    },

    // 2. Lấy danh sách bài học cùng tài liệu đính kèm của một lớp
    getLessons: async (classId: number): Promise<StudentLessonBasic[]> => {
        await networkDelay(400);
        return MOCK_STUDENT_LESSONS[classId] || [];
    },

    // 3. Lấy danh sách bài kiểm tra của một lớp
    getExams: async (classId: number): Promise<StudentExamBasic[]> => {
        await networkDelay(400);
        return MOCK_STUDENT_EXAMS[classId] || [];
    },

    // 4. Vào làm bài: Lấy cấu trúc câu hỏi (không kèm đáp án đúng)
    getExamQuestions: async (examId: number): Promise<ExamTakingResponse> => {
        await networkDelay(600);
        if (!MOCK_EXAM_TAKING_DATA[examId]) {
            throw new Error("Không tìm thấy đề thi hoặc đề thi chưa mở.");
        }
        return MOCK_EXAM_TAKING_DATA[examId];
    },

    // 5. Nộp bài kiểm tra: Tính điểm dựa trên số câu trả lời
    submitExam: async (examId: number, payload: ExamSubmitPayload): Promise<ExamSubmitResponse> => {
        await networkDelay(800);

        const totalQuestions = MOCK_EXAM_TAKING_DATA[examId]?.totalQuestions || 10;
        
        // Giả lập chấm điểm ngẫu nhiên dựa trên số câu trả lời sinh viên chọn
        const answeredCount = payload.answers.filter(ans => ans.selectedOptionId !== null).length;
        const correctAnswers = Math.min(
            Math.floor(Math.random() * (answeredCount + 1)) + Math.floor(totalQuestions * 0.4), 
            totalQuestions
        );
        
        const rawScore = (correctAnswers / totalQuestions) * 10;
        const finalScore = parseFloat(rawScore.toFixed(2));

        return {
            attemptId: Math.floor(Math.random() * 90000) + 10000,
            score: finalScore,
            correctAnswers,
            totalQuestions,
            submitTime: new Date().toISOString()
        };
    },

    getGradeByClass: async (classId: number): Promise<StudentGradeResponse | null> => {
        await networkDelay(500);
        return MOCK_STUDENT_GRADES[classId] || null;
    }
};