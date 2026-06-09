export type ClassStatus = 'PENDING' | 'REGISTRATION' | 'ONGOING' | 'COMPLETED' | 'CANCELED';
export type ExamType = 'REGULAR' | 'MIDTERM' | 'FINAL';
export type ExamStatus = 'CREATED' | 'OPEN' | 'CLOSED';
export type AttemptStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FORCED';

export interface StudentClassResponse {
    classId: number;
    classCode: string;
    courseName: string;
    credits: number;
    lecturerName: string;
    status: ClassStatus;
}

export interface StudentLessonMaterial {
    id: number;
    fileName: string;
    fileUrl: string;
    fileType?: string;
    fileSize?: number;
}

export interface StudentLessonBasic {
    id: number;
    classId: number;
    title: string;
    description?: string;
    orderIndex: number;
    materials: StudentLessonMaterial[];
    createdAt: string;
}

export interface StudentExamBasic {
    id: number;
    classId: number;
    title: string;
    description?: string;
    examType: ExamType;
    timeLimit: number;
    totalQuestions: number;
    status: ExamStatus;
    attemptStatus: AttemptStatus; 
    score?: number; 
}

export interface ExamTakingOption {
    id: number;
    content: string;
    orderIndex: number;
}

export interface ExamTakingQuestion {
    id: number;
    content: string;
    orderIndex: number;
    options: ExamTakingOption[];
}

export interface ExamTakingResponse {
    examId: number;
    title: string;
    timeLimit: number;
    totalQuestions: number;
    questions: ExamTakingQuestion[];
}

export interface StudentAnswerPayload {
    questionId: number;
    selectedOptionId: number | null; 
}

export interface ExamSubmitPayload {
    answers: StudentAnswerPayload[];
}

export interface ExamSubmitResponse {
    attemptId: number;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    submitTime: string;
}

export type GradeStatus = 'PASS' | 'FAIL' | 'PENDING';

export interface StudentGradeResponse {
    regularScore1: number | null;
    regularScore2: number | null;
    midtermScore: number | null;
    finalScore: number | null;
    totalScore: number | null;
    status: GradeStatus;
}