import React, { memo } from "react";
import {
    Clock,
    FileQuestion,
    MoreVertical,
    FileCheck,
    PlayCircle,
    StopCircle,
} from "lucide-react";
import clsx from "clsx";
import { type ExamBasic, type ExamType, type ExamStatus } from "../../types";

interface ExamItemProps {
    exam: ExamBasic;
    onOpen?: (examId: number) => void;
    onClose?: (examId: number) => void;
}

const TYPE_CONFIG: Record<ExamType, { label: string; color: string }> = {
    REGULAR: {
        label: "Thường xuyên",
        color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    MIDTERM: {
        label: "Giữa kỳ",
        color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    FINAL: {
        label: "Cuối kỳ",
        color: "bg-rose-50 text-rose-700 border-rose-200",
    },
};

const STATUS_CONFIG: Record<
    ExamStatus,
    { label: string; dotClass: string; textClass: string }
> = {
    CREATED: {
        label: "Chưa mở",
        dotClass: "bg-gray-400",
        textClass: "text-gray-600",
    },
    OPEN: {
        label: "Đang mở",
        dotClass: "bg-emerald-500",
        textClass: "text-emerald-700",
    },
    CLOSED: {
        label: "Đã đóng",
        dotClass: "bg-rose-500",
        textClass: "text-rose-700",
    },
};

// Toi uu: Su dung React.memo de ngan re-render khi cac phan tu khac trong danh sach thay doi
export const ExamItem: React.FC<ExamItemProps> = memo(
    ({ exam, onOpen, onClose }) => {
        // Toi uu: Bo sung fallback phong truong hop du lieu tu API bi thieu hoac khong hop le
        const typeConfig = TYPE_CONFIG[exam.examType] || {
            label: "Chưa xác định",
            color: "bg-gray-50 text-gray-700 border-gray-200",
        };
        const statusConfig = STATUS_CONFIG[exam.status] || {
            label: "Chưa xác định",
            dotClass: "bg-gray-300",
            textClass: "text-gray-500",
        };

        const isOpen = exam.status === "OPEN";
        const isClosed = exam.status === "CLOSED";

        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
                <div className="p-5 flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shrink-0 group-hover:bg-indigo-100 transition-colors">
                                <FileCheck className="w-6 h-6 text-indigo-600" />
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                                    <h3 className="text-lg font-bold text-gray-900 leading-snug">
                                        {exam.title}
                                    </h3>
                                    <span
                                        className={clsx(
                                            "px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide border",
                                            typeConfig.color,
                                        )}
                                    >
                                        {typeConfig.label}
                                    </span>
                                </div>

                                {exam.description && (
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                        {exam.description}
                                    </p>
                                )}

                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                                    <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                                        <Clock className="w-4 h-4 text-amber-500" />
                                        {exam.timeLimit} phút
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                                        <FileQuestion className="w-4 h-4 text-blue-500" />
                                        {exam.totalQuestions} câu hỏi
                                    </div>
                                    <div
                                        className={clsx(
                                            "flex items-center gap-1.5 text-sm font-semibold ml-auto",
                                            statusConfig.textClass,
                                        )}
                                    >
                                        <span
                                            className={clsx(
                                                "w-2 h-2 rounded-full",
                                                statusConfig.dotClass,
                                            )}
                                        ></span>
                                        {statusConfig.label}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none shrink-0"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3 mt-auto">
                    <button
                        type="button"
                        onClick={() => onOpen?.(exam.id)}
                        disabled={isOpen || isClosed}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-100"
                    >
                        <PlayCircle className="w-4 h-4" />
                        Mở bài
                    </button>
                    <button
                        type="button"
                        onClick={() => onClose?.(exam.id)}
                        disabled={!isOpen}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-100"
                    >
                        <StopCircle className="w-4 h-4" />
                        Đóng bài
                    </button>
                </div>
            </div>
        );
    },
);

ExamItem.displayName = "ExamItem";
