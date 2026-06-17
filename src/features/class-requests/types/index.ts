// --- COMMON UNIONS & CONSTANTS ---
export type ClassStatus = "PENDING" | "REGISTRATION" | "ONGOING" | "COMPLETED" | "CANCELED";
export type ClassRequestStatus = "PENDING" | "APPROVED" | "REJECTED";
export type RoomType = "THEORY" | "LAB" | "HALL";
export type SortDirection = "asc" | "desc";

// --- SHARED / BASIC TYPES ---
export interface DropdownResponseDto {
    id: number;
    name: string;
}

export interface PageResponse<T> {
    content: T[];
    pageable?: {
        pageNumber: number;
        pageSize: number;
    };
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

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
    email?: string;
}

export interface DepartmentBasic {
    id: number;
    name: string;
}

export interface LecturerBasic {
    id: number;
    employeeCode: string;
    fullName: string;
    academicTitle: string;
    departmentId: number;
}

export interface SemesterResponse {
    id: number;
    semesterCode: string;
    academicYear: string;
    semesterNumber: number;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

// --- CLASS MANAGEMENT TYPES ---
export interface AssignLecturerPayload {
    classId: number;
    lecturerId: number;
}

export interface ClassResponse {
    id: number;
    code: string;
    course: CourseBasic;
    semester: SemesterBasic;
    manager: UserBasic;
    lecturer: UserBasic | null;
    maxStudents: number;
    currentStudents: number;
    status: ClassStatus;
    lockReason?: string;
    createdAt: string;
    updatedAt: string;
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
        capacity: number;
    };
}

export interface ClassDetailResponse extends ClassResponse {
    registrationPeriod?: {
        id: number;
        name: string;
    };
    schedules: ScheduleBasic[];
}

export interface ClassListParams {
    keyword?: string;
    semesterId?: number;
    status?: string;
    page: number;
    size: number;
    sortBy?: string;
    sortDirection?: SortDirection;
}

// --- CLASS REQUEST TYPES ---
export interface ClassOpeningRequestPayload {
    semesterId: number;
    courseId: number;
    expectedStudents: number;
    note?: string;
}

export interface RequestFilterParams {
    page?: number;
    size?: number;
    status?: ClassRequestStatus | "";
    search?: string;
    semesterId?: number;
}

export interface ClassOpeningResponseDto {
    requestId: number;
    courseId: number;
    courseName: string;
    requesterId: number;
    requesterName: string;
    semesterCode: string;
    expectedStudents: number;
    note?: string;
    status: ClassRequestStatus;
    rejectReason?: string;
    createdAt: string;
    updatedAt?: string;
    semesterId: number;
}

export interface RejectClassRequestDto {
    rejectReason: string;
}

export interface ClassConfigItem {
    roomId: number;
    shiftId: number;
    dayOfWeek: number;
    maxStudents: number;
}

export interface GenerateClassRequestDto {
    semesterId: number;
    courseId: number;
    managerId: number;
    classes: ClassConfigItem[];
}