// --- 1. Cac kieu trang thai (Status & Types) ---

export type ClassStatus = 'PENDING' | 'REGISTRATION' | 'ONGOING' | 'COMPLETED' | 'CANCELED';
export type EnrollmentStatus = 'REGISTERED' | 'OFFICIAL' | 'DROPPED';
export type ExamType = 'REGULAR' | 'MIDTERM' | 'FINAL';
export type ExamStatus = 'CREATED' | 'OPEN' | 'CLOSED';
export type GradeStatus = 'PENDING' | 'PASS' | 'FAIL';

// --- 2. Cac Interface lien quan den Lop hoc (Class) ---

// Thong tin co ban cua lop hoc hien thi o danh sach
export interface LecturerClassResponse {
    classId: number;
    classCode: string;
    courseName: string;
    status: ClassStatus;
    maxStudents: number;
    currentStudents: number;
}

// Toi uu: Ke thua tu LecturerClassResponse de tranh trung lap thuoc tinh
export interface LecturerClassDetailResponse extends LecturerClassResponse {
    courseCode: string;
    credits: number;
    dayOfWeek: number;
    shiftName: string;
    roomName: string;
}

// Thong tin hoc sinh trong lop hoc
export interface StudentOfClassResponse {
    studentId: number;
    fullName: string;
    avatarUrl?: string;
    studentCode: string;
    email: string;
    enrollmentStatus: EnrollmentStatus;
}

// --- 3. Cac Interface lien quan den Bai hoc (Lesson) ---

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

// --- 4. Cac Interface lien quan den De thi & Cau hoi (Exam & Question) ---

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

// --- 5. Cac Interface lien quan den Diem so (Grade) ---

export interface StudentGrade {
    studentId: number;
    studentCode: string;
    fullName: string;
    email: string;
    regularScore1?: number;
    regularScore2?: number;
    midtermScore?: number;
    finalScore?: number;
    totalScore?: number;
    status: GradeStatus;
}

export interface ClassGradeListResponse {
    classId: number;
    classCode: string;
    courseName: string;
    courseCode: string;
    totalStudents: number;
    students: StudentGrade[];
}