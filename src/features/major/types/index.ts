export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
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

export interface Major {
    id: number;
    code: string;
    name: string;
    requiredMinimumCredits: number;
    description: string | null;
    isActive: boolean;
    lockReason: string | null;
    departmentId: number;
    departmentCode: string;
    departmentName: string;
}

export interface MajorFilterParams {
    keyword?: string;
    isActive?: boolean;
    departmentId?: number | null;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
}

export interface CreateMajorInput {
    code: string;
    name: string;
    requiredMinimumCredits: number;
    departmentId: number;
    description: string | null;
}
