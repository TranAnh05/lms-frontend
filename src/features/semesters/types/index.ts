export type SemesterStatus = "ACTIVE" | "CLOSED";

export type ClassStatus =
    | "PENDING"
    | "REGISTRATION"
    | "ONGOING"
    | "COMPLETED"
    | "CANCELED";

export interface PageResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface SemesterResponse {
    id: number;
    semesterCode: string;
    academicYear: string;
    semesterNumber: number;
    startDate: string;
    endDate: string;
    status: SemesterStatus;
    createdAt: string;
    updatedAt: string;
}

export interface SemesterClassResponse {
    id: number;
    code: string;
    courseName: string;
    lecturerName: string | null;
    status: ClassStatus;
}

export type SemesterDetailResponse = Omit<
    SemesterResponse,
    "createdAt" | "updatedAt"
>;

export type SemesterCreatePayload = Pick<
    SemesterResponse,
    "semesterCode" | "academicYear" | "semesterNumber" | "startDate" | "endDate"
>;

export type SemesterUpdateRequest = Omit<SemesterCreatePayload, "semesterCode">;

export interface SemesterListParams {
    keyword?: string;
    status?: string;
    academicYear?: string;
    page: number;
    size: number;
    sortBy: string;
    sortDirection: "asc" | "desc";
}
