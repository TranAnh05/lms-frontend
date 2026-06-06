// --- Basic Entities ---
export interface CourseBasic {
    id: number;
    code: string;
    name: string;
    credits: number;
}

export interface LecturerBasic {
    id: number;
    fullName: string;
    employeeCode?: string;
}

export interface ScheduleBasic {
    id: number;
    dayOfWeek: number; 
    shift: {
        id: number;
        name: string;
        startTime: string;
        endTime: string;
    };
    room: {
        id: number;
        name: string;
        type: "THEORY" | "LAB" | "HALL";
    };
}

// --- Left Column (Exploration) ---
export interface ClassRegistrationDTO {
    id: number;
    code: string;
    maxStudents: number;
    currentStudents: number;
    status: "PENDING" | "REGISTRATION" | "ONGOING" | "COMPLETED" | "CANCELED";
    lecturer: LecturerBasic | null;
    schedules: ScheduleBasic[];
}

export interface CourseWithClassesDTO {
    course: CourseBasic;
    classes: ClassRegistrationDTO[];
}

// --- Right Column (Cart/Registered) ---
export interface RegisteredClassDTO {
    enrollmentId: number;
    status: "REGISTERED" | "OFFICIAL" | "DROPPED";
    enrolledAt: string;
    classId: number;
    classCode: string;
    courseId: number;
    courseName: string;
    courseCode: string;
    credits: number;
    schedules: ScheduleBasic[];
}

// --- API Params & Payloads ---
export interface RegisterClassPayload {
    classId: number;
}

export interface EnrollmentFilterParams {
    keyword?: string;
    dayOfWeek?: number;
    shiftId?: number;
}