import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, FileQuestion, PlayCircle, ArrowRightCircle } from "lucide-react";
import clsx from "clsx";
import { type StudentExamBasic, type ExamType } from "../../types";

interface StudentExamItemProps {
    exam: StudentExamBasic;
}

const TYPE_CONFIG: Record<ExamType, { label: string; color: string }> = {
    REGULAR: { label: "Thường xuyên", color: "bg-blue-50 text-blue-700 border-blue-200" },
    MIDTERM: { label: "Giữa kỳ", color: "bg-amber-50 text-amber-700 border-amber-200" },
    FINAL: { label: "Cuối kỳ", color: "bg-rose-50 text-rose-700 border-rose-200" },
};

export const StudentExamItem: React.FC<StudentExamItemProps> = ({ exam }) => {
    const navigate = useNavigate();
    const typeConfig = TYPE_CONFIG[exam.examType];

    const isCompleted = exam.attemptStatus === "COMPLETED" || exam.attemptStatus === "FORCED";
    const isLocked = exam.status === "CREATED" || (exam.status === "CLOSED" && !isCompleted);
    const canTakeExam = exam.status === "OPEN" && !isCompleted;
    const isResume = exam.attemptStatus === "IN_PROGRESS";

    const handleActionClick = () => {
        if (canTakeExam) {
            navigate(`/student/exams/${exam.id}/take`);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
            <div className="p-5 sm:p-6 flex-1">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                        <FileQuestion className="w-6 h-6 text-indigo-600" />
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2.5 mb-2">
                            <h3 className="text-lg font-bold text-gray-900 leading-snug">
                                {exam.title}
                            </h3>
                            <span className={clsx(
                                "px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide border",
                                typeConfig.color
                            )}>
                                {typeConfig.label}
                            </span>
                        </div>

                        {exam.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                {exam.description}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                            <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                                <Clock className="w-4 h-4 text-amber-500" />
                                {exam.timeLimit} phút
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                                <FileQuestion className="w-4 h-4 text-blue-500" />
                                {exam.totalQuestions} câu hỏi
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-5 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-end mt-auto">
                <button
                    onClick={handleActionClick}
                    disabled={!canTakeExam}
                    className={clsx(
                        "flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold rounded-lg transition-all focus:outline-none w-full sm:w-auto",
                        canTakeExam
                            ? isResume 
                                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20" 
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                >
                    {isCompleted ? (
                        <>Đã hoàn thành</>
                    ) : isLocked ? (
                        <>{exam.status === "CLOSED" ? "Đã đóng" : "Chưa mở"}</>
                    ) : isResume ? (
                        <>
                            <ArrowRightCircle className="w-4 h-4" />
                            Tiếp tục
                        </>
                    ) : (
                        <>
                            <PlayCircle className="w-4 h-4" />
                            Làm bài
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};