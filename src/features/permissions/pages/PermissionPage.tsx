import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { ShieldCheck, RefreshCw, Info } from "lucide-react";
import { permissionService } from "../services/permission.service";
import { type Permission, type RolePermissionDetail } from "../types";
import { PermissionMatrix } from "../components/PermissionMatrix";

export const PermissionPage: React.FC = () => {
    const [roles, setRoles] = useState<RolePermissionDetail[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [matrix, setMatrix] = useState<Record<number, Set<number>>>({});

    const fetchPageData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [rolesData, permsData] = await Promise.all([
                permissionService.getRolesWithPermissions(),
                permissionService.getPermissions(),
            ]);

            setRoles(rolesData);
            setPermissions(permsData);

            const permCodeToIdMap: Record<string, number> = {};
            permsData.forEach((p) => {
                permCodeToIdMap[p.code] = p.id;
            });

            const initialMatrix: Record<number, Set<number>> = {};
            rolesData.forEach((role) => {
                const associatedIds = (role.permissionCodes || [])
                    .map((code) => permCodeToIdMap[code])
                    .filter((id) => id !== undefined);
                initialMatrix[role.id] = new Set(associatedIds);
            });
            setMatrix(initialMatrix);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu phân quyền:", error);
            toast.error("Không thể đồng bộ dữ liệu phân quyền hệ thống.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPageData();
    }, [fetchPageData]);

    const handleCheckboxChange = useCallback(
        (roleId: number, permId: number, checked: boolean) => {
            setMatrix((prevMatrix) => {
                const updatedRoleSet = new Set(prevMatrix[roleId] || []);

                if (checked) {
                    updatedRoleSet.add(permId);
                } else {
                    updatedRoleSet.delete(permId);
                }

                return {
                    ...prevMatrix,
                    [roleId]: updatedRoleSet,
                };
            });
        },
        [],
    );

    const handleSaveRole = useCallback(
        async (roleId: number) => {
            setIsSubmitting(true);
            try {
                const currentPermIdsArray = Array.from(matrix[roleId] || []);

                await permissionService.assignPermissions({
                    roleId: roleId,
                    permissionIds: currentPermIdsArray,
                });

                const roleName =
                    roles.find((r) => r.id === roleId)?.name || `ID: ${roleId}`;
                toast.success(`Đã cập nhật quyền hạn cho vai trò: ${roleName}`);
            } catch (error) {
                console.error(error);
                toast.error(`Cập nhật cấu hình thất bại. Vui lòng thử lại.`);
            } finally {
                setIsSubmitting(false);
            }
        },
        [matrix, roles],
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50/50">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 shadow-sm"></div>
                <p className="text-sm font-medium text-blue-600 animate-pulse">
                    Đang thiết lập sơ đồ ma trận phân quyền...
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <ShieldCheck className="w-7 h-7 text-blue-600" /> Quản
                        lý Phân quyền
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Thiết lập ma trận chức năng cho các nhóm vai trò trong
                        hệ thống.
                    </p>
                </div>

                <button
                    onClick={fetchPageData}
                    className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                    <RefreshCw className="w-4 h-4" /> Làm mới dữ liệu
                </button>
            </div>

            <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-4 flex gap-3 items-start shadow-sm">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 leading-relaxed">
                    <p className="font-semibold mb-1">Hướng dẫn thiết lập:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700/90 ml-1">
                        <li>
                            Tích chọn hoặc bỏ chọn các ô vuông để gán hoặc thu
                            hồi quyền của một vai trò tương ứng.
                        </li>
                        <li>
                            Sau khi tinh chỉnh xong một cột, vui lòng nhấn nút{" "}
                            <span className="font-semibold bg-white px-1.5 py-0.5 rounded shadow-sm border border-blue-100">
                                Lưu cấu hình
                            </span>{" "}
                            nằm dưới tên của vai trò đó để hệ thống ghi nhận.
                        </li>
                        <li>
                            Các quyền được tự động gom nhóm theo Module để dễ
                            dàng quản lý.
                        </li>
                    </ul>
                </div>
            </div>

            <div className="flex-1 rounded-xl">
                <PermissionMatrix
                    roles={roles}
                    permissions={permissions}
                    matrix={matrix}
                    isSubmitting={isSubmitting}
                    onCheckboxChange={handleCheckboxChange}
                    onSaveRole={handleSaveRole}
                />
            </div>
        </div>
    );
};
