import React from "react";
import { BookOpen, Award, GraduationCap, Activity } from "lucide-react";
import clsx from "clsx";
import { type AcademicOverview, type AcademicStatus } from "../types";

interface GradeOverviewCardProps {
    overview: AcademicOverview;
}

const ACADEMIC_STATUS_MAP: Record<AcademicStatus, { label: string; text: string; bg: string; iconBox: string }> = {
    NORMAL: { label: "Bình thường", text: "text-emerald-700", bg: "bg-emerald-50/50 border-emerald-100", iconBox: "bg-emerald-100 text-emerald-600" },
    WARNING: { label: "Cảnh báo học vụ", text: "text-amber-700", bg: "bg-amber-50/50 border-amber-100", iconBox: "bg-amber-100 text-amber-600" },
    SUSPENDED: { label: "Đình chỉ học", text: "text-rose-700", bg: "bg-rose-50/50 border-rose-100", iconBox: "bg-rose-100 text-rose-600" },
};

export const GradeOverviewCard: React.FC<GradeOverviewCardProps> = ({ overview }) => {
    const statusConfig = ACADEMIC_STATUS_MAP[overview.currentAcademicStatus] || ACADEMIC_STATUS_MAP.NORMAL;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-0.5">Tín chỉ tích lũy</p>
                    <p className="text-2xl font-bold text-gray-900">{overview.totalEarnedCredits}</p>
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-0.5">Điểm hệ 10 (CPA)</p>
                    <p className="text-2xl font-bold text-gray-900">{overview.cumulativeGpa10.toFixed(2)}</p>
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-0.5">Điểm hệ 4 (GPA)</p>
                    <p className="text-2xl font-bold text-gray-900">{overview.cumulativeGpa4.toFixed(2)}</p>
                </div>
            </div>

            <div className={clsx("p-5 rounded-2xl border shadow-sm flex items-center gap-4 transition-shadow hover:shadow-md", statusConfig.bg)}>
                <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center shrink-0", statusConfig.iconBox)}>
                    <Activity className="w-6 h-6" />
                </div>
                <div>
                    <p className={clsx("text-sm font-medium mb-0.5", statusConfig.text)}>Tình trạng học vụ</p>
                    <p className={clsx("text-xl font-bold", statusConfig.text)}>{statusConfig.label}</p>
                </div>
            </div>
        </div>
    );
};