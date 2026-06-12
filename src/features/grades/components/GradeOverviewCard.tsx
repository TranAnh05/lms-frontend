import React from "react";
import { BookOpen, Award, GraduationCap, Layers } from "lucide-react";
import { type TranscriptResponseDto } from "../types";

interface GradeOverviewCardProps {
    data: TranscriptResponseDto;
}

export const GradeOverviewCard: React.FC<GradeOverviewCardProps> = ({
    data,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-0.5">
                        Tín chỉ tích lũy
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                        {data.totalCreditsEarned}
                    </p>
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-0.5">
                        Điểm hệ 10 (CPA)
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                        {data.gpaOverall != null
                            ? data.gpaOverall.toFixed(2)
                            : "0.00"}
                    </p>
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-0.5">
                        Điểm hệ 4 (GPA)
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                        {data.gpaOverall4 != null
                            ? data.gpaOverall4.toFixed(2)
                            : "0.00"}
                    </p>
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Layers className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-0.5">
                        Tổng số học phần
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                        {data.totalSubjects}
                    </p>
                </div>
            </div>
        </div>
    );
};
