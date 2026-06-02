import React, { useEffect, useState } from "react";
import {
    X,
    User as UserIcon,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Shield,
    CheckCircle,
    Lock,
    ShieldCheck,
} from "lucide-react";
import { type User } from "../types";
import { userService } from "../services/user.service";
import clsx from "clsx";

const ROLE_LABELS: Record<string, string> = {
    ADMIN: "Quản trị viên",
    PRINCIPAL: "Hiệu trưởng",
    HR: "Phòng Nhân sự",
    TRAINING_DEPT: "Phòng Đào tạo",
    HEAD_OF_DEPT: "Trưởng khoa",
    INSTRUCTOR: "Giảng viên",
    STUDENT: "Sinh viên",
};

interface UserDetailModalProps {
    userId: number | null;
    isOpen: boolean;
    onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
    userId,
    isOpen,
    onClose,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!isOpen || !userId) return;

        const fetchDetail = async () => {
            setIsLoading(true);
            try {
                const data = await userService.getUserById(userId);
                setUser(data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết người dùng:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetail();
    }, [isOpen, userId]);

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return "—";
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

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
                onClick={handleContentClick}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 flex-1">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-sm font-medium text-gray-500">
                            Đang tải hồ sơ người dùng...
                        </p>
                    </div>
                ) : !user ? (
                    <div className="text-center py-16 flex-1">
                        <p className="text-gray-500 font-medium">
                            Không thể tải thông tin chi tiết của người dùng này.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-y-auto">
                        <div className="bg-gray-50/70 p-8 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center text-center">
                            <div className="relative mb-4">
                                {user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.username}
                                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                                    />
                                ) : (
                                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-md">
                                        {(user.fullName || user.username)
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                )}

                                <span
                                    className={clsx(
                                        "absolute bottom-0 right-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white border-2 border-white shadow-sm",
                                        user.isActive
                                            ? "bg-emerald-500"
                                            : "bg-red-500",
                                    )}
                                >
                                    {user.isActive ? "Active" : "Locked"}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
                                {user.fullName || "Chưa cập nhật tên"}
                            </h2>
                            <p className="text-sm text-gray-500 font-mono mt-0.5">
                                @{user.username}
                            </p>

                            <div className="flex flex-wrap justify-center gap-1.5 mt-4 w-full">
                                {user.roles?.map((roleCode) => (
                                    <span
                                        key={roleCode}
                                        className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-gray-200 text-gray-700 shadow-sm"
                                    >
                                        {ROLE_LABELS[roleCode] || roleCode}
                                    </span>
                                ))}
                            </div>

                            {!user.isActive && (
                                <div className="mt-6 w-full p-3 bg-red-50 border border-red-100 rounded-xl text-left">
                                    <div className="flex items-center gap-2 text-red-700 font-semibold text-xs uppercase tracking-wider">
                                        <Lock className="w-3.5 h-3.5" /> Lý do
                                        khóa tài khoản:
                                    </div>
                                    <p className="text-sm text-red-600 mt-1 italic">
                                        {user.lockReason ||
                                            "Không có lý do cụ thể được ghi nhận."}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="col-span-2 p-8 flex flex-col gap-8">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-gray-400" />{" "}
                                    Thông tin quản trị
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 bg-gray-50/40 p-3 rounded-lg border border-gray-100">
                                        <CheckCircle
                                            className={clsx(
                                                "w-5 h-5 shrink-0 mt-0.5",
                                                user.isActive
                                                    ? "text-emerald-500"
                                                    : "text-red-500",
                                            )}
                                        />
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">
                                                Trạng thái đăng nhập
                                            </p>
                                            <p className="text-sm font-semibold text-gray-800 mt-0.5">
                                                {user.isActive
                                                    ? "Được phép truy cập"
                                                    : "Bị từ chối truy cập"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 bg-gray-50/40 p-3 rounded-lg border border-gray-100">
                                        <Calendar className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">
                                                Ngày tài khoản được tạo
                                            </p>
                                            <p className="text-sm font-semibold text-gray-800 mt-0.5">
                                                {formatDate(user.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                    <UserIcon className="w-4 h-4 text-gray-400" />{" "}
                                    Lý lịch & Liên hệ cá nhân
                                </h3>

                                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                                    <div className="grid grid-cols-3 py-3.5 px-4 items-center">
                                        <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Mail className="w-4 h-4" /> Email
                                        </span>
                                        <span className="col-span-2 text-sm font-semibold text-gray-900 break-all">
                                            {user.email}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 py-3.5 px-4 items-center">
                                        <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Phone className="w-4 h-4" /> Số
                                            điện thoại
                                        </span>
                                        <span className="col-span-2 text-sm font-semibold text-gray-900">
                                            {user.phone || (
                                                <span className="text-gray-400 italic font-normal">
                                                    Chưa cập nhật
                                                </span>
                                            )}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 py-3.5 px-4 items-center">
                                        <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />{" "}
                                            Ngày sinh
                                        </span>
                                        <span className="col-span-2 text-sm font-semibold text-gray-900">
                                            {formatDate(user.birthday)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 py-3.5 px-4 items-center">
                                        <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Shield className="w-4 h-4" /> Giới
                                            tính
                                        </span>
                                        <span className="col-span-2 text-sm font-semibold text-gray-900">
                                            {user.gender === "MALE"
                                                ? "Nam"
                                                : user.gender === "FEMALE"
                                                  ? "Nữ"
                                                  : user.gender || (
                                                        <span className="text-gray-400 italic font-normal">
                                                            Chưa cập nhật
                                                        </span>
                                                    )}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 py-3.5 px-4 items-start">
                                        <span className="text-sm font-medium text-gray-400 flex items-center gap-2 mt-0.5">
                                            <MapPin className="w-4 h-4" /> Địa
                                            chỉ hiện tại
                                        </span>
                                        <span className="col-span-2 text-sm font-semibold text-gray-900 leading-relaxed">
                                            {user.address || (
                                                <span className="text-gray-400 italic font-normal">
                                                    Chưa cập nhật
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
