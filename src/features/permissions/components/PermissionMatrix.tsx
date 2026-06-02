import React, { useMemo } from "react";
import { Save, Layers, ShieldAlert, Check } from "lucide-react";
import clsx from "clsx";
import { type Permission, type RolePermissionDetail } from "../types";

const MODULE_LABELS: Record<string, string> = {
    USER_MGT: "Quản lý người dùng",
    MAJOR_MGT: "Quản lý ngành học",
    COURSE_MGT: "Quản lý học phần",
    CLASS_MGT: "Quản lý lớp học phần",
    PROFILE_MGT: "Hồ sơ cá nhân",
    PUBLIC_VIEW: "Tra cứu công khai",
    ENROLLMENT_MGT: "Đăng ký học phần",
    SCHEDULE_MGT: "Thời khóa biểu",
    LESSON_MGT: "Quản lý bài học",
    EXAM_MGT: "Quản lý bài kiểm tra",
    EXAM_TAKE: "Làm bài kiểm tra",
    GRADE_VIEW: "Tra cứu điểm số",
    SEMESTER_MGT: "Quản lý học kỳ",
    GRADE_MGT: "Quản lý điểm số",
};

interface PermissionMatrixProps {
    roles: RolePermissionDetail[];
    permissions: Permission[];
    matrix: Record<number, Set<number>>;
    isSubmitting: boolean;
    onCheckboxChange: (
        roleId: number,
        permId: number,
        checked: boolean,
    ) => void;
    onSaveRole: (roleId: number) => void;
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
    roles,
    permissions,
    matrix,
    isSubmitting,
    onCheckboxChange,
    onSaveRole,
}) => {
    const groupedPermissions = useMemo(() => {
        return permissions.reduce<Record<string, Permission[]>>((acc, perm) => {
            const moduleName = perm.module || "HỆ THỐNG CHUNG";
            if (!acc[moduleName]) {
                acc[moduleName] = [];
            }
            acc[moduleName].push(perm);
            return acc;
        }, {});
    }, [permissions]);

    if (!roles.length || !permissions.length) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-white border border-gray-200 rounded-xl">
                <ShieldAlert className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">
                    Chưa có dữ liệu phân quyền để hiển thị.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden relative">
            <div className="overflow-auto max-h-[calc(100vh-280px)] custom-scrollbar">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="sticky top-0 z-30 bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold text-xs uppercase shadow-[0_2px_4px_-2px_rgba(0,0,0,0.1)]">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-4 min-w-[250px] max-w-[300px] sticky left-0 top-0 z-40 bg-gray-50 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                            >
                                Chức năng / Quyền chi tiết
                            </th>
                            {roles.map((role) => (
                                <th
                                    key={role.id}
                                    scope="col"
                                    className="px-4 py-4 text-center min-w-[160px] border-l border-gray-100 bg-gray-50 align-top"
                                >
                                    <div className="flex flex-col h-full justify-between items-center gap-3">
                                        <div>
                                            <p className="text-gray-900 font-bold text-sm tracking-tight">
                                                {role.name}
                                            </p>
                                        </div>
                                        <button
                                            disabled={isSubmitting}
                                            onClick={() => onSaveRole(role.id)}
                                            className="mt-1 flex items-center justify-center gap-1.5 w-full px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                                            title={`Lưu quyền cho ${role.name}`}
                                        >
                                            <Save className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                            Lưu cấu hình
                                        </button>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {Object.entries(groupedPermissions).map(
                            ([moduleCode, permList]) => {
                                const moduleDisplayName =
                                    MODULE_LABELS[moduleCode] || moduleCode;

                                return (
                                    <React.Fragment key={moduleCode}>
                                        <tr className="bg-slate-100/80">
                                            <td className="px-6 py-3 font-bold text-slate-700 text-xs tracking-widest uppercase sticky left-0 z-10 bg-slate-100/90 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                                <div className="flex items-center gap-2">
                                                    <Layers className="w-4 h-4 text-slate-500" />
                                                    {moduleDisplayName}
                                                </div>
                                            </td>
                                            <td
                                                colSpan={roles.length}
                                                className="bg-slate-100/80 border-t border-b border-slate-200/60"
                                            ></td>
                                        </tr>

                                        {permList.map((perm) => (
                                            <tr
                                                key={perm.id}
                                                className="hover:bg-blue-50/40 transition-colors group"
                                            >
                                                <td className="px-6 py-4 sticky left-0 z-10 bg-white group-hover:bg-blue-50/40 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] transition-colors whitespace-normal">
                                                    <p className="font-semibold text-gray-800 text-sm leading-snug">
                                                        {perm.name}
                                                    </p>
                                                </td>

                                                {roles.map((role) => {
                                                    const isChecked =
                                                        matrix[role.id]?.has(
                                                            perm.id,
                                                        ) || false;
                                                    return (
                                                        <td
                                                            key={`${role.id}-${perm.id}`}
                                                            className="px-4 py-4 text-center border-l border-gray-100/50 align-middle"
                                                        >
                                                            <label className="relative flex items-center justify-center p-2 rounded-full cursor-pointer hover:bg-blue-100/50 transition-colors group/checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        isChecked
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        onCheckboxChange(
                                                                            role.id,
                                                                            perm.id,
                                                                            e
                                                                                .target
                                                                                .checked,
                                                                        )
                                                                    } 
                                                                    className="peer sr-only"
                                                                />
                                                                <div
                                                                    className={clsx(
                                                                        "w-5 h-5 rounded border-2 transition-all flex items-center justify-center",
                                                                        isChecked
                                                                            ? "bg-blue-600 border-blue-600 shadow-sm shadow-blue-500/30 scale-110"
                                                                            : "bg-white border-gray-300 peer-focus:border-blue-400 group-hover/checkbox:border-blue-400",
                                                                    )}
                                                                >
                                                                    <Check
                                                                        className={clsx(
                                                                            "w-3.5 h-3.5 text-white transition-transform duration-200",
                                                                            isChecked
                                                                                ? "scale-100"
                                                                                : "scale-0",
                                                                        )}
                                                                    />
                                                                </div>
                                                            </label>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                );
                            },
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
