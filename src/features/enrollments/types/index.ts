export type RoomType = "THEORY" | "LAB" | "HALL";
export type EnrollmentStatus = "REGISTERED" | "OFFICIAL" | "DROPPED";
export type ClassStatus =
    | "PENDING"
    | "REGISTRATION"
    | "ONGOING"
    | "COMPLETED"
    | "CANCELED";

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
        type: RoomType;
    };
}

export interface CourseWithClassesResponse {
    courseId: number;
    courseName: string;
    credits: number;
    classes: ClassInfo[];
}

export interface ClassInfo {
    classId: number;
    classCode: string;
    lecturerName: string;
    dayOfWeek: number;
    shiftName: string;
    startTimeShilf: string;
    endTimeShilf: string;
    roomName: string;
    currentStudents: number;
    maxStudents: number;
}

export interface EnrollmentResponse {
    courseId: number;
    courseCode: string;
    courseName: string;
    credits: number;
    classId: number;
    classCode: string;
    dayOfWeek: number;
    shiftName: string;
    roomName: string;
    status: EnrollmentStatus;
    enrolledAt: string;
}

export interface ClassRegistrationDTO {
    id: number;
    code: string;
    maxStudents: number;
    currentStudents: number;
    status: ClassStatus;
    lecturer: LecturerBasic | null;
    schedules: ScheduleBasic[];
}

export interface CourseWithClassesDTO {
    course: CourseBasic;
    classes: ClassRegistrationDTO[];
}

export interface RegisteredClassDTO {
    enrollmentId: number;
    status: EnrollmentStatus;
    enrolledAt: string;
    classId: number;
    classCode: string;
    courseId: number;
    courseName: string;
    courseCode: string;
    credits: number;
    schedules: ScheduleBasic[];
}

export interface RegisterClassPayload {
    classId: number;
}

export interface EnrollmentFilterParams {
    keyword?: string;
    dayOfWeek?: number;
    shiftId?: number;
}
