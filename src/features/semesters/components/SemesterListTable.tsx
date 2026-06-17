import React, { useState, useRef, useEffect, memo } from "react";
import { Eye, Edit3, Lock, ShieldAlert, MoreHorizontal } from "lucide-react";
import clsx from "clsx";
import { type SemesterResponse, type PageResponse } from "../types";

interface ActionMenuProps {
    semester: SemesterResponse;
    index: number;
    total: number;
    onViewDetail: (id: number) => void;
    onUpdate: (id: number) => void;
    onToggleStatus: (semester: SemesterResponse) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
    semester,
    index,
    total,
    onViewDetail,
    onUpdate,
    onToggleStatus,
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
        // Toi uu: Chi dang ky su kien lang nghe khi menu dang mo
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const isBottomRow = total > 1 && index === total - 1;

    // Toi uu: Gom chung logic xu ly de tranh tao nhieu ham inline
    const handleAction = (actionFn: (id: number) => void, id: number) => {
        setIsOpen(false);
        actionFn(id);
    };

    return (
        <div
            className="relative inline-block text-left w-10 h-8 mx-auto"
            ref={menuRef}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "p-1.5 transition-colors rounded-md focus:outline-none w-full h-full flex items-center justify-center",
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
                        "absolute right-0 w-48 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-[100]",
                        isBottomRow ? "bottom-full mb-1" : "top-full mt-1",
                    )}
                >
                    <button
                        onClick={() => handleAction(onViewDetail, semester.id)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors text-left"
                    >
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                    </button>

                    <button
                        onClick={() => handleAction(onUpdate, semester.id)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-600 transition-colors text-left"
                    >
                        <Edit3 className="w-4 h-4" />
                        Chỉnh sửa học kỳ
                    </button>

                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onToggleStatus(semester);
                        }}
                        className={clsx(
                            "w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left",
                            semester.status === "ACTIVE"
                                ? "text-red-600 hover:bg-red-50"
                                : "text-green-600 hover:bg-green-50",
                        )}
                    >
                        {semester.status === "ACTIVE" && (
                            <>
                                <Lock className="w-4 h-4" /> Đóng học kỳ
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

interface SemesterListTableProps {
    data: PageResponse<SemesterResponse> | null;
    isLoading: boolean;
    onViewDetail: (id: number) => void;
    onUpdate: (id: number) => void;
    onToggleStatus: (semester: SemesterResponse) => void;
    onPageChange: (page: number) => void;
}

// Toi uu: Dua hang so va ham ho tro ra khoi vong render
const SKELETON_ROWS = Array(5).fill(0);

const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
};

// Toi uu: Su dung React.memo de chan re-render tu component cha
export const SemesterListTable: React.FC<SemesterListTableProps> = memo(
    ({
        data,
        isLoading,
        onViewDetail,
        onUpdate,
        onToggleStatus,
        onPageChange,
    }) => {
        const content = data?.content || [];
        const totalPages = data?.totalPages || 0;
        const currentPage = data?.number || 0;
        const totalElements = data?.totalElements || 0;
        const pageSize = data?.size || 10;
        const isEmpty = content.length === 0;

        return (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-full flex flex-col">
                <div className="overflow-x-auto overflow-y-visible custom-scrollbar min-h-[280px] pb-4">
                    <table className="w-full text-sm text-left text-gray-500 table-fixed min-w-[900px]">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50/70 border-b border-gray-100 font-bold">
                            <tr>
                                <th scope="col" className="px-6 py-4 w-[16%]">
                                    Mã học kỳ
                                </th>
                                <th scope="col" className="px-6 py-4 w-[16%]">
                                    Năm học
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-center w-[12%]"
                                >
                                    Kỳ thứ
                                </th>
                                <th scope="col" className="px-6 py-4 w-[28%]">
                                    Thời gian diễn ra
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-center w-[14%]"
                                >
                                    Trạng thái
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-center w-[100px]"
                                >
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                SKELETON_ROWS.map((_, index) => (
                                    <tr
                                        key={index}
                                        className="animate-pulse bg-white"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-6 bg-gray-200 rounded-full w-20 mx-auto"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-8 bg-gray-200 rounded-lg w-10 mx-auto"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : isEmpty ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center bg-white"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                                            <ShieldAlert className="w-8 h-8 text-gray-300" />
                                            <span className="text-sm">
                                                Không tìm thấy dữ liệu học kỳ
                                                phù hợp.
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                content.map((semester, index) => (
                                    <tr
                                        key={semester.id}
                                        className="hover:bg-blue-50/20 bg-white transition-colors"
                                    >
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {semester.semesterCode}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {semester.academicYear}
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium text-gray-700">
                                            Kỳ {semester.semesterNumber}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                                                <span>
                                                    {formatDate(
                                                        semester.startDate,
                                                    )}
                                                </span>
                                                <span className="text-gray-300">
                                                    →
                                                </span>
                                                <span>
                                                    {formatDate(
                                                        semester.endDate,
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={clsx(
                                                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide",
                                                    semester.status === "ACTIVE"
                                                        ? "bg-green-50 text-green-700 border border-green-200"
                                                        : "bg-gray-100 text-gray-600 border border-gray-200",
                                                )}
                                            >
                                                {semester.status === "ACTIVE"
                                                    ? "Đang mở"
                                                    : "Đã đóng"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center w-[100px]">
                                            <ActionMenu
                                                semester={semester}
                                                index={index}
                                                total={content.length}
                                                onViewDetail={onViewDetail}
                                                onUpdate={onUpdate}
                                                onToggleStatus={onToggleStatus}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border-t border-gray-100 text-sm">
                        <span className="text-gray-500">
                            Hiển thị hàng{" "}
                            <span className="font-semibold text-gray-900">
                                {currentPage * pageSize + 1}
                            </span>{" "}
                            đến{" "}
                            <span className="font-semibold text-gray-900">
                                {Math.min(
                                    (currentPage + 1) * pageSize,
                                    totalElements,
                                )}
                            </span>{" "}
                            trong tổng số{" "}
                            <span className="font-semibold text-gray-900">
                                {totalElements}
                            </span>{" "}
                            học kỳ
                        </span>

                        <div className="inline-flex items-center -space-x-px gap-1">
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 0 || isLoading}
                                className="px-3 py-1.5 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Trước
                            </button>

                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => onPageChange(i)}
                                    disabled={isLoading}
                                    className={clsx(
                                        "px-3 py-1.5 leading-tight border transition-colors",
                                        currentPage === i
                                            ? "z-10 text-blue-600 bg-blue-50 border-blue-300 font-medium"
                                            : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700",
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={
                                    currentPage === totalPages - 1 || isLoading
                                }
                                className="px-3 py-1.5 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    },
);

SemesterListTable.displayName = "SemesterListTable";
