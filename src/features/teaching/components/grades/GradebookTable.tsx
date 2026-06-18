import React, { useCallback, memo } from "react";
import { Loader2, Inbox } from "lucide-react";
import { type StudentGrade } from "../../types";

export interface GradeFormula {
    regularWeight: number;
    midtermWeight: number;
    finalWeight: number;
}

type GradeField =
    | "regularScore1"
    | "regularScore2"
    | "midtermScore"
    | "finalScore";

interface GradebookTableProps {
    grades: StudentGrade[];
    formula: GradeFormula;
    isLoading: boolean;
    isFinalized: boolean;
    onGradeChange: (
        studentId: number,
        field: GradeField,
        value: number | null,
    ) => void;
}

// Toi uu: Co dinh chuoi CSS ra ngoai de tiet kiem bo nho cap phat lai
const INPUT_CLASSES =
    "w-16 px-2 py-1.5 text-center font-semibold bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all outline-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";

interface GradebookRowProps {
    item: StudentGrade;
    index: number;
    isFinalized: boolean;
    onInputChange: (
        studentId: number,
        field: GradeField,
        valStr: string,
    ) => void;
}

// Toi uu: Su dung React.memo de co lap chu ky render phan tu hang loat
const GradebookRow: React.FC<GradebookRowProps> = memo(
    ({ item, index, isFinalized, onInputChange }) => {
        return (
            <tr className="hover:bg-gray-50/30 transition-colors bg-white">
                <td className="px-4 py-4 text-center text-gray-400 font-medium">
                    {index + 1}
                </td>
                <td className="px-4 py-4">
                    <div className="font-bold text-gray-900">
                        {item.fullName}
                    </div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">
                        {item.studentCode}
                    </div>
                </td>

                <td className="px-4 py-3 text-center">
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        disabled={isFinalized}
                        value={item.regularScore1 ?? ""}
                        onChange={(e) =>
                            onInputChange(
                                item.studentId,
                                "regularScore1",
                                e.target.value,
                            )
                        }
                        className={INPUT_CLASSES}
                    />
                </td>

                <td className="px-4 py-3 text-center">
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        disabled={isFinalized}
                        value={item.regularScore2 ?? ""}
                        onChange={(e) =>
                            onInputChange(
                                item.studentId,
                                "regularScore2",
                                e.target.value,
                            )
                        }
                        className={INPUT_CLASSES}
                    />
                </td>

                <td className="px-4 py-3 text-center">
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        disabled={isFinalized}
                        value={item.midtermScore ?? ""}
                        onChange={(e) =>
                            onInputChange(
                                item.studentId,
                                "midtermScore",
                                e.target.value,
                            )
                        }
                        className={INPUT_CLASSES}
                    />
                </td>

                <td className="px-4 py-3 text-center">
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        disabled={isFinalized}
                        value={item.finalScore ?? ""}
                        onChange={(e) =>
                            onInputChange(
                                item.studentId,
                                "finalScore",
                                e.target.value,
                            )
                        }
                        className={INPUT_CLASSES}
                    />
                </td>

                <td className="px-4 py-4 text-center font-bold bg-gray-50/30 text-gray-900">
                    {item.totalScore !== null && item.totalScore !== undefined
                        ? item.totalScore.toFixed(1)
                        : "-"}
                </td>

                <td className="px-4 py-4 text-center">
                    {item.status === "PASS" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ring-1 ring-inset bg-emerald-50 text-emerald-700 ring-emerald-600/20">
                            Đạt
                        </span>
                    )}
                    {item.status === "FAIL" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ring-1 ring-inset bg-rose-50 text-rose-700 ring-rose-600/20">
                            Học lại
                        </span>
                    )}
                    {item.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200">
                            Chờ điểm
                        </span>
                    )}
                </td>
            </tr>
        );
    },
);

GradebookRow.displayName = "GradebookRow";

// Toi uu: Su dung React.memo cho ca bang de chong re-render thua khi component cha bat tat Modal
export const GradebookTable: React.FC<GradebookTableProps> = memo(
    ({ grades, formula, isLoading, isFinalized, onGradeChange }) => {
        // Toi uu: Boc useCallback de on dinh tham chieu ham truyen xuong Row
        const handleInputChange = useCallback(
            (studentId: number, field: GradeField, valStr: string) => {
                if (valStr === "") {
                    onGradeChange(studentId, field, null);
                    return;
                }
                const num = parseFloat(valStr);
                if (!isNaN(num) && num >= 0 && num <= 10) {
                    onGradeChange(studentId, field, num);
                }
            },
            [onGradeChange],
        );

        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                    <p className="text-sm font-medium text-gray-500">
                        Đang tải bảng điểm lớp học...
                    </p>
                </div>
            );
        }

        if (!grades || grades.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-gray-200 shadow-sm border-dashed">
                    <div className="p-4 bg-gray-50 rounded-full mb-3 text-gray-400">
                        <Inbox className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">
                        Bảng điểm trống
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Chưa có dữ liệu sinh viên để hiển thị điểm.
                    </p>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col w-full">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">
                            Bảng điểm chi tiết
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Tỷ lệ điểm: CC ({formula.regularWeight * 100}%) - GK
                            ({formula.midtermWeight * 100}%) - CK (
                            {formula.finalWeight * 100}%)
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left table-auto min-w-[850px]">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-200 sticky top-0 z-10 whitespace-nowrap">
                            <tr>
                                <th className="px-4 py-4 font-semibold text-center w-14">
                                    STT
                                </th>
                                <th className="px-4 py-4 font-semibold min-w-[200px]">
                                    Sinh viên
                                </th>
                                <th className="px-4 py-4 font-semibold text-center w-24">
                                    TX 1
                                </th>
                                <th className="px-4 py-4 font-semibold text-center w-24">
                                    TX 2
                                </th>
                                <th className="px-4 py-4 font-semibold text-center w-24">
                                    Giữa kỳ
                                </th>
                                <th className="px-4 py-4 font-semibold text-center w-24">
                                    Cuối kỳ
                                </th>
                                <th className="px-4 py-4 font-semibold text-center w-24 bg-gray-50/50">
                                    Tổng kết
                                </th>
                                <th className="px-4 py-4 font-semibold text-center w-28">
                                    Kết quả
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {grades.map((item, index) => (
                                <GradebookRow
                                    key={item.studentId}
                                    item={item}
                                    index={index}
                                    isFinalized={isFinalized}
                                    onInputChange={handleInputChange}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    },
);

GradebookTable.displayName = "GradebookTable";
