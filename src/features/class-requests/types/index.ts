// Basic Types
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

// Class Requests
export interface ClassOpeningRequestPayload {
    semesterId: number;
    courseId: number;
    expectedStudents: number;
    note?: string;
}

export interface RequestFilterParams {
    page?: number;
    size?: number;
    status?: "PENDING" | "APPROVED" | "REJECTED" | "";
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
    status: "PENDING" | "APPROVED" | "REJECTED";
    rejectReason?: string;
    createdAt: string;
    updatedAt?: string;
}

// Pagination & Generic
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface DropdownResponseDto {
    id: number;
    name: string;
}

// Review Request
export interface ApproveClassRequestDto {
    status: "APPROVED" | "REJECTED";
    rejectReason?: string;
    managerId?: number;
    roomId?: number;
    shiftId?: number;
    dayOfWeek?: number;
}