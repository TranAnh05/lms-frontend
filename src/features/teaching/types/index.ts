export type ClassStatus = 'PENDING' | 'REGISTRATION' | 'ONGOING' | 'COMPLETED' | 'CANCELED';
export type EnrollmentStatus = 'REGISTERED' | 'OFFICIAL' | 'DROPPED';
export type ExamType = 'REGULAR' | 'MIDTERM' | 'FINAL';
export type ExamStatus = 'CREATED' | 'OPEN' | 'CLOSED';
export type GradeStatus = 'PENDING' | 'PASS' | 'FAIL';

export interface LecturerClassResponse {
    classId: number;
    classCode: string;
    courseName: string;
    status: ClassStatus;
    maxStudents: number;
    currentStudents: number;
}

export interface LecturerClassDetailResponse {
    classId: number;
    classCode: string;
    courseName: string;
    courseCode: string;
    credits: number;
    status: ClassStatus;
    maxStudents: number;
    currentStudents: number;
    dayOfWeek: number;
    shiftName: string;
    roomName: string;
}

export interface StudentOfClassResponse {
    studentId: number;
    fullName: string;
    avatarUrl?: string;
    studentCode: string;
    email: string;
    enrollmentStatus: EnrollmentStatus;
}

export interface LessonMaterial {
    id: number;
    fileName: string;
    fileUrl: string;
    fileType?: string;
    fileSize?: number;
}

export interface LessonBasic {
    id: number;
    classId: number;
    title: string;
    description?: string;
    orderIndex: number;
    isPublished: boolean;
    materials: LessonMaterial[];
    createdAt: string;
}

export interface CreateLessonPayload {
    title: string;
    description?: string;
    orderIndex?: number;
    isPublished?: boolean;
    files?: File[];
}

export interface ExamBasic {
    id: number;
    classId: number;
    title: string;
    description?: string;
    examType: ExamType;
    timeLimit: number; 
    totalQuestions: number;
    status: ExamStatus;
    createdAt: string;
    deletedAt?: string;
}

export interface OptionDto {
    content: string;
    isCorrect: boolean;
    orderIndex?: number;
}

export interface QuestionDto {
    content: string;
    orderIndex?: number;
    options: OptionDto[];
}

export interface CreateExamPayload {
    title: string;
    description?: string;
    examType: ExamType;
    timeLimit: number;
    questions: QuestionDto[];
}

export interface StudentGrade {
    enrollmentId: number;
    studentCode: string;
    fullName: string;
    regularScore1?: number;
    regularScore2?: number;
    midtermScore?: number;
    finalScore?: number;
    totalScore?: number;
    status: GradeStatus;
}

export interface GradeFormula {
    regularWeight: number;
    midtermWeight: number;
    finalWeight: number;
}