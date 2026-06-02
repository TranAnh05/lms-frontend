export interface Permission {
    id: number;
    code: string;
    name: string;
    module: string;
    description: string;
}

export interface RolePermissionDetail {
    id: number;
    code: string;
    name: string;
    description: string;
    permissionCodes: string[];
}

export interface AssignPermissionsPayload {
    roleId: number;
    permissionIds: number[];
}
