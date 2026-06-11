import React from "react";
import { GraduationCap, Hash, Calendar } from "lucide-react";
import { type UserProfileResponse } from "../types";

interface StudentInfoSectionProps {
    profile: UserProfileResponse;
}

export const StudentInfoSection: React.FC<StudentInfoSectionProps> = ({ profile }) => {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-gray-900">Thông tin sinh viên</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">Mã số sinh viên</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Hash className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            readOnly
                            value={profile.studentCode || "Chưa cập nhật"}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 text-gray-600 rounded-xl outline-none font-mono font-medium cursor-not-allowed select-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">Khóa học (Cohort)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            readOnly
                            value={profile.cohort ? `Khóa ${profile.cohort}` : "Chưa cập nhật"}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 text-gray-600 rounded-xl outline-none font-medium cursor-not-allowed select-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">Ngành học chính thức</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <GraduationCap className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            readOnly
                            value={profile.majorName || "Chưa cập nhật"}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 text-gray-600 rounded-xl outline-none font-medium cursor-not-allowed select-none truncate"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};