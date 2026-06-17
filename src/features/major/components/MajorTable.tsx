import React, { useState, useRef, useEffect, memo } from "react";
import {
    Eye,
    Edit,
    Trash2,
    Lock,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { type Major } from "../types";
import clsx from "clsx";

interface ActionMenuProps {
    major: Major;
    index: number;
    total: number;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    canEdit?: boolean;
    canDelete?: boolean;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
    major,
    index,
    total,
    onView,
    onEdit,
    onDelete,
    canEdit = true,
    canDelete = true,
}) => {
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
        // Toi uu: Chi gan event listener khi menu dang mo de tiet kiem bo nho
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const isBottomRow = index === total - 1 && total > 2;

    // Toi uu: Gom chung logic xu ly hanh dong de tranh tao nhieu ham inline () => {}
    const handleAction = (actionFn: (id: number) => void, id: number) => {
        setIsOpen(false);
        actionFn(id);
    };

    return (
        <div className={clsx("relative flex justify-center", isOpen ? "z-[60]" : "z-10")} ref={menuRef}>
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
                        "absolute right-0 w-44 bg-white border border-gray-100 rounded-lg shadow-xl py-1",
                        isBottomRow ? "bottom-full mb-1" : "top-full mt-1",
                    )}
                >
                    <button
                        onClick={() => handleAction(onView, major.id)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors text-left"
                    >
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                    </button>

                    {canEdit && (
                        <button
                            onClick={() => handleAction(onEdit, major.id)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-600 transition-colors text-left"
                        >
                            <Edit className="w-4 h-4" />
                            Chỉnh sửa ngành
                        </button>
                    )}

                    {canDelete && (
                        <button
                            onClick={() => handleAction(onDelete, major.id)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                            <Trash2 className="w-4 h-4" />
                            Xóa ngành
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

interface MajorTableProps {
    majors: Major[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    canEdit?: boolean;
    canDelete?: boolean;
}

// Toi uu: Boc React.memo de ngan re-render khi cac component khac thao tac
export const MajorTable: React.FC<MajorTableProps> = memo(({
    majors,
    currentPage,
    totalPages,
    onPageChange,
    onView,
    onEdit,
    onDelete,
    canEdit = true,
    canDelete = true,
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="w-full overflow-visible min-h-[250px] pb-4">
                <table className="w-full table-fixed text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
                        <tr>
                            <th scope="col" className="w-[15%] px-6 py-4">Mã ngành</th>
                            <th scope="col" className="w-[30%] px-6 py-4">Tên ngành</th>
                            <th scope="col" className="w-[15%] px-6 py-4 text-center">Tín chỉ</th>
                            <th scope="col" className="w-[20%] px-6 py-4">Trạng thái</th>
                            <th scope="col" className="w-[20%] px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {majors.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    Không tìm thấy ngành học nào khớp với bộ lọc.
                                </td>
                            </tr>
                        ) : (
                            majors.map((major, index) => (
                                <tr key={major.id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-mono border border-gray-200">
                                            {major.code}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {major.name}
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {major.departmentName}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        {major.requiredMinimumCredits}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <span
                                                className={clsx(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                                                    major.isActive
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                                )}
                                            >
                                                <span
                                                    className={clsx(
                                                        "h-1.5 w-1.5 rounded-full",
                                                        major.isActive ? "bg-emerald-500" : "bg-amber-500"
                                                    )}
                                                ></span>
                                                {major.isActive ? "Hoạt động" : "Tạm khóa"}
                                                {!major.isActive && (
                                                    <Lock className="w-3 h-3 ml-0.5 opacity-70" />
                                                )}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <ActionMenu
                                            major={major}
                                            index={index}
                                            total={majors.length}
                                            onView={onView}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                            canEdit={canEdit}
                                            canDelete={canDelete}
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
                        Trang <span className="font-semibold text-gray-900">{currentPage + 1}</span> / {totalPages}
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
});

MajorTable.displayName = "MajorTable";