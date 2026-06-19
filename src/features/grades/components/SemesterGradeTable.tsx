import React from "react";
import { ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { type SemesterTranscriptDto } from "../types";
import { GradeStatusBadge } from "./GradeStatusBadge";

interface SemesterGradeTableProps {
    semesterTranscript: SemesterTranscriptDto;
    isExpanded: boolean;
    onToggle: () => void;
}

export const SemesterGradeTable: React.FC<SemesterGradeTableProps> = React.memo(
    ({ semesterTranscript, isExpanded, onToggle }) => {
        // Rút trích toàn bộ thuộc tính để làm gọn cấu trúc JSX phía dưới
        const {
            semesterNumber,
            academicYear,
            semesterCode,
            creditsThisSemester,
            creditsEarnedThisSemester,
            gpaThisSemester,
            gpaThisSemester4,
            subjects,
        } = semesterTranscript;

        return (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">
                {/* Chuyển đổi sang thẻ button để hỗ trợ a11y (phím Tab/Enter) và chuẩn SEO, tối ưu phản hồi click */}
                <button
                    type="button"
                    onClick={onToggle}
                    className="w-full p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors select-none text-left focus:outline-none focus:bg-gray-50/50"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">
                                Học kỳ {semesterNumber}
                            </h3>
                            <p className="text-xs font-medium text-gray-500 mt-0.5">
                                Năm học: {academicYear} | Học kỳ: {semesterCode}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm">
                        <div className="bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 text-center min-w-[70px]">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                Số TC đăng ký
                            </p>
                            <p className="font-bold text-gray-700">
                                {creditsThisSemester}
                            </p>
                        </div>
                        <div className="bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 text-center min-w-[70px]">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                Số TC tích lũy
                            </p>
                            <p className="font-bold text-emerald-600">
                                {creditsEarnedThisSemester}
                            </p>
                        </div>
                        <div className="bg-blue-50/50 px-3 py-1.5 rounded-xl border border-blue-100 text-center min-w-[70px]">
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                                GPA Hệ 10
                            </p>
                            <p className="font-black text-blue-600">
                                {gpaThisSemester.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-indigo-50/50 px-3 py-1.5 rounded-xl border border-indigo-100 text-center min-w-[70px]">
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                                GPA Hệ 4
                            </p>
                            <p className="font-black text-indigo-600">
                                {gpaThisSemester4.toFixed(2)}
                            </p>
                        </div>

                        <div className="text-gray-400 pl-2 shrink-0 border-l border-gray-200 hidden lg:block">
                            {isExpanded ? (
                                <ChevronUp className="w-5 h-5" />
                            ) : (
                                <ChevronDown className="w-5 h-5" />
                            )}
                        </div>
                    </div>
                </button>

                {isExpanded && (
                    <div className="border-t border-gray-100 overflow-x-auto animate-in fade-in slide-in-from-top-1 duration-200">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="py-3.5 px-4 text-center w-12">
                                        STT
                                    </th>
                                    <th className="py-3.5 px-4">Tên môn học</th>
                                    <th className="py-3.5 px-3 text-center w-16">
                                        TC
                                    </th>
                                    <th className="py-3.5 px-3 text-center w-16">
                                        TX1
                                    </th>
                                    <th className="py-3.5 px-3 text-center w-16">
                                        TX2
                                    </th>
                                    <th className="py-3.5 px-3 text-center w-16">
                                        GK
                                    </th>
                                    <th className="py-3.5 px-3 text-center w-16">
                                        CK
                                    </th>
                                    <th className="py-3.5 px-3 text-center w-28">
                                        Tổng kết
                                    </th>
                                    <th className="py-3.5 px-3 text-center w-14">
                                        Hệ 4
                                    </th>
                                    <th className="py-3.5 px-3 text-center w-14">
                                        Chữ
                                    </th>
                                    <th className="py-3.5 px-4 text-center w-28">
                                        Kết quả
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-600">
                                {subjects.map((subject, idx) => (
                                    <tr
                                        key={
                                            subject.classId ||
                                            subject.courseCode
                                        }
                                        className="hover:bg-gray-50/30 transition-colors"
                                    >
                                        <td className="py-4 px-4 text-center text-gray-400 font-mono text-xs">
                                            {idx + 1}
                                        </td>
                                        <td className="py-4 px-4 text-gray-900 font-semibold">
                                            {subject.courseName}
                                        </td>
                                        <td className="py-4 px-3 text-center font-semibold">
                                            {subject.credits}
                                        </td>
                                        <td className="py-4 px-3 text-center text-gray-500">
                                            {subject.regularScore1 ?? "-"}
                                        </td>
                                        <td className="py-4 px-3 text-center text-gray-500">
                                            {subject.regularScore2 ?? "-"}
                                        </td>
                                        <td className="py-4 px-3 text-center text-gray-500">
                                            {subject.midtermScore ?? "-"}
                                        </td>
                                        <td className="py-4 px-3 text-center text-gray-500">
                                            {subject.finalScore ?? "-"}
                                        </td>
                                        <td className="py-4 px-3 text-center text-blue-600 font-bold">
                                            {subject.totalScore !== null
                                                ? subject.totalScore.toFixed(1)
                                                : "-"}
                                        </td>
                                        <td className="py-4 px-3 text-center text-gray-900 font-bold">
                                            {subject.grade4 !== null
                                                ? subject.grade4.toFixed(1)
                                                : "-"}
                                        </td>
                                        <td className="py-4 px-3 text-center font-black text-gray-900">
                                            {subject.letterGrade || "-"}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <GradeStatusBadge
                                                status={subject.status}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    },
);

SemesterGradeTable.displayName = "SemesterGradeTable";
