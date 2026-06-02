import apiClient from "@/services/apiClient";
import {
    type Permission,
    type RolePermissionDetail,
    type AssignPermissionsPayload,
} from "../types";

interface ServerResponse<T> {
    code: number;
    message: string;
    data: T;
}

export const permissionService = {
    getRolesWithPermissions: async (): Promise<RolePermissionDetail[]> => {
        const response = (await apiClient.get(
            "/authorizations/roles",
        )) as ServerResponse<RolePermissionDetail[]>;
        return response.data;
    },

    getPermissions: async (): Promise<Permission[]> => {
        const response = (await apiClient.get(
            "/authorizations/permissions",
        )) as ServerResponse<Permission[]>;
        return response.data;
    },

    assignPermissions: async (
        payload: AssignPermissionsPayload,
    ): Promise<string> => {
        const response = (await apiClient.put(
            "/authorizations/roles/assign-permissions",
            payload,
        )) as ServerResponse<string>;
        return response.data;
    },
};
