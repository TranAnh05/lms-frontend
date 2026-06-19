import React from "react";
import { Inbox } from "lucide-react";
import clsx from "clsx";
import type { ClassOpeningResponseDto, PageResponse } from "../types";

interface RequestTableProps {
    data: PageResponse<ClassOpeningResponseDto> | null;
    isLoading: boolean;
    currentPage: number;
    onPageChange: (page: number) => void;
    onViewDetail: (request: ClassOpeningResponseDto) => void;
}

// Định nghĩa cấu hình kiểu dáng Badge cố định ngoài component
const BASE_BADGE_CLASS =
    "inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border whitespace-nowrap";

const STATUS_BADGE_MAP: Record<
    ClassOpeningResponseDto["status"],
    React.ReactNode
> = {
    PENDING: (
        <span
            className={`${BASE_BADGE_CLASS} bg-amber-50 text-amber-700 border-amber-200`}
        >
            Chờ duyệt
        </span>
    ),
    APPROVED: (
        <span
            className={`${BASE_BADGE_CLASS} bg-emerald-50 text-emerald-700 border-emerald-200`}
        >
            Đã duyệt
        </span>
    ),
    REJECTED: (
        <span
            className={`${BASE_BADGE_CLASS} bg-rose-50 text-rose-700 border-rose-200`}
        >
            Từ chối
        </span>
    ),
};

export const RequestTable: React.FC<RequestTableProps> = ({
    data,
    isLoading,
    currentPage,
    onPageChange,
    onViewDetail,
}) => {
    // Trạng thái hiển thị Skeleton khi đang tải dữ liệu lần đầu
    if (isLoading && (!data || !data.content || data.content.length === 0)) {
        return (
            <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-12 bg-gray-50 border-b border-gray-100 w-full" />
                <div className="p-4 space-y-4">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="grid grid-cols-6 gap-4 h-10 bg-gray-50/50 rounded items-center px-4"
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Trạng thái hiển thị khi danh sách trống
    if (!data || !data.content || data.content.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-14 px-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                <div className="p-4 bg-gray-50 text-gray-400 rounded-full mb-4">
                    <Inbox className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                    Không có đề xuất nào
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm text-center">
                    Hiện tại chưa có đề xuất mở lớp nào khớp với tiêu chí tìm
                    kiếm hoặc bộ lọc được chọn.
                </p>
            </div>
        );
    }

    const {
        content = [],
        totalPages = 0,
        totalElements = 0,
        size = 0,
        number,
    } = data;
    const current = number !== undefined ? number : currentPage;

    return (
        <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col relative z-0">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <th className="py-3.5 px-5 w-[35%] whitespace-nowrap">
                                Môn học
                            </th>
                            <th className="py-3.5 px-5 w-[15%] whitespace-nowrap">
                                Học kỳ
                            </th>
                            <th className="py-3.5 px-5 w-[20%] whitespace-nowrap">
                                Người đề xuất
                            </th>
                            <th className="py-3.5 px-5 w-[10%] text-center whitespace-nowrap">
                                SV Dự kiến
                            </th>
                            <th className="py-3.5 px-5 w-[10%] text-center whitespace-nowrap">
                                Trạng thái
                            </th>
                            <th className="py-3.5 px-5 w-[10%] text-center whitespace-nowrap sticky right-0 bg-gray-50 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.03)] z-10">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm text-gray-700 relative">
                        {/* Lớp phủ mờ hiệu ứng khi đang làm mới dữ liệu */}
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10" />
                        )}

                        {content.map((req) => (
                            <tr
                                key={req.requestId}
                                className="hover:bg-blue-50/30 transition-colors group cursor-pointer bg-white"
                                onClick={() => onViewDetail(req)}
                            >
                                <td className="py-3.5 px-5 max-w-[280px]">
                                    <p
                                        className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate"
                                        title={req.courseName}
                                    >
                                        {req.courseName || "N/A"}
                                    </p>
                                </td>
                                <td className="py-3.5 px-5 text-gray-600 font-medium whitespace-nowrap">
                                    {req.semesterCode || "N/A"}
                                </td>
                                <td className="py-3.5 px-5 text-gray-600 max-w-[180px]">
                                    <p
                                        className="truncate font-medium"
                                        title={req.requesterName}
                                    >
                                        {req.requesterName || "N/A"}
                                    </p>
                                </td>
                                <td className="py-3.5 px-5 text-center font-semibold text-gray-900 whitespace-nowrap">
                                    {req.expectedStudents}
                                </td>
                                <td className="py-3.5 px-5 text-center">
                                    {STATUS_BADGE_MAP[req.status] || null}
                                </td>
                                <td
                                    className="py-3.5 px-5 text-center sticky right-0 bg-white group-hover:bg-blue-50/30 transition-colors shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.03)] z-10"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        type="button"
                                        onClick={() => onViewDetail(req)}
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap focus:outline-none"
                                    >
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Thanh điều hướng phân trang dữ liệu */}
            {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs font-medium text-gray-500">
                        Hiển thị{" "}
                        <span className="font-semibold text-gray-700">
                            {current * size + 1}
                        </span>{" "}
                        -{" "}
                        <span className="font-semibold text-gray-700">
                            {Math.min((current + 1) * size, totalElements)}
                        </span>{" "}
                        trong tổng số{" "}
                        <span className="font-semibold text-gray-700">
                            {totalElements}
                        </span>{" "}
                        đề xuất
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onPageChange(current - 1)}
                            disabled={current === 0 || isLoading}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
                        >
                            Trước
                        </button>

                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => onPageChange(idx)}
                                disabled={isLoading}
                                className={clsx(
                                    "w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-lg transition-all focus:outline-none",
                                    current === idx
                                        ? "bg-blue-600 text-white border border-blue-600 shadow-sm"
                                        : "text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50",
                                )}
                            >
                                {idx + 1}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => onPageChange(current + 1)}
                            disabled={current >= totalPages - 1 || isLoading}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
