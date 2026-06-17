export type RegistrationStatus = "PENDING" | "ACTIVE" | "CLOSED";

export interface SemesterResponse {
    id: number;
    semesterCode: string;
    academicYear: string;
}

export interface DepartmentResponse {
    id: number;
    code: string;
    name: string;
}

export interface ClassPendingResponse {
    id: number;
    code: string;
    maxStudents: number;
    status: string;
    courseId: number;
    courseCode: string;
    courseName: string;
    credits: number;
    departmentId: number;
    departmentName: string;
}

export interface ClassInPeriodResponse {
    id: number;
    code: string;
    courseName: string;
    enrolledCount: number;
    maxStudents: number;
    lecturerName: string | null;
}

export interface RegistrationPeriodResponse {
    id: number;
    semesterId: number;
    semesterCode: string;
    name: string;
    type: string;
    startTime: string; 
    endTime: string;   
    targetCohorts: number[];
    targetDepartments: number[];
    status: RegistrationStatus; 
    createdAt: string;
    updatedAt: string;
}

export type CreateRegistrationPayload = Pick<
    RegistrationPeriodResponse,
    "semesterId" | "name" | "type" | "startTime" | "endTime" | "targetCohorts" | "targetDepartments"
>;

export interface RegistrationPeriodDetailResponse extends Pick<
    RegistrationPeriodResponse,
    "id" | "name" | "startTime" | "endTime" | "semesterId"
> {
    status: string;
    semesterName: string;
    totalClasses: number;
    totalEnrollments: number;
    classes: ClassInPeriodResponse[];
}