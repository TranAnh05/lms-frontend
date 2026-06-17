import React from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { type Course } from "../types";

type StatusKey = "approved" | "pending" | "rejected";

const DEFAULT_REJECT_REASON = "Không có lý do cụ thể.";

const STATUS_UI_CONFIG: Record<
    StatusKey,
    {
        label: string;
        colorClass: string;
    }
> = {
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

const PAGINATION_BUTTON_CLASS =
    "rounded-md border border-gray-300 bg-white p-1.5 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50";

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
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="min-h-[250px] overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-gray-700">
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
                                    (course.status?.toLowerCase() as StatusKey) ??
                                    "pending";

                                const statusConfig =
                                    STATUS_UI_CONFIG[statusKey] ??
                                    STATUS_UI_CONFIG.pending;

                                const isRejected = statusKey === "rejected";

                                return (
                                    <tr
                                        key={course.id}
                                        className="group transition-colors hover:bg-blue-50/50"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="rounded border border-blue-100 bg-blue-50 px-2.5 py-1 font-mono text-sm font-semibold text-blue-700">
                                                {course.code}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="font-semibold leading-snug text-gray-900">
                                                {course.name}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4 text-center font-medium text-gray-900">
                                            {course.credits}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-start gap-1.5">
                                                <span
                                                    className={clsx(
                                                        "inline-flex items-center rounded border px-2.5 py-1 text-[11px] font-medium",
                                                        statusConfig.colorClass,
                                                    )}
                                                >
                                                    {statusConfig.label}
                                                </span>

                                                {isRejected && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onViewRejectReason(
                                                                course.rejectReason ??
                                                                    DEFAULT_REJECT_REASON,
                                                            )
                                                        }
                                                        className="text-xs font-medium text-red-600 transition-all hover:text-red-700 hover:underline"
                                                    >
                                                        Xem lý do
                                                    </button>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onViewDetail(course.id)
                                                }
                                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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

            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/50 px-6 py-3">
                    <span className="text-sm text-gray-700">
                        Trang{" "}
                        <span className="font-semibold text-gray-900">
                            {currentPage + 1}
                        </span>{" "}
                        / {totalPages}
                    </span>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className={PAGINATION_BUTTON_CLASS}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <button
                            type="button"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                            className={PAGINATION_BUTTON_CLASS}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
