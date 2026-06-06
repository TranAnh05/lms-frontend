export interface CourseBasic {
    id: number;
    code: string;
    name: string;
    credits: number;
    departmentId: number;
}

export interface UserBasic {
    id: number;
    fullName: string;
    email?: string;
}

export interface LecturerBasic {
    id: number;
    employeeCode: string;
    fullName: string;
    academicTitle: string;
    departmentId: number;
}

export interface DropdownResponseDto {
    id: number;
    name: string;
}

export interface AssignLecturerPayload {
    lecturerId: number;
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
        capacity: number;
    };
}

export interface ClassDetailResponse {
    id: number;
    code: string;
    status: string;
    maxStudents: number;
    currentStudents: number;
    semesterId: number;
    semesterCode: string;
    academicYear: string;
    courseId: number;
    courseName: string;
    courseCode: string;
    departmentId: number;
    departmentName: string;
    managerId: number;
    managerName: string;
    lecturerId?: number;
    lecturerName?: string;
    createdAt: string;
    registrationPeriod?: {
        id: number;
        name: string;
    };
    schedules?: ScheduleBasic[];
    lockReason?: string;
}

export interface ClassListParams {
    keyword?: string;
    semesterId?: number;
    departmentId?: number;
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

export interface DepartmentBasic {
    id: number;
    code: string;
    name: string;
}

export interface SemesterBasic {
    id: number;
    semesterCode: string;
    academicYear: string;
}