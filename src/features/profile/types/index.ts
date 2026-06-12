export interface UserProfileResponse {
    id: number;
    userId: number;
    fullName: string;
    phone: string;
    birthday: string;
    gender: string;
    avatarUrl: string;
    address: string;
    role: string;

    studentCode?: string;
    cohort?: number;
    majorName?: string;

    employeeCode?: string;
    academicTitle?: string;
    specialization?: string;
    departmentName?: string;
}

export interface ChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
}