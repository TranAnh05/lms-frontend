export type RoomType = "THEORY" | "LAB" | "HALL";
export type SortDirection = "asc" | "desc";

export interface DropdownResponseDto {
    id: number;
    name: string;
}

export interface UserBasic {
    id: number;
    fullName: string;
    email?: string;
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

export interface CourseBasic {
    id: number;
    code: string;
    name: string;
    credits: number;
    departmentId: number;
}

export interface LecturerBasic {
    id: number;
    employeeCode: string;
    fullName: string;
    academicTitle: string;
    departmentId: number;
}

export interface ShiftBasic {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
}

export interface RoomBasic {
    id: number;
    name: string;
    type: RoomType;
    capacity: number;
}

export interface ScheduleBasic {
    id: number;
    dayOfWeek: number;
    shift: ShiftBasic;
    room: RoomBasic;
}

export interface RegistrationPeriodBasic {
    id: number;
    name: string;
}

export interface AssignLecturerPayload {
    lecturerId: number;
}

export interface ClassListParams {
    keyword?: string;
    semesterId?: number;
    departmentId?: number;
    status?: string;
    page: number;
    size: number;
    sortBy?: string;
    sortDirection?: SortDirection;
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
    registrationPeriod?: RegistrationPeriodBasic;
    schedules?: ScheduleBasic[];
    lockReason?: string;
}

export interface ScheduleInfoForStudent {
    dayOfWeek: number;
    shiftName: string;
    startTime: string;
    endTime: string;
    roomName: string;
    roomType: string;
}

export interface ClassDetailForStudentResponse {
    classId: number;
    classCode: string;
    status: string;
    maxStudents: number;
    currentStudents: number;
    semesterCode: string;
    courseCode: string;
    courseName: string;
    credits: number;
    lecturerName: string | null;
    schedules: ScheduleInfoForStudent[];
}

export interface PageableInfo {
    pageNumber: number;
    pageSize: number;
}

export interface PageResponse<T> {
    content: T[];
    pageable?: PageableInfo;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
