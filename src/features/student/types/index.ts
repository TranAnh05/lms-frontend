// Các kiểu trạng thái hệ thống (Union Types)
export type ClassStatus = 'ONGOING' | 'COMPLETED';
export type ExamType = 'REGULAR' | 'MIDTERM' | 'FINAL';
export type ExamStatus = 'CREATED' | 'OPEN' | 'CLOSED';
export type AttemptStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FORCED';
export type GradeStatus = 'PASS' | 'FAIL' | 'PENDING';

// Thông tin lớp học của học sinh
export interface StudentClassResponse {
    readonly classId: number;
    readonly classCode: string;
    readonly courseName: string;
    readonly status: ClassStatus;
}

// Tài liệu đính kèm bài học
export interface StudentLessonMaterial {
    readonly id: number;
    readonly fileName: string;
    readonly fileUrl: string;
    readonly fileType?: string;
    readonly fileSize?: number;
}

// Thông tin chi tiết bài học
export interface StudentLessonBasic {
    readonly id: number;
    readonly classId: number;
    readonly title: string;
    readonly description?: string;
    readonly orderIndex: number;
    readonly isPublished: boolean;
    readonly materials: StudentLessonMaterial[];
    readonly createdAt: string;
}

// Cấu trúc dữ liệu gốc của một bài kiểm tra từ API
export interface ExamResponseDto {
    readonly id: number;
    readonly classId: number;
    readonly title: string;
    readonly description?: string;
    readonly examType: ExamType;
    readonly timeLimit: number;
    readonly totalQuestions: number;
    readonly status: ExamStatus;
    readonly createdAt: string;
    readonly deletedAt?: string | null;
}

// Thông tin bài kiểm tra hiển thị cho học sinh (Kế thừa từ ExamResponseDto)
export interface StudentExamBasic extends ExamResponseDto {
    readonly attemptStatus: AttemptStatus;
    readonly score?: number;
}

// Thông tin lượt tham gia làm bài kiểm tra
export interface ExamAttemptResponse {
    readonly attemptId: number;
    readonly examId: number;
    readonly startTime: string;
    readonly status: AttemptStatus;
}

// Lựa chọn đáp án trong câu hỏi kiểm tra
export interface ExamTakingOption {
    readonly optionId: number; 
    readonly content: string;
}

// Câu hỏi trong giao diện làm bài kiểm tra
export interface ExamTakingQuestion {
    readonly questionId: number; 
    readonly content: string;
    readonly options: ExamTakingOption[];
}

// Cấu trúc dữ liệu toàn bộ đề thi khi học sinh đang làm bài
export interface ExamTakingResponse {
    readonly examId: number;
    readonly title: string;
    readonly timeLimit: number;
    readonly totalQuestions: number;
    readonly questions: ExamTakingQuestion[];
}

// Dữ liệu gửi lên API khi học sinh chọn một đáp án
export interface SaveAnswerRequest {
    readonly questionId: number;
    readonly selectedOptionId: number;
}

// Kết quả trả về sau khi nộp bài kiểm tra thành công
export interface ExamSubmitResponse {
    readonly attemptId: number;
    readonly score: number;
    readonly correctAnswers: number;
    readonly totalQuestions: number;
    readonly submitTime: string;
    readonly status: AttemptStatus | string; // Tối ưu kết hợp linh hoạt giữa trạng thái thi và chuỗi tự do
}

// Bảng điểm tổng kết các đầu điểm của học sinh
export interface StudentGradeResponse {
    readonly regularScore1: number | null;
    readonly regularScore2: number | null;
    readonly midtermScore: number | null;
    readonly finalScore: number | null;
    readonly totalScore: number | null;
    readonly status: GradeStatus;
}