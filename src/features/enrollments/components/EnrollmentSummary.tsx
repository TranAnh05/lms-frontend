import React from "react";
import clsx from "clsx";

interface EnrollmentSummaryProps {
    totalCredits: number;
    totalClasses: number;
    minCredits?: number;
    maxCredits?: number;
}

export const EnrollmentSummary: React.FC<EnrollmentSummaryProps> = ({
    totalCredits,
    totalClasses,
    minCredits = 12,
    maxCredits = 24,
}) => {
    const isUnderLimit = totalCredits < minCredits;
    const isOverLimit = totalCredits > maxCredits;
    const isValid = !isUnderLimit && !isOverLimit;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col gap-1 min-w-[200px]">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                    TỔNG QUAN ĐĂNG KÝ
                </h3>
                <span className="text-sm font-medium text-gray-500">
                    Đã chọn {totalClasses} lớp học phần
                </span>
            </div>

            <div className="flex flex-col items-start md:items-center gap-1 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                <div className="flex items-baseline gap-2">
                    <span className={clsx(
                        "text-3xl font-black leading-none",
                        isUnderLimit ? "text-amber-600" : isOverLimit ? "text-rose-600" : "text-emerald-600"
                    )}>
                        {totalCredits}
                    </span>
                    <span className="text-sm font-medium text-gray-600">/ {maxCredits} tín chỉ</span>
                </div>
                <span className="text-xs font-medium text-gray-500">
                    Yêu cầu tối thiểu: {minCredits} tín chỉ
                </span>
            </div>

            <div className={clsx(
                "flex-1 w-full md:w-auto p-3.5 rounded-lg text-sm font-medium border text-center md:text-left",
                isValid ? "bg-emerald-50 border-emerald-100 text-emerald-800" : 
                isOverLimit ? "bg-rose-50 border-rose-100 text-rose-800" : 
                "bg-amber-50 border-amber-100 text-amber-800"
            )}>
                {isValid && "Bạn đã đạt số tín chỉ yêu cầu của học kỳ. Có thể tiến hành lưu kết quả."}
                {isUnderLimit && `Bạn cần đăng ký thêm ít nhất ${minCredits - totalCredits} tín chỉ nữa để đạt mức tối thiểu.`}
                {isOverLimit && `Vượt quá giới hạn! Vui lòng hủy bớt ${totalCredits - maxCredits} tín chỉ.`}
            </div>
        </div>
    );
};