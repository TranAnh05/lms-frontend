export interface CourseBasic {
    id: number;
    code: string;
    name: string;
    credits: number;
    departmentId: number;
}

export interface SemesterBasic {
    id: number;
    semesterCode: string;
    academicYear: string;
}

export interface UserBasic {
    id: number;
    fullName: string;
}

export interface ClassRequestResponse {
    id: number;
    semester: SemesterBasic;
    course: CourseBasic;
    requester: UserBasic;
    expectedStudents: number;
    note?: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    rejectReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ClassRequestListParams {
    keyword?: string;
    semesterId?: number;
    status?: string;
    page: number;
    size: number;
    mockRequesterId?: number;
}

export interface ClassSchedulePayload {
    dayOfWeek: number;
    shiftId: number;
    roomId: number;
}

export interface CreateClassPayload {
    code: string;
    maxStudents: number;
    lecturerId?: number | null;
    schedules: ClassSchedulePayload[];
}

export interface ApproveAndCreateClassesPayload {
    requestId: number;
    classes: CreateClassPayload[];
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface CreateClassRequestPayload {
    semesterId: number;
    courseId: number;
    expectedStudents: number;
    note: string;
}
