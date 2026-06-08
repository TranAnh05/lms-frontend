import React from "react";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";
import { type ClassBasic, type ClassStatus } from "../types";

interface ClassCardProps {
    classData: ClassBasic;
    onClick: (classId: number) => void;
}

const STATUS_CONFIG: Record<ClassStatus, { label: string; color: string }> = {
    PENDING: { label: "Chờ mở", color: "bg-amber-100 text-amber-700" },
    REGISTRATION: { label: "Đang đăng ký", color: "bg-blue-100 text-blue-700" },
    ONGOING: { label: "Đang diễn ra", color: "bg-emerald-100 text-emerald-700" },
    COMPLETED: { label: "Đã kết thúc", color: "bg-gray-100 text-gray-600" },
    CANCELED: { label: "Đã hủy", color: "bg-rose-100 text-rose-700" },
};

export const ClassCard: React.FC<ClassCardProps> = ({ classData, onClick }) => {
    const statusConfig = STATUS_CONFIG[classData.status];

    return (
        <div
            onClick={() => onClick(classData.id)}
            className="group flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer overflow-hidden"
        >
            <div className="p-5 flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <span className={clsx("px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-md", statusConfig.color)}>
                        {statusConfig.label}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {classData.courseName}
                </h3>

                <div className="mt-4 flex flex-col gap-1.5">
                    <div className="text-sm text-gray-600">
                        <span className="text-gray-500">Mã lớp:</span>{" "}
                        <span className="font-semibold text-gray-900">{classData.code}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        <span className="text-gray-500">Mã môn:</span>{" "}
                        <span className="font-semibold text-gray-900">{classData.courseCode}</span>
                    </div>
                </div>
            </div>

            <div className="px-5 py-3.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end mt-auto">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </div>
            </div>
        </div>
    );
};