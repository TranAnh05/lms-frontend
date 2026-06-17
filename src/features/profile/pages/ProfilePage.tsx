/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState, useCallback } from "react";
import {
    User,
    Phone,
    Calendar,
    MapPin,
    Shield,
    Loader2,
    ShieldCheck,
    Key,
} from "lucide-react";
import { toast } from "react-toastify";
import { profileService } from "../services/profile.service";
import { type UserProfileResponse } from "../types";
import { AvatarUploader } from "../components/AvatarUploader";
import { StudentInfoSection } from "../components/StudentInfoSection";
import { TeacherInfoSection } from "../components/TeacherInfoSection";
import { ChangePasswordModal } from "../components/ChangePasswordModal";
import { useAuthStore } from "@/store/authStore";

const ROLE_LABELS: Record<string, string> = {
    ADMIN: "Quản trị viên",
    PRINCIPAL: "Hiệu trưởng",
    HR: "Phòng Nhân sự",
    TRAINING_DEPT: "Phòng Đào tạo",
    HEAD_OF_DEPT: "Trưởng khoa",
    INSTRUCTOR: "Giảng viên",
    TEACHER: "Giảng viên",
    STUDENT: "Sinh viên",
};

// Chuyển hàm định dạng ngày ra ngoài để tránh tái khởi tạo khi component re-render
const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "Chưa cập nhật";
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    } catch {
        return dateStr;
    }
};

export const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const updateUserAvatar = useAuthStore((state) => state.updateUserAvatar);

    // Tải thông tin hồ sơ người dùng ban đầu kèm cờ xóa bộ nhớ tạm
    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const fetchProfile = async () => {
            try {
                const data = await profileService.getCurrentProfile();
                if (isMounted) {
                    setProfile(data);
                }
            } catch {
                toast.error("Không thể tải thông tin hồ sơ cá nhân.");
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    // Đồng bộ ảnh đại diện mới vào state local và kho lưu trữ toàn cục Zustand
    const handleAvatarUpdate = useCallback((newUrl: string) => {
        setProfile((prev) => (prev ? { ...prev, avatarUrl: newUrl } : prev));
        updateUserAvatar(newUrl);
    }, [updateUserAvatar]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Đang tải hồ sơ của bạn...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <div className="p-4 bg-rose-50 rounded-full mb-4">
                    <User className="w-10 h-10 text-rose-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Không tìm thấy hồ sơ</h3>
                <p className="text-gray-500 mt-1">Có lỗi xảy ra trong quá trình trích xuất dữ liệu của bạn.</p>
            </div>
        );
    }

    const isStudent = profile.role === "STUDENT";
    const isTeacher = ["TEACHER", "INSTRUCTOR", "HEAD_OF_DEPT"].includes(profile.role);

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Hồ sơ cá nhân</h1>
                <p className="text-sm text-gray-500 mt-1">Xem thông tin chi tiết và cập nhật ảnh đại diện của bạn.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Cột trái: Ảnh đại diện và phím đổi mật khẩu */}
                <div className="w-full lg:w-1/3 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center text-center">
                        <AvatarUploader
                            currentAvatarUrl={profile.avatarUrl}
                            fullName={profile.fullName}
                            onUploadSuccess={handleAvatarUpdate}
                        />

                        <h2 className="mt-5 text-xl font-bold text-gray-900">
                            {profile.fullName || "Chưa cập nhật tên"}
                        </h2>

                        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 shadow-sm">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-sm font-semibold tracking-wide">
                                {ROLE_LABELS[profile.role] || profile.role}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-5 h-5 text-gray-600" />
                            <h3 className="text-base font-bold text-gray-900">Bảo mật tài khoản</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-5">
                            Nên cập nhật mật khẩu thường xuyên để bảo vệ tài khoản của bạn.
                        </p>
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-xl border border-gray-300 transition-colors focus:ring-4 focus:ring-gray-100 focus:outline-none"
                        >
                            <Key className="w-4 h-4" />
                            Đổi mật khẩu
                        </button>
                    </div>
                </div>

                {/* Cột phải: Form thông tin chi tiết cá nhân lý lịch */}
                <div className="w-full lg:w-2/3 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                        <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-6">
                            <User className="w-5 h-5 text-gray-600" />
                            <h3 className="text-base font-bold text-gray-900">Lý lịch & Liên hệ</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Họ và tên</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        readOnly
                                        value={profile.fullName || ""}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 text-gray-700 rounded-xl outline-none font-medium cursor-not-allowed select-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Số điện thoại</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        readOnly
                                        value={profile.phone || "Chưa cập nhật"}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 text-gray-700 rounded-xl outline-none font-medium cursor-not-allowed select-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Ngày sinh</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        readOnly
                                        value={formatDate(profile.birthday)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 text-gray-700 rounded-xl outline-none font-medium cursor-not-allowed select-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Giới tính</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        readOnly
                                        value={
                                            profile.gender === "MALE"
                                                ? "Nam"
                                                : profile.gender === "FEMALE"
                                                  ? "Nữ"
                                                  : profile.gender || "Chưa cập nhật"
                                        }
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 text-gray-700 rounded-xl outline-none font-medium cursor-not-allowed select-none"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Địa chỉ cư trú</label>
                                <div className="relative">
                                    <div className="absolute top-3 left-0 pl-3.5 flex pointer-events-none text-gray-400">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <textarea
                                        readOnly
                                        rows={2}
                                        value={profile.address || "Chưa cập nhật"}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 text-gray-700 rounded-xl outline-none font-medium cursor-not-allowed select-none resize-none leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phần thông tin mở rộng theo phân hệ quyền hạn */}
                    {(isStudent || isTeacher) && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                            {isStudent && <StudentInfoSection profile={profile} />}
                            {isTeacher && <TeacherInfoSection profile={profile} />}
                        </div>
                    )}
                </div>
            </div>
            
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
};