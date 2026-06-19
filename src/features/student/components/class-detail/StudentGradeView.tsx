/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { studentService } from "../../services/student.service";
import { type StudentGradeResponse } from "../../types";

interface StudentGradeViewProps {
    classId: number;
}

// Cấu hình UI cố định cho các trạng thái kết quả
const STATUS_CONFIG: Record<string, { label: string; styles: string }> = {
    PASS: {
        label: "Đạt",
        styles: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    FAIL: {
        label: "Học lại",
        styles: "bg-rose-50 text-rose-700 border-rose-200",
    },
    PENDING: {
        label: "Chưa đủ điểm",
        styles: "bg-gray-50 text-gray-500 border-gray-200",
    },
};

// Định nghĩa hàm format ngoài component để tránh khởi tạo lại khi re-render
const formatScore = (score: number | null) =>
    score !== null ? score.toFixed(2) : "-";

export const StudentGradeView = ({ classId }: StudentGradeViewProps) => {
    const [grade, setGrade] = useState<StudentGradeResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isCurrent = true;
        setIsLoading(true);

        const fetchGrade = async () => {
            try {
                const data = await studentService.getGradeByClass(classId);
                if (isCurrent) setGrade(data);
            } catch {
                if (isCurrent) setGrade(null);
            } finally {
                if (isCurrent) setIsLoading(false);
            }
        };

        fetchGrade();

        // Cleanup function chống race condition và memory leak
        return () => {
            isCurrent = false;
        };
    }, [classId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Loader2 className="w-9 h-9 text-blue-600 animate-spin mb-3" />
                <p className="text-gray-500 font-medium text-sm">
                    Đang tải bảng điểm học phần...
                </p>
            </div>
        );
    }

    if (!grade) {
        return (
            <div className="flex items-center gap-3 p-5 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200/60 text-sm font-medium">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                Không tìm thấy dữ liệu điểm số của lớp học này hoặc lớp học chưa
                được cập nhật.
            </div>
        );
    }

    // Lấy cấu hình UI tương ứng với trạng thái điểm số hiện tại
    const currentStatus = STATUS_CONFIG[grade.status];

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-1 duration-300">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-gray-50/70 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-4.5 text-center">
                                Thường xuyên 1
                            </th>
                            <th className="px-6 py-4.5 text-center">
                                Thường xuyên 2
                            </th>
                            <th className="px-6 py-4.5 text-center">Giữa kỳ</th>
                            <th className="px-6 py-4.5 text-center">Cuối kỳ</th>
                            <th className="px-6 py-4.5 text-center bg-blue-50/40 text-blue-800 font-extrabold">
                                Điểm tổng kết
                            </th>
                            <th className="px-6 py-4.5 text-center">Kết quả</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm font-semibold text-gray-700">
                        <tr className="hover:bg-gray-50/40 transition-colors">
                            <td className="px-6 py-5.5 text-center text-gray-600">
                                {formatScore(grade.regularScore1)}
                            </td>
                            <td className="px-6 py-5.5 text-center text-gray-600">
                                {formatScore(grade.regularScore2)}
                            </td>
                            <td className="px-6 py-5.5 text-center text-gray-600">
                                {formatScore(grade.midtermScore)}
                            </td>
                            <td className="px-6 py-5.5 text-center text-gray-600">
                                {formatScore(grade.finalScore)}
                            </td>

                            <td className="px-6 py-5.5 text-center text-base font-bold text-blue-600 bg-blue-50/20">
                                {formatScore(grade.totalScore)}
                            </td>

                            <td className="px-6 py-5.5 text-center">
                                <div className="flex items-center justify-center">
                                    {currentStatus && (
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentStatus.styles}`}
                                        >
                                            {currentStatus.label}
                                        </span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
