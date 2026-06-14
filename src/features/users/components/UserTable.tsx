import React, { useState, useRef, useEffect } from "react";
import {
    Eye,
    Edit,
    Lock,
    Unlock,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { type User } from "../types";
import clsx from "clsx";

const ROLE_UI_CONFIG: Record<string, { label: string; colorClass: string }> = {
    ADMIN: {
        label: "Quản trị viên",
        colorClass: "bg-red-50 text-red-700 border-red-200",
    },
    PRINCIPAL: {
        label: "Hiệu trưởng",
        colorClass: "bg-purple-50 text-purple-700 border-purple-200",
    },
    HR: {
        label: "Phòng Nhân sự",
        colorClass: "bg-orange-50 text-orange-700 border-orange-200",
    },
    TRAINING_DEPT: {
        label: "Phòng Đào tạo",
        colorClass: "bg-blue-50 text-blue-700 border-blue-200",
    },
    HEAD_OF_DEPT: {
        label: "Trưởng khoa",
        colorClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    INSTRUCTOR: {
        label: "Giảng viên",
        colorClass: "bg-cyan-50 text-cyan-700 border-cyan-200",
    },
    STUDENT: {
        label: "Sinh viên",
        colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
};

const ActionMenu: React.FC<{
    user: User;
    index: number;
    total: number;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onToggleLock: (id: number, currentStatus: boolean) => void;
}> = ({ user, index, total, onView, onEdit, onToggleLock }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const isBottomRow = index >= total - 2 && total > 2;

    return (
        <div className="relative flex justify-center" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "p-1.5 transition-colors rounded-md focus:outline-none",
                    isOpen
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-400 hover:text-gray-800 hover:bg-gray-100",
                )}
            >
                <MoreHorizontal className="w-5 h-5" />
            </button>

            {isOpen && (
                <div
                    className={clsx(
                        "absolute right-0 w-48 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-50",
                        isBottomRow ? "bottom-full mb-1" : "top-full mt-1",
                    )}
                >
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onView(user.id);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors text-left"
                    >
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                    </button>

                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onEdit(user.id);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-600 transition-colors text-left"
                    >
                        <Edit className="w-4 h-4" />
                        Cập nhật dữ liệu
                    </button>

                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onToggleLock(user.id, user.isActive);
                        }}
                        className={clsx(
                            "w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left",
                            user.isActive
                                ? "text-rose-600 hover:bg-rose-50"
                                : "text-emerald-600 hover:bg-emerald-50", 
                        )}
                    >
                        {user.isActive && (
                            <>
                                <Lock className="w-4 h-4" /> Khóa tài khoản
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

interface UserTableProps {
    users: User[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onToggleLock: (id: number, currentStatus: boolean) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
    users,
    currentPage,
    totalPages,
    onPageChange,
    onView,
    onEdit,
    onToggleLock,
}) => {
    const getInitials = (name: string | null, username: string) => {
        if (name) return name.charAt(0).toUpperCase();
        return username.charAt(0).toUpperCase();
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="overflow-x-auto min-h-[250px]">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-4">
                                Người dùng
                            </th>
                            <th scope="col" className="px-6 py-4">
                                Liên hệ
                            </th>
                            <th scope="col" className="px-6 py-4">
                                Vai trò
                            </th>
                            <th scope="col" className="px-6 py-4">
                                Trạng thái
                            </th>
                            <th scope="col" className="px-6 py-4 text-center">
                                Hành động
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    Không tìm thấy người dùng nào khớp với bộ
                                    lọc.
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-blue-50/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {user.avatarUrl ? (
                                                <img
                                                    src={user.avatarUrl}
                                                    alt={user.username}
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border border-blue-200 shrink-0">
                                                    {getInitials(
                                                        user.fullName,
                                                        user.username,
                                                    )}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-900 leading-snug">
                                                    {user.fullName ||
                                                        "Chưa cập nhật tên"}
                                                </p>
                                                <p className="text-[11px] text-gray-500 mt-0.5 tracking-wide">
                                                    @{user.username}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <p className="text-gray-900 font-medium text-xs">
                                            {user.email}
                                        </p>
                                        <p className="text-[11px] text-gray-500 mt-0.5">
                                            {user.phone ? (
                                                user.phone
                                            ) : (
                                                <span className="italic">
                                                    Chưa có SĐT
                                                </span>
                                            )}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {user.roles &&
                                            user.roles.length > 0 ? (
                                                user.roles.map((roleCode) => {
                                                    const config =
                                                        ROLE_UI_CONFIG[
                                                            roleCode
                                                        ] || {
                                                            label: roleCode,
                                                            colorClass:
                                                                "bg-gray-100 text-gray-700 border-gray-200",
                                                        };
                                                    return (
                                                        <span
                                                            key={roleCode}
                                                            className={clsx(
                                                                "px-2 py-0.5 rounded text-[11px] font-medium border",
                                                                config.colorClass,
                                                            )}
                                                        >
                                                            {config.label}
                                                        </span>
                                                    );
                                                })
                                            ) : (
                                                <span className="text-[11px] text-gray-400 italic">
                                                    Chưa cấp quyền
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={clsx(
                                                "inline-flex items-center px-2 py-1 rounded text-[11px] font-medium border",
                                                user.isActive
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : "bg-red-50 text-red-700 border-red-200",
                                            )}
                                        >
                                            {user.isActive
                                                ? "Đang hoạt động"
                                                : "Đã khóa"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <ActionMenu
                                            user={user}
                                            index={index}
                                            total={users.length}
                                            onView={onView}
                                            onEdit={onEdit}
                                            onToggleLock={onToggleLock}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50/50">
                    <span className="text-sm text-gray-700">
                        Trang{" "}
                        <span className="font-semibold text-gray-900">
                            {currentPage + 1}
                        </span>{" "}
                        / {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="p-1.5 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                            className="p-1.5 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
