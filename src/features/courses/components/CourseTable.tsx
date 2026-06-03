import React, { useState, useRef, useEffect } from "react";
import {
    Eye,
    Edit,
    Trash2,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import clsx from "clsx";
import { type Course } from "../types";

const STATUS_UI_CONFIG: Record<string, { label: string; colorClass: string }> =
    {
        approved: {
            label: "Đang hoạt động",
            colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
        pending: {
            label: "Chờ duyệt",
            colorClass: "bg-amber-50 text-amber-700 border-amber-200",
        },
        rejected: {
            label: "Bị từ chối",
            colorClass: "bg-red-50 text-red-700 border-red-200",
        },
    };

const ActionMenu: React.FC<{
    course: Course;
    index: number;
    total: number;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number, code: string) => void;
}> = ({ course, index, total, onView, onEdit, onDelete }) => {
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
                            onView(course.id);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors text-left"
                    >
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                    </button>

                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onEdit(course.id);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-600 transition-colors text-left"
                    >
                        <Edit className="w-4 h-4" />
                        Cập nhật môn học
                    </button>

                    <div className="h-px bg-gray-100 my-1 mx-2"></div>

                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onDelete(course.id, course.code);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                        <Trash2 className="w-4 h-4" />
                        Xóa môn học
                    </button>
                </div>
            )}
        </div>
    );
};

interface CourseTableProps {
    courses: Course[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number, code: string) => void;
}

export const CourseTable: React.FC<CourseTableProps> = ({
    courses,
    currentPage,
    totalPages,
    onPageChange,
    onView,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="overflow-x-auto min-h-[250px]">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-4">
                                Mã môn
                            </th>
                            <th scope="col" className="px-6 py-4">
                                Tên môn học
                            </th>
                            <th scope="col" className="px-6 py-4">
                                Tín chỉ
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
                        {courses.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    Không tìm thấy môn học nào khớp với bộ lọc.
                                </td>
                            </tr>
                        ) : (
                            courses.map((course, index) => {
                                const statusConfig = STATUS_UI_CONFIG[
                                    course.status?.toLowerCase()
                                ] || {
                                    label: course.status || "Chưa xác định",
                                    colorClass:
                                        "bg-gray-50 text-gray-700 border-gray-200",
                                };

                                return (
                                    <tr
                                        key={course.id}
                                        className="hover:bg-blue-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                                {course.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <div className="flex items-center">
                                                    <p className="font-semibold text-gray-900 leading-snug">
                                                        {course.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">
                                                {course.credits}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={clsx(
                                                    "inline-flex items-center px-2 py-1 rounded text-[11px] font-medium border",
                                                    statusConfig.colorClass,
                                                )}
                                            >
                                                {statusConfig.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <ActionMenu
                                                course={course}
                                                index={index}
                                                total={courses.length}
                                                onView={onView}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
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
