import React, { memo } from "react";
import { Briefcase, IdCard, Award, BookOpen, Building } from "lucide-react";
import { type UserProfileResponse } from "../types";

interface TeacherInfoSectionProps {
    profile: UserProfileResponse;
}

// Sử dụng React.memo để tối ưu hiệu năng, tránh re-render khi dữ liệu không đổi
export const TeacherInfoSection: React.FC<TeacherInfoSectionProps> = memo(
    ({ profile }) => {
        // Chuẩn hóa dữ liệu hiển thị trước khi đưa vào JSX
        const employeeCode = profile.employeeCode || "Chưa cập nhật";
        const academicTitle = profile.academicTitle || "Chưa cập nhật";
        const specialization = profile.specialization || "Chưa cập nhật";
        const departmentName = profile.departmentName || "Chưa cập nhật";

        return (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Tiêu đề phân khu */}
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-base font-bold text-gray-900">
                        Thông tin công tác cán bộ / Giảng viên
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Mã số nhân viên */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                            Mã số nhân viên
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <IdCard className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                readOnly
                                value={employeeCode}
                                title={employeeCode}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 text-gray-600 rounded-xl outline-none font-mono font-medium cursor-not-allowed select-none"
                            />
                        </div>
                    </div>

                    {/* Học hàm / Học vị */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                            Học hàm / Học vị
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Award className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                readOnly
                                value={academicTitle}
                                title={academicTitle}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 text-gray-600 rounded-xl outline-none font-medium cursor-not-allowed select-none"
                            />
                        </div>
                    </div>

                    {/* Chuyên môn giảng dạy */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                            Chuyên môn giảng dạy
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                readOnly
                                value={specialization}
                                title={specialization}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 text-gray-600 rounded-xl outline-none font-medium cursor-not-allowed select-none truncate"
                            />
                        </div>
                    </div>

                    {/* Khoa công tác */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                            Khoa công tác
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Building className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                readOnly
                                value={departmentName}
                                title={departmentName}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 text-gray-600 rounded-xl outline-none font-medium cursor-not-allowed select-none truncate"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    },
);

TeacherInfoSection.displayName = "TeacherInfoSection";
