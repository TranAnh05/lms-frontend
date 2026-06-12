export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface Course {
    id: number;
    code: string;
    name: string;
    credits: number;
    theoreticalHours: number;
    practicalHours: number;
    description: string;
    status: "pending" | "approved" | "rejected";
    rejectReason: string | null;
    lockReason: string | null;
    createdAt: string;
    deletedAt: string | null;
    updateAt: string;

    departmentId: number;
    departmentCode: string;
    departmentName: string;
}

export interface CourseFilterParams {
    keyword?: string;
    departmentId?: number | null;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
}

export interface Department {
    id: number;
    code: string;
    name: string;
    description: string | null;
    isActive: boolean;
    managerId: number | null;
    managerUsername: string | null;
    managerFullName: string | null;
}

export interface CreateCourseProposalPayload {
    departmentId: number;
    code: string;
    name: string;
    credits: number;
    theoreticalHours: number;
    practicalHours: number;
    description?: string;
}

export interface CourseProposalFilterParams {
    status?: "PENDING" | "APPROVED" | "REJECTED" | "";
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
}

export interface CourseApprovePayload {
    courseId: number;
}

export interface CourseRejectPayload {
    courseId: number;
    rejectReason: string;
}


export interface UpdateCoursePayload {
    departmentId: number;
    name: string;
    credits: number;
    theoreticalHours: number;
    practicalHours: number;
    description?: string;
}