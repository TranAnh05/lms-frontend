import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Loader2, Inbox } from "lucide-react";
import { toast } from "react-toastify";
import clsx from "clsx";
import { studentService } from "../services/student.service";
// Toi uu: Import ApiResponse de xu ly boc tach du lieu an toan
import {
    type StudentClassResponse,
    type ClassStatus,
    type ApiResponse,
} from "../types";

type FilterStatus = "ONGOING" | "COMPLETED";

const STATUS_CONFIG: Record<
    ClassStatus,
    { label: string; bg: string; text: string; border: string }
> = {
    ONGOING: {
        label: "Đang diễn ra",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
    },
    COMPLETED: {
        label: "Đã kết thúc",
        bg: "bg-gray-100",
        text: "text-gray-600",
        border: "border-gray-200",
    }
};

export const StudentClassListPage: React.FC = () => {
    const [classes, setClasses] = useState<StudentClassResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<FilterStatus>("ONGOING");
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        const abortController = new AbortController();

        const fetchClasses = async () => {
            try {
                const res = await studentService.getMyClassesRegistered();

                if (isMounted && !abortController.signal.aborted) {
                    // Toi uu: Boc tach lop vo API an toan va kiem tra mang truoc khi set state
                    const responseWrapper = res as unknown as ApiResponse<
                        StudentClassResponse[]
                    >;
                    const actualClasses = responseWrapper?.data
                        ? responseWrapper.data
                        : (res as unknown as StudentClassResponse[]);

                    // Dam bao state luon la mang de tranh loi .filter is not a function
                    setClasses(
                        Array.isArray(actualClasses) ? actualClasses : [],
                    );
                }
            } catch (error) {
                if (isMounted && !abortController.signal.aborted) {
                    console.error("Lỗi tải danh sách lớp:", error);
                    toast.error("Không thể tải danh sách lớp học.");
                }
            } finally {
                if (isMounted && !abortController.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchClasses();

        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, []);

    const filteredClasses = useMemo(() => {
        return classes.filter((cls) => cls.status === filter);
    }, [classes, filter]);

    if (isLoading) {
        return (
            <div
                className="flex flex-col items-center justify-center min-h-[60vh]"
                aria-live="polite"
            >
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">
                    Đang tải danh sách lớp học...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
            <div
                className="flex items-center gap-2 border-b border-gray-200 pb-1"
                role="tablist"
            >
                {(["ONGOING", "COMPLETED"] as const).map((status) => (
                    <button
                        key={status}
                        type="button"
                        role="tab"
                        aria-selected={filter === status}
                        onClick={() => setFilter(status)}
                        className={clsx(
                            "px-4 py-2 text-sm font-semibold border-b-2 transition-all relative top-[1px] select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-t-md",
                            filter === status
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700",
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
                    <h3 className="text-lg font-bold text-gray-900">
                        Không có lớp học nào
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Không tìm thấy lớp học nào thuộc trạng thái này.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredClasses.map((cls) => {
                        const statusConfig =
                            STATUS_CONFIG[cls.status] || STATUS_CONFIG.ONGOING;

                        return (
                            <div
                                key={cls.classId}
                                onClick={() => navigate(`${cls.classId}`)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        navigate(`${cls.classId}`);
                                    }
                                }}
                                className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col overflow-hidden select-none focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                            >
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-3 gap-2">
                                        <span
                                            className={clsx(
                                                "px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border",
                                                statusConfig.bg,
                                                statusConfig.text,
                                                statusConfig.border,
                                            )}
                                        >
                                            {statusConfig.label}
                                        </span>
                                        <span
                                            className="text-xs font-mono text-gray-400 truncate"
                                            title={cls.classCode}
                                        >
                                            {cls.classCode}
                                        </span>
                                    </div>

                                    <h3
                                        className="text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2"
                                        title={cls.courseName}
                                    >
                                        {cls.courseName}
                                    </h3>
                                </div>

                                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between group-hover:bg-blue-50/30 transition-colors shrink-0">
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
