import React from "react";
import { Loader2, Inbox } from "lucide-react";
import clsx from "clsx";
import { type RegisteredClassDTO, type ScheduleBasic } from "../types";

interface RegisteredClassesTableProps {
    data: RegisteredClassDTO[];
    isLoading: boolean;
}

const formatSchedules = (schedules: ScheduleBasic[]) => {
    if (!schedules || schedules.length === 0) return [];
    return schedules.map(s => {
        const day = s.dayOfWeek === 8 ? "CN" : `T${s.dayOfWeek}`;
        return {
            time: `${day} (${s.shift.name})`,
            room: s.room.name
        };
    });
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
                            const parsedSchedules = formatSchedules(item.schedules);
                            
                            return (
                                <tr key={item.enrollmentId} className="hover:bg-gray-50/50 bg-white transition-colors">
                                    <td className="px-5 py-4 font-semibold text-gray-900">{item.courseCode}</td>
                                    <td className="px-5 py-4 font-bold text-gray-900">{item.courseName}</td>
                                    <td className="px-5 py-4">
                                        <span className="font-semibold text-gray-900 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
                                            {item.classCode}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center font-medium text-gray-700">{item.credits}</td>
                                    <td className="px-5 py-4 text-gray-600">
                                        {parsedSchedules.length > 0 ? (
                                            parsedSchedules.map((s, i) => <div key={i} className="whitespace-nowrap">{s.time}</div>)
                                        ) : <span className="italic text-gray-400">Chưa có</span>}
                                    </td>
                                    <td className="px-5 py-4 text-gray-600">
                                        {parsedSchedules.length > 0 ? (
                                            parsedSchedules.map((s, i) => <div key={i} className="whitespace-nowrap">{s.room}</div>)
                                        ) : <span className="italic text-gray-400">-</span>}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className={clsx(
                                            "text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider",
                                            item.status === "OFFICIAL" 
                                                ? "bg-emerald-50 text-emerald-700" 
                                                : "bg-amber-50 text-amber-700"
                                        )}>
                                            {item.status === "OFFICIAL" ? "Đã lưu" : "Ghi nhận"}
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