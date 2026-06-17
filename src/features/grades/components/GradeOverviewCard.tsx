import React from "react";
import { BookOpen, Award, GraduationCap, Layers } from "lucide-react";
import { type TranscriptResponseDto } from "../types";

interface GradeOverviewCardProps {
    data: TranscriptResponseDto;
}

export const GradeOverviewCard: React.FC<GradeOverviewCardProps> = React.memo(
    ({ data }) => {
        // Boc tach du lieu de code ngan gon va sach se hon
        const { totalCreditsEarned, gpaOverall, gpaOverall4, totalSubjects } =
            data;

        // Tap hop cau hinh cac the de quet danh sach tu dong, giam lap lai code JSX
        const overviewItems = [
            {
                label: "Tín chỉ tích lũy",
                value: totalCreditsEarned,
                icon: BookOpen,
                colorStyles: "bg-blue-50 text-blue-600",
            },
            {
                label: "Điểm hệ 10 (CPA)",
                value: gpaOverall != null ? gpaOverall.toFixed(2) : "0.00",
                icon: Award,
                colorStyles: "bg-indigo-50 text-indigo-600",
            },
            {
                label: "Điểm hệ 4 (GPA)",
                value: gpaOverall4 != null ? gpaOverall4.toFixed(2) : "0.00",
                icon: GraduationCap,
                colorStyles: "bg-purple-50 text-purple-600",
            },
            {
                label: "Tổng số học phần",
                value: totalSubjects,
                icon: Layers,
                colorStyles: "bg-emerald-50 text-emerald-600",
            },
        ];

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {overviewItems.map(
                    ({ label, value, icon: Icon, colorStyles }) => (
                        <div
                            key={label}
                            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
                        >
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${colorStyles}`}
                            >
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-0.5">
                                    {label}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {value}
                                </p>
                            </div>
                        </div>
                    ),
                )}
            </div>
        );
    },
);

GradeOverviewCard.displayName = "GradeOverviewCard";
