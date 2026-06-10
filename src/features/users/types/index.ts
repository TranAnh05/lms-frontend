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

    employeeCode?: string | null;
    academicTitle?: string | null;
    specialization?: string | null;
    isVisiting?: boolean | null;
    hireDate?: string | null;
    departmentId?: number | null;
    departmentName?: string | null;

    studentCode?: string | null;
    cohort?: number | null;
    studentStatus?: string | null; 
    majorId?: number | null;
    majorName?: string | null;
    majorCode?: string | null;
    advisorId?: number | null;
    advisorName?: string | null;
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

export interface CreateUserPayload {
    username: string;
    password?: string;
    email: string;
    fullName: string;
    roleIds: number[];
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}


export interface DropdownOption {
    id: number;
    name: string;
}

export interface UpdateUserPayload {
    // === CHUNG ===
    phone?: string | null;
    birthday?: string | null;
    gender?: string | null; 
    address?: string | null;

    // === GIẢNG VIÊN ===
    employeeCode?: string | null;
    departmentId?: number | null;
    academicTitle?: string | null;
    specialization?: string | null;
    isVisiting?: boolean | null;

    // === SINH VIÊN ===
    studentCode?: string | null;
    cohort?: number | null;
    majorId?: number | null;
}