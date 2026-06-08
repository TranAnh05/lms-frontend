export type ClassStatus = 'PENDING' | 'REGISTRATION' | 'ONGOING' | 'COMPLETED' | 'CANCELED';
export type EnrollmentStatus = 'REGISTERED' | 'OFFICIAL' | 'DROPPED';
export type ExamType = 'REGULAR' | 'MIDTERM' | 'FINAL';
export type ExamStatus = 'CREATED' | 'OPEN' | 'CLOSED';
export type GradeStatus = 'PENDING' | 'PASS' | 'FAIL';

export interface ClassBasic {
    id: number;
    code: string;
    courseCode: string;
    courseName: string;
    credits: number;
    semesterCode: string;
    maxStudents: number;
    currentStudents: number;
    status: ClassStatus;
}

export interface StudentInClass {
    enrollmentId: number;
    studentId: number;
    studentCode: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    cohort: number;
    enrollmentStatus: EnrollmentStatus;
    enrolledAt: string;
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
    title: string;
    description?: string;
    orderIndex: number;
    isPublished: boolean;
    materials: LessonMaterial[];
    createdAt: string;
    updatedAt: string;
}

export interface ExamBasic {
    id: number;
    title: string;
    description?: string;
    examType: ExamType;
    timeLimit: number; 
    totalQuestions: number;
    status: ExamStatus;
    createdAt: string;
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