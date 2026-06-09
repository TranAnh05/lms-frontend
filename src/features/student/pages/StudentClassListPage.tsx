/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Loader2, Inbox } from "lucide-react";
import { toast } from "react-toastify";
import clsx from "clsx";
import { studentService } from "../services/student.service";
import { type StudentClassResponse, type ClassStatus } from "../types";

type FilterStatus = "ONGOING" | "COMPLETED";

const STATUS_CONFIG: Record<ClassStatus, { label: string; bg: string; text: string; border: string }> = {
    ONGOING: { label: "Đang diễn ra", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    COMPLETED: { label: "Đã kết thúc", bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200" },
};

export const StudentClassListPage: React.FC = () => {
    const [classes, setClasses] = useState<StudentClassResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<FilterStatus>("ONGOING");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await studentService.getMyClasses();
                const classList = Array.isArray(res) ? res : (res as any).data;
                setClasses(classList || []);
            } catch (error) {
                toast.error("Không thể tải danh sách lớp học.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchClasses();
    }, []);

    const filteredClasses = classes.filter((cls) => cls.status === filter);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Đang tải danh sách lớp học...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
                {(["ONGOING", "COMPLETED"] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={clsx(
                            "px-4 py-2 text-sm font-semibold border-b-2 transition-all relative top-[1px]",
                            filter === status
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        )}
                    >
                        {status === "ONGOING" ? "Đang diễn ra" : "Đã kết thúc"}
                    </button>
                ))}
            </div>

            {filteredClasses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-200 border-dashed shadow-sm">
                    <div className="p-5 bg-gray-50 rounded-full mb-4 text-gray-400">
                        <Inbox className="w-10 h-10" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Không có lớp học nào</h3>
                    <p className="text-sm text-gray-500 mt-1">Không tìm thấy lớp học nào thuộc trạng thái này.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredClasses.map((cls) => {
                        const statusConfig = STATUS_CONFIG[cls.status] || STATUS_CONFIG.ONGOING;

                        return (
                            <div 
                                key={cls.classId}
                                onClick={() => navigate(`${cls.classId}`)}
                                className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col overflow-hidden"
                            >
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-start mb-3">
                                        <span className={clsx(
                                            "px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border",
                                            statusConfig.bg,
                                            statusConfig.text,
                                            statusConfig.border
                                        )}>
                                            {statusConfig.label}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {cls.courseName}
                                    </h3>
                                </div>

                                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between group-hover:bg-blue-50/30 transition-colors">
                                    <span className="text-sm font-semibold text-gray-600 group-hover:text-blue-600 transition-colors">
                                        Vào không gian lớp
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-blue-200 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};