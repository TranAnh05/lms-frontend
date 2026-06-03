import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { type Course } from "../types";

const STATUS_UI_CONFIG: Record<string, { label: string; colorClass: string }> =
    {
        approved: {
            label: "Đã duyệt",
            colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
        pending: {
            label: "Đang chờ duyệt",
            colorClass: "bg-amber-50 text-amber-700 border-amber-200",
        },
        rejected: {
            label: "Bị từ chối",
            colorClass: "bg-red-50 text-red-700 border-red-200",
        },
    };

interface CourseProposalTableProps {
    courses: Course[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onViewDetail: (id: number) => void;
    onViewRejectReason: (reason: string) => void;
}

export const CourseProposalTable: React.FC<CourseProposalTableProps> = ({
    courses,
    currentPage,
    totalPages,
    onPageChange,
    onViewDetail,
    onViewRejectReason,
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="overflow-x-auto min-h-[250px]">
                <table className="w-full text-left text-sm text-gray-600">
                    {/* HEADER */}
                    <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-4">
                                Mã môn
                            </th>
                            <th scope="col" className="px-6 py-4">
                                Tên môn học
                            </th>
                            <th scope="col" className="px-6 py-4 text-center">
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

                    {/* BODY */}
                    <tbody className="divide-y divide-gray-100">
                        {courses.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    Không tìm thấy đề xuất môn học nào.
                                </td>
                            </tr>
                        ) : (
                            courses.map((course) => {
                                const statusKey =
                                    course.status?.toLowerCase() || "pending";
                                const statusConfig =
                                    STATUS_UI_CONFIG[statusKey] ||
                                    STATUS_UI_CONFIG.pending;
                                const isRejected = statusKey === "rejected";

                                return (
                                    <tr
                                        key={course.id}
                                        className="hover:bg-blue-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                                                {course.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <div>
                                                    <p className="font-semibold text-gray-900 leading-snug">
                                                        {course.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium text-gray-900">
                                            {course.credits}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-start gap-1.5">
                                                <span
                                                    className={clsx(
                                                        "inline-flex items-center px-2.5 py-1 rounded text-[11px] font-medium border",
                                                        statusConfig.colorClass,
                                                    )}
                                                >
                                                    {statusConfig.label}
                                                </span>

                                                {isRejected && (
                                                    <button
                                                        onClick={() =>
                                                            onViewRejectReason(
                                                                course.rejectReason ||
                                                                    "Không có lý do cụ thể.",
                                                            )
                                                        }
                                                        className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 hover:underline transition-all focus:outline-none"
                                                    >
                                                        Xem lý do
                                                    </button>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() =>
                                                    onViewDetail(course.id)
                                                }
                                                className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* PHÂN TRANG */}
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
