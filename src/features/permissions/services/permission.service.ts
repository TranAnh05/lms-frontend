import apiClient from "@/services/apiClient";
import type {
    Permission,
    RolePermissionDetail,
    AssignPermissionsPayload,
    ServerResponse,
} from "../types";

export const permissionService = Object.freeze({
    getRolesWithPermissions: async (): Promise<RolePermissionDetail[]> => {
        const { data } = await apiClient.get<
            unknown,
            ServerResponse<RolePermissionDetail[]>
        >("/authorizations/roles");
        return data;
    },

    getPermissions: async (): Promise<Permission[]> => {
        const { data } = await apiClient.get<
            unknown,
            ServerResponse<Permission[]>
        >("/authorizations/permissions");
        return data;
    },

    assignPermissions: async (
        payload: AssignPermissionsPayload,
    ): Promise<string> => {
        const { data } = await apiClient.put<unknown, ServerResponse<string>>(
            "/authorizations/roles/assign-permissions",
            payload,
        );
        return data;
    },
});
