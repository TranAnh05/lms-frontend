import React from "react";
import { Inbox } from "lucide-react";
import clsx from "clsx";
import { type ClassRequestResponse, type PageResponse } from "../types";

interface RequestTableProps {
    data: PageResponse<ClassRequestResponse> | null;
    isLoading: boolean;
    onPageChange: (page: number) => void;
    onViewDetail: (request: ClassRequestResponse) => void;
}

export const RequestTable: React.FC<RequestTableProps> = ({
    data,
    isLoading,
    onPageChange,
    onViewDetail,
}) => {
    const renderStatusBadge = (status: ClassRequestResponse["status"]) => {
        const baseClass =
            "inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border whitespace-nowrap";
        switch (status) {
            case "PENDING":
                return (
                    <span
                        className={`${baseClass} bg-amber-50 text-amber-700 border-amber-200`}
                    >
                        Chờ duyệt
                    </span>
                );
            case "APPROVED":
                return (
                    <span
                        className={`${baseClass} bg-emerald-50 text-emerald-700 border-emerald-200`}
                    >
                        Đã duyệt
                    </span>
                );
            case "REJECTED":
                return (
                    <span
                        className={`${baseClass} bg-rose-50 text-rose-700 border-rose-200`}
                    >
                        Từ chối
                    </span>
                );
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-12 bg-gray-50 border-b border-gray-100 w-full" />
                <div className="p-4 space-y-4">
                    {[...Array(5)].map((_, idx) => (
                        <div
                            key={idx}
                            className="grid grid-cols-6 gap-4 h-10 bg-gray-50/50 rounded items-center px-4"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (!data || data.content.length === 0) {
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

    const { content, totalPages, number: currentPage } = data;

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
                    <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                        {content.map((req) => (
                            <tr
                                key={req.id}
                                className="hover:bg-blue-50/30 transition-colors group cursor-pointer bg-white"
                                onClick={() => onViewDetail(req)}
                            >
                                <td className="py-3.5 px-5 max-w-[280px]">
                                    <p
                                        className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate"
                                        title={req.course.name}
                                    >
                                        {req.course.name}
                                    </p>
                                </td>
                                <td className="py-3.5 px-5 text-gray-600 font-medium whitespace-nowrap">
                                    {req.semester.semesterCode}
                                </td>
                                <td className="py-3.5 px-5 text-gray-600 max-w-[180px]">
                                    <p
                                        className="truncate font-medium"
                                        title={req.requester.fullName}
                                    >
                                        {req.requester.fullName}
                                    </p>
                                </td>
                                <td className="py-3.5 px-5 text-center font-semibold text-gray-900 whitespace-nowrap">
                                    {req.expectedStudents}
                                </td>
                                <td className="py-3.5 px-5 text-center">
                                    {renderStatusBadge(req.status)}
                                </td>
                                <td
                                    className="py-3.5 px-5 text-center sticky right-0 bg-white group-hover:bg-blue-50/30 transition-colors shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.03)] z-10"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
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
            {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 z-0">
                    <span className="text-xs font-medium text-gray-500">
                        Trang{" "}
                        <span className="text-gray-700 font-semibold">
                            {currentPage + 1}
                        </span>{" "}
                        trên tổng số{" "}
                        <span className="text-gray-700 font-semibold">
                            {totalPages}
                        </span>{" "}
                        trang
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
                        >
                            Trước
                        </button>
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => onPageChange(idx)}
                                className={clsx(
                                    "w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-lg transition-all focus:outline-none",
                                    currentPage === idx
                                        ? "bg-blue-600 text-white border border-blue-600 shadow-sm"
                                        : "text-gray-600 bg-white border border-gray-300 hover:bg-gray-50",
                                )}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
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
