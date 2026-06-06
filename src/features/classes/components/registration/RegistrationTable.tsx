import React from "react";
import { ShieldAlert } from "lucide-react";
import clsx from "clsx";
import { type PageResponse } from "../../types";
import { type RegistrationPeriodResponse } from "../../types/registration.types";

interface RegistrationTableProps {
    data: PageResponse<RegistrationPeriodResponse> | null;
    isLoading: boolean;
    onPageChange: (page: number) => void;
    onViewDetail: (id: number) => void;
}

const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const STATUS_UI_CONFIG: Record<string, { label: string; style: string }> = {
    PENDING: {
        label: "Sắp diễn ra",
        style: "bg-amber-50 text-amber-700 border-amber-200",
    },
    ACTIVE: {
        label: "Đang mở",
        style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    CLOSED: {
        label: "Đã đóng",
        style: "bg-gray-100 text-gray-700 border-gray-200",
    },
};

export const RegistrationTable: React.FC<RegistrationTableProps> = ({
    data,
    isLoading,
    onPageChange,
    onViewDetail,
}) => {
    const skeletonRows = Array(5).fill(0);

    return (
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative z-0">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm text-left text-gray-500 table-auto min-w-[900px]">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50/80 border-b border-gray-100 font-bold">
                        <tr>
                            <th scope="col" className="px-5 py-4 w-[30%]">
                                Tên Đợt đăng ký
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-4 w-[15%] whitespace-nowrap"
                            >
                                Học kỳ
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-4 w-[15%] whitespace-nowrap"
                            >
                                Loại đợt
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-4 w-[20%] whitespace-nowrap"
                            >
                                Thời gian áp dụng
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-4 w-[10%] text-center whitespace-nowrap"
                            >
                                Trạng thái
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-4 text-center w-[10%] sticky right-0 bg-gray-50/80 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.02)] z-10 whitespace-nowrap"
                            >
                                Thao tác
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
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="h-6 bg-gray-200 rounded-full w-24 mx-auto"></div>
                                    </td>
                                    <td className="px-5 py-4 sticky right-0 bg-white">
                                        <div className="h-8 bg-gray-200 rounded-lg w-20 mx-auto"></div>
                                    </td>
                                </tr>
                            ))
                        ) : !data || data.content.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-16 text-center bg-white"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                                        <ShieldAlert className="w-12 h-12 text-gray-300 mb-2" />
                                        <span className="text-base font-semibold text-gray-600">
                                            Không tìm thấy đợt đăng ký nào
                                        </span>
                                        <span className="text-sm">
                                            Vui lòng thay đổi bộ lọc hoặc tạo
                                            mới đợt đăng ký.
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.content.map((period) => {
                                const statusUI = STATUS_UI_CONFIG[
                                    period.status
                                ] || {
                                    label: period.status,
                                    style: "bg-gray-100 text-gray-700",
                                };
                                return (
                                    <tr
                                        key={period.id}
                                        className="hover:bg-blue-50/40 bg-white transition-colors group"
                                    >
                                        <td className="px-5 py-4">
                                            <p
                                                className="font-bold text-gray-900 leading-tight truncate max-w-[280px]"
                                                title={period.name}
                                            >
                                                {period.name}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <span className="font-medium text-gray-700 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
                                                {period.semester
                                                    ?.semesterCode ||
                                                    "Đang cập nhật"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-600">
                                                {period.type === "NORMAL"
                                                    ? "Chính thức"
                                                    : "Bổ sung"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1.5 text-xs text-gray-600 font-medium">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                                                    Mở:{" "}
                                                    {formatDateTime(
                                                        period.startTime,
                                                    )}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>{" "}
                                                    Đóng:{" "}
                                                    {formatDateTime(
                                                        period.endTime,
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center whitespace-nowrap">
                                            <span
                                                className={clsx(
                                                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide border",
                                                    statusUI.style,
                                                )}
                                            >
                                                {statusUI.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center sticky right-0 bg-white group-hover:bg-blue-50/40 transition-colors shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.02)] z-10 whitespace-nowrap">
                                            <button
                                                onClick={() =>
                                                    onViewDetail(period.id)
                                                }
                                                className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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

            {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border-t border-gray-100 text-sm z-0">
                    <span className="text-gray-500">
                        Hiển thị {data.number * data.size + 1} -{" "}
                        {Math.min(
                            (data.number + 1) * data.size,
                            data.totalElements,
                        )}{" "}
                        trong tổng {data.totalElements} đợt
                    </span>
                    <div className="inline-flex items-center gap-1.5">
                        <button
                            onClick={() => onPageChange(data.number - 1)}
                            disabled={data.number === 0 || isLoading}
                            className="px-3 py-1.5 font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => onPageChange(data.number + 1)}
                            disabled={
                                data.number === data.totalPages - 1 || isLoading
                            }
                            className="px-3 py-1.5 font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
