export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface Role {
    id: number;
    code: string;
    name: string;
    description: string;
    permissionCodes: string[];
}

export interface Department {
    id: number;
    code: string;
    name: string;
    isActive: boolean;
}

export interface User {
    id: number;
    username: string;
    email: string;
    isActive: boolean;
    lockReason: string | null;
    createdAt: string;
    updatedAt: string;

    fullName: string | null;
    phone: string | null;
    birthday: string | null;
    gender: string | null;
    avatarUrl: string | null;
    address: string | null;
    roles: string[];

    departmentId?: number | null;
    departmentName?: string | null;
    majorId?: number | null;
    majorName?: string | null;
}

export interface UserFilterParams {
    keyword?: string;
    isActive?: boolean;
    roleCode?: string;
    majorId?: number | null;
    departmentId?: number | null;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
}
