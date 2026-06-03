export interface SemesterResponse {
    id: number;
    semesterCode: string;
    academicYear: string;
    semesterNumber: number;
    startDate: string;
    endDate: string;
    status: "ACTIVE" | "CLOSED";
    createdAt: string;
    updatedAt: string;
}

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

export interface SemesterListParams {
    keyword?: string;
    status?: string;
    academicYear?: string;
    page: number;
    size: number;
    sortBy: string;
    sortDirection: "asc" | "desc";
}

export interface SemesterCreatePayload {
    semesterCode: string;
    academicYear: string;
    semesterNumber: number;
    startDate: string;
    endDate: string;
}
