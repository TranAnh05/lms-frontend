import React, { useState, useRef, useEffect } from "react";
import { Eye, MoreHorizontal, ShieldAlert, UserPlus } from "lucide-react";
import clsx from "clsx";
import { type ClassResponse, type PageResponse } from "../types";

const STATUS_UI_CONFIG: Record<string, { label: string; style: string }> = {
    PENDING: {
        label: "Lên kế hoạch",
        style: "bg-gray-100 text-gray-700 border-gray-200",
    },
    REGISTRATION: {
        label: "Mở đăng ký",
        style: "bg-purple-50 text-purple-700 border-purple-200",
    },
    ONGOING: {
        label: "Đang diễn ra",
        style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    COMPLETED: {
        label: "Đã kết thúc",
        style: "bg-blue-50 text-blue-700 border-blue-200",
    },
    CANCELED: {
        label: "Đã hủy",
        style: "bg-red-50 text-red-700 border-red-200",
    },
};

const ActionMenu: React.FC<{
    classItem: ClassResponse;
    index: number;
    total: number;
    onViewDetail: (id: number) => void;
    onAssignLecturer: (id: number) => void;
}> = ({ classItem, index, total, onViewDetail, onAssignLecturer }) => {
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
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const isBottomRow = index >= total - 2 && total > 3;

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
                        "absolute right-6 w-48 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-[60]",
                        isBottomRow ? "bottom-0 mb-1" : "top-0 mt-1",
                    )}
                >
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onViewDetail(classItem.id);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors text-left"
                    >
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                    </button>

                    {/* Chỉ hiển thị nút phân công giảng viên nếu lớp chưa kết thúc/hủy */}
                    {classItem.status !== "COMPLETED" &&
                        classItem.status !== "CANCELED" && (
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    onAssignLecturer(classItem.id);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-600 transition-colors text-left"
                            >
                                <UserPlus className="w-4 h-4" />
                                Phân công
                            </button>
                        )}
                </div>
            )}
        </div>
    );
};

interface ClassTableProps {
    data: PageResponse<ClassResponse> | null;
    isLoading: boolean;
    onViewDetail: (id: number) => void;
    onAssignLecturer: (id: number) => void;
    onPageChange: (page: number) => void;
}

export const ClassTable: React.FC<ClassTableProps> = ({
    data,
    isLoading,
    onViewDetail,
    onAssignLecturer,
    onPageChange,
}) => {
    const skeletonRows = Array(5).fill(0);

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-full flex flex-col relative z-0">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm text-left text-gray-500 table-auto min-w-[800px]">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50/70 border-b border-gray-100 font-bold">
                        <tr>
                            <th scope="col" className="px-5 py-4 w-[12%]">
                                Mã lớp
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-4 w-[28%] max-w-[250px]"
                            >
                                Môn học
                            </th>
                            <th scope="col" className="px-5 py-4 w-[12%]">
                                Học kỳ
                            </th>
                            <th scope="col" className="px-5 py-4 w-[18%]">
                                Giảng viên
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-4 text-center w-[10%]"
                            >
                                Sĩ số
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-4 text-center w-[12%]"
                            >
                                Trạng thái
                            </th>

                            <th
                                scope="col"
                                className="px-3 py-4 text-center w-[8%] sticky right-0 bg-gray-50/70 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.02)] z-10"
                            >
                                Tác vụ
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            skeletonRows.map((_, index) => (
                                <tr
                                    key={index}
                                    className="animate-pulse bg-white"
                                >
                                    <td className="px-5 py-4">
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    </td>
                                    <td className="px-5 py-4 max-w-[250px]">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="h-6 bg-gray-200 rounded-full w-24 mx-auto"></div>
                                    </td>
                                    <td className="px-5 py-4 sticky right-0 bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.02)]">
                                        <div className="h-8 bg-gray-200 rounded-lg w-8 mx-auto"></div>
                                    </td>
                                </tr>
                            ))
                        ) : !data || data.content.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-6 py-12 text-center bg-white"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                                        <ShieldAlert className="w-10 h-10 text-gray-300 mb-1" />
                                        <span className="text-base font-medium text-gray-600">
                                            Không có lớp học phần nào
                                        </span>
                                        <span className="text-sm">
                                            Vui lòng thay đổi bộ lọc hoặc thêm
                                            mới lớp học phần.
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.content.map((classItem, index) => {
                                const isFull =
                                    classItem.currentStudents >=
                                    classItem.maxStudents;
                                const statusUI =
                                    STATUS_UI_CONFIG[classItem.status];

                                return (
                                    <tr
                                        key={classItem.id}
                                        className="hover:bg-blue-50/30 bg-white transition-colors group"
                                    >
                                        <td className="px-5 py-4">
                                            <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded border border-gray-200 font-mono text-xs whitespace-nowrap">
                                                {classItem.code}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 max-w-[250px]">
                                            <p
                                                className="font-medium text-gray-900 truncate"
                                                title={classItem.course.name}
                                            >
                                                {classItem.course.name}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 font-medium whitespace-nowrap">
                                            {classItem.semester.semesterCode}
                                        </td>
                                        <td className="px-5 py-4">
                                            {classItem.lecturer ? (
                                                <span
                                                    className="text-gray-900 font-medium truncate block"
                                                    title={
                                                        classItem.lecturer
                                                            .fullName
                                                    }
                                                >
                                                    {
                                                        classItem.lecturer
                                                            .fullName
                                                    }
                                                </span>
                                            ) : (
                                                <span className="inline-block text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 whitespace-nowrap">
                                                    Chưa phân công
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-center whitespace-nowrap">
                                            <span
                                                className={clsx(
                                                    "font-semibold",
                                                    isFull
                                                        ? "text-red-600"
                                                        : "text-gray-900",
                                                )}
                                            >
                                                {classItem.currentStudents}
                                            </span>
                                            <span className="text-gray-400 text-xs mx-1">
                                                /
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                {classItem.maxStudents}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center whitespace-nowrap">
                                            <span
                                                className={clsx(
                                                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border",
                                                    statusUI?.style ||
                                                        "bg-gray-100 text-gray-700 border-gray-200",
                                                )}
                                            >
                                                {statusUI?.label ||
                                                    classItem.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center sticky right-0 bg-white group-hover:bg-blue-50/30 transition-colors shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.02)] z-10">
                                            <ActionMenu
                                                classItem={classItem}
                                                index={index}
                                                total={data.content.length}
                                                onViewDetail={onViewDetail}
                                                onAssignLecturer={
                                                    onAssignLecturer
                                                }
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border-t border-gray-100 text-sm z-0">
                    <span className="text-gray-500">
                        Hiển thị{" "}
                        <span className="font-semibold text-gray-900">
                            {data.number * data.size + 1}
                        </span>{" "}
                        đến{" "}
                        <span className="font-semibold text-gray-900">
                            {Math.min(
                                (data.number + 1) * data.size,
                                data.totalElements,
                            )}
                        </span>{" "}
                        trong tổng{" "}
                        <span className="font-semibold text-gray-900">
                            {data.totalElements}
                        </span>{" "}
                        lớp
                    </span>

                    <div className="inline-flex items-center -space-x-px gap-1">
                        <button
                            onClick={() => onPageChange(data.number - 1)}
                            disabled={data.number === 0 || isLoading}
                            className="px-3 py-1.5 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Trước
                        </button>

                        {Array.from({ length: data.totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => onPageChange(i)}
                                disabled={isLoading}
                                className={clsx(
                                    "px-3 py-1.5 leading-tight border transition-colors",
                                    data.number === i
                                        ? "z-10 text-blue-600 bg-blue-50 border-blue-300 font-medium"
                                        : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700",
                                )}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => onPageChange(data.number + 1)}
                            disabled={
                                data.number === data.totalPages - 1 || isLoading
                            }
                            className="px-3 py-1.5 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
