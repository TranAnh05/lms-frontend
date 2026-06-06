import { type SemesterBasic } from "./index";

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

export interface RegistrationPeriodResponse {
    id: number;
    semester: SemesterBasic;
    name: string;
    type: string;
    startTime: string; 
    endTime: string;   
    targetCohorts: number[];
    targetDepartments: number[];
    status: "PENDING" | "ACTIVE" | "CLOSED";
    createdAt: string;
    updatedAt: string;
}

export interface CreateRegistrationPayload {
    semesterId: number;
    name: string;
    type: string;
    startTime: string; 
    endTime: string;
    targetCohorts: number[];
    targetDepartments: number[];
}

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