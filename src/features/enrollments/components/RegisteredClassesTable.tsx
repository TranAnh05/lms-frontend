import React from "react";
import { Loader2, Inbox } from "lucide-react";
import clsx from "clsx";
import { type EnrollmentResponse } from "../types";

interface RegisteredClassesTableProps {
    data: EnrollmentResponse[];
    isLoading: boolean;
}

const STATUS_CONFIG = {
    REGISTERED: { label: "Ghi nhận", className: "bg-amber-50 text-amber-700 border border-amber-200" },
    OFFICIAL: { label: "Chính thức", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    DROPPED: { label: "Đã hủy", className: "bg-rose-50 text-rose-700 border border-rose-200" },
};

export const RegisteredClassesTable: React.FC<RegisteredClassesTableProps> = ({
    data,
    isLoading,
}) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                <p className="text-sm font-medium text-gray-500">Đang tải giỏ học phần...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
                <div className="p-4 bg-gray-50 rounded-full mb-3 text-gray-400">
                    <Inbox className="w-10 h-10" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Giỏ học phần trống</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Bạn chưa đăng ký lớp học phần nào. Hãy chọn lớp từ danh sách phía trên.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-lg text-gray-900">DANH SÁCH HỌC PHẦN ĐÃ ĐĂNG KÝ</h3>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-5 py-3 font-semibold">Mã môn</th>
                            <th className="px-5 py-3 font-semibold min-w-[200px]">Tên môn học</th>
                            <th className="px-5 py-3 font-semibold">Mã lớp</th>
                            <th className="px-5 py-3 font-semibold text-center">TC</th>
                            <th className="px-5 py-3 font-semibold">Lịch học</th>
                            <th className="px-5 py-3 font-semibold">Phòng</th>
                            <th className="px-5 py-3 font-semibold text-center">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.map((item) => {
                            const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.REGISTERED;
                            const dayStr = item.dayOfWeek === 8 ? "CN" : `T${item.dayOfWeek}`;
                            const timeString = item.dayOfWeek ? `${dayStr} (${item.shiftName})` : "";

                            return (
                                <tr key={`${item.classId}-${item.enrolledAt}`} className="hover:bg-gray-50/50 bg-white transition-colors">
                                    <td className="px-5 py-4 font-semibold text-gray-900">{item.courseCode}</td>
                                    <td className="px-5 py-4 font-bold text-gray-900">{item.courseName}</td>
                                    <td className="px-5 py-4">
                                        <span className="font-semibold text-gray-900 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
                                            {item.classCode}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center font-medium text-gray-700">{item.credits}</td>
                                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                                        {timeString ? timeString : <span className="italic text-gray-400">Chưa có</span>}
                                    </td>
                                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                                        {item.roomName || <span className="italic text-gray-400">-</span>}
                                    </td>
                                    <td className="px-5 py-4 text-center whitespace-nowrap">
                                        <span className={clsx(
                                            "text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider",
                                            status.className
                                        )}>
                                            {status.label}
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