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
    status: "PENDING" | "REGISTRATION" | "ONGOING" | "COMPLETED" | "CANCELED";
    lockReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ClassListParams {
    keyword?: string;
    semesterId?: number;
    status?: string;
    page: number;
    size: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
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
