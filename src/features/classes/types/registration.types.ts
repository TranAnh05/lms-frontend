import { type SemesterBasic, type ClassResponse, type CourseBasic } from "./index";

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

export interface CourseWithClasses {
    course: CourseBasic;
    classes: ClassResponse[];
}