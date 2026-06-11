import React from "react";
import { Loader2, Inbox } from "lucide-react";
import clsx from "clsx";
import { type SemesterClassResponse, type ClassStatus } from "../types";

interface SemesterClassStatusTableProps {
    classes: SemesterClassResponse[];
    isLoading: boolean;
}

const STATUS_CONFIG: Record<ClassStatus, { label: string; className: string }> =
    {
        PENDING: {
            label: "Chờ xử lý",
            className: "bg-gray-100 text-gray-700 border-gray-200",
        },
        REGISTRATION: {
            label: "Đang đăng ký",
            className: "bg-purple-50 text-purple-700 border-purple-200",
        },
        ONGOING: {
            label: "Đang diễn ra",
            className: "bg-blue-50 text-blue-700 border-blue-200",
        },
        COMPLETED: {
            label: "Đã hoàn thành",
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
        CANCELED: {
            label: "Đã hủy",
            className: "bg-rose-50 text-rose-700 border-rose-200",
        },
    };

export const SemesterClassStatusTable: React.FC<
    SemesterClassStatusTableProps
> = ({ classes, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-gray-50/50 rounded-xl border border-gray-100">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                <p className="text-sm font-medium text-gray-500">
                    Đang kiểm tra dữ liệu lớp học...
                </p>
            </div>
        );
    }

    if (!classes || classes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-gray-50/50 rounded-xl border border-gray-100 text-center">
                <div className="p-3 bg-white rounded-full mb-3 shadow-sm text-gray-400">
                    <Inbox className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">
                    Không có lớp học
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    Học kỳ này hiện chưa có lớp học phần nào được khởi tạo.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-sm text-gray-600 table-auto">
                    <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200 sticky top-0 z-10 whitespace-nowrap">
                        <tr>
                            <th scope="col" className="px-5 py-3.5 w-[20%]">
                                Mã lớp
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3.5 w-[45%] min-w-[240px]"
                            >
                                Môn học
                            </th>
                            <th scope="col" className="px-5 py-3.5 w-[20%]">
                                Giảng viên
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3.5 w-[15%] text-center"
                            >
                                Trạng thái
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {classes.map((cls) => {
                            const statusConfig = STATUS_CONFIG[cls.status];

                            return (
                                <tr
                                    key={cls.id}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <span className="font-mono font-bold text-gray-900">
                                            {cls.code}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 font-medium text-gray-800">
                                        {cls.courseName}
                                    </td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        {cls.lecturerName ? (
                                            <span className="text-gray-700">
                                                {cls.lecturerName}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">
                                                Chưa phân công
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                                        <span
                                            className={clsx(
                                                "inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border min-w-[110px]",
                                                statusConfig.className,
                                            )}
                                        >
                                            {statusConfig.label}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
