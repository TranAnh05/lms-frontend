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
    Briefcase,
    GraduationCap,
    Edit2
} from "lucide-react";
import { type User } from "../types";
import { userService } from "../services/user.service";
import clsx from "clsx";

// Dua cau hinh UI ra ngoai component
const ROLE_LABELS: Record<string, string> = {
    ADMIN: "Quản trị viên",
    PRINCIPAL: "Hiệu trưởng",
    HR: "Phòng Nhân sự",
    TRAINING_DEPT: "Phòng Đào tạo",
    HEAD_OF_DEPT: "Trưởng khoa",
    INSTRUCTOR: "Giảng viên",
    STUDENT: "Sinh viên",
};

const STUDENT_STATUS_LABELS: Record<string, string> = {
    STUDYING: "Đang học",
    RESERVED: "Bảo lưu",
    SUSPENDED: "Đình chỉ",
    GRADUATED: "Đã tốt nghiệp",
    DROPPED_OUT: "Thôi học",
};

// Toi uu: Dua ham xu ly chuoi ra ngoai vong doi render
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

interface UserDetailModalProps {
    userId: number | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (userId: number) => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
    userId,
    isOpen,
    onClose,
    onEdit,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!isOpen || !userId) return;

        // Su dung AbortController de chan loi update state tren component da unmount
        const abortController = new AbortController();

        const fetchDetail = async () => {
            setIsLoading(true);
            try {
                const data = await userService.getUserById(userId);
                if (!abortController.signal.aborted) {
                    setUser(data);
                }
            } catch (error) {
                if (!abortController.signal.aborted) {
                    console.error("Lỗi khi tải chi tiết người dùng:", error);
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchDetail();

        return () => {
            abortController.abort();
            setUser(null); // Xoa du lieu rac khi dong modal
        };
    }, [isOpen, userId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
            {/* Toi uu: Lop Overlay de chan click ra ngoai, thay the e.stopPropagation() */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in fade-in zoom-in-95 duration-200 z-10">
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                    {!isLoading && user && (
                        <button
                            onClick={() => {
                                onEdit(user.id);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Chỉnh sửa</span>
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 flex-1">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-sm font-medium text-gray-500 animate-pulse">
                            Đang tải hồ sơ người dùng...
                        </p>
                    </div>
                ) : !user ? (
                    <div className="text-center py-16 flex-1 flex flex-col items-center justify-center">
                        <UserIcon className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">
                            Không thể tải thông tin chi tiết của người dùng này.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-y-auto mt-2 sm:mt-0 custom-scrollbar">
                        {/* Cot Trai: Avatar va Role */}
                        <div className="bg-gray-50/70 p-8 pt-12 sm:pt-8 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center text-center">
                            <div className="relative mb-4">
                                {user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.username}
                                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                                    />
                                ) : (
                                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-md">
                                        {(user.fullName || user.username).charAt(0).toUpperCase()}
                                    </div>
                                )}

                                <span
                                    className={clsx(
                                        "absolute bottom-0 right-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white border-2 border-white shadow-sm",
                                        user.isActive ? "bg-emerald-500" : "bg-red-500"
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
                                        <Lock className="w-3.5 h-3.5" /> Lý do khóa tài khoản:
                                    </div>
                                    <p className="text-sm text-red-600 mt-1 italic">
                                        {user.lockReason || "Không có lý do cụ thể được ghi nhận."}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Cot Phai: Thong tin chi tiet */}
                        <div className="col-span-2 p-8 flex flex-col gap-8">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-gray-400" /> Thông tin quản trị
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 bg-gray-50/40 p-3 rounded-lg border border-gray-100">
                                        <CheckCircle
                                            className={clsx(
                                                "w-5 h-5 shrink-0 mt-0.5",
                                                user.isActive ? "text-emerald-500" : "text-red-500"
                                            )}
                                        />
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">Trạng thái đăng nhập</p>
                                            <p className="text-sm font-semibold text-gray-800 mt-0.5">
                                                {user.isActive ? "Được phép truy cập" : "Bị từ chối truy cập"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 bg-gray-50/40 p-3 rounded-lg border border-gray-100">
                                        <Calendar className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">Ngày tài khoản được tạo</p>
                                            <p className="text-sm font-semibold text-gray-800 mt-0.5">
                                                {formatDate(user.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                    <UserIcon className="w-4 h-4 text-gray-400" /> Lý lịch & Liên hệ cá nhân
                                </h3>
                                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                                    <div className="grid grid-cols-3 py-3.5 px-4 items-center hover:bg-gray-50 transition-colors">
                                        <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Mail className="w-4 h-4" /> Email
                                        </span>
                                        <span className="col-span-2 text-sm font-semibold text-gray-900 break-all">
                                            {user.email}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 py-3.5 px-4 items-center hover:bg-gray-50 transition-colors">
                                        <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Phone className="w-4 h-4" /> Số điện thoại
                                        </span>
                                        <span className="col-span-2 text-sm font-semibold text-gray-900">
                                            {user.phone || <span className="text-gray-400 italic font-normal">Chưa cập nhật</span>}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 py-3.5 px-4 items-center hover:bg-gray-50 transition-colors">
                                        <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> Ngày sinh
                                        </span>
                                        <span className="col-span-2 text-sm font-semibold text-gray-900">
                                            {formatDate(user.birthday)}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 py-3.5 px-4 items-center hover:bg-gray-50 transition-colors">
                                        <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Shield className="w-4 h-4" /> Giới tính
                                        </span>
                                        <span className="col-span-2 text-sm font-semibold text-gray-900">
                                            {user.gender === "MALE" ? "Nam" : user.gender === "FEMALE" ? "Nữ" : user.gender || <span className="text-gray-400 italic font-normal">Chưa cập nhật</span>}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 py-3.5 px-4 items-start hover:bg-gray-50 transition-colors">
                                        <span className="text-sm font-medium text-gray-400 flex items-center gap-2 mt-0.5">
                                            <MapPin className="w-4 h-4" /> Địa chỉ hiện tại
                                        </span>
                                        <span className="col-span-2 text-sm font-semibold text-gray-900 leading-relaxed">
                                            {user.address || <span className="text-gray-400 italic font-normal">Chưa cập nhật</span>}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {user.employeeCode && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-gray-400" /> Thông tin Giảng viên
                                    </h3>
                                    <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 bg-blue-50/20">
                                        <div className="grid grid-cols-3 py-3.5 px-4 items-center hover:bg-blue-50/40 transition-colors">
                                            <span className="text-sm font-medium text-gray-500">Mã giảng viên</span>
                                            <span className="col-span-2 text-sm font-bold text-blue-700 font-mono">
                                                {user.employeeCode}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 py-3.5 px-4 items-center hover:bg-blue-50/40 transition-colors">
                                            <span className="text-sm font-medium text-gray-500">Khoa</span>
                                            <span className="col-span-2 text-sm font-semibold text-gray-900">
                                                {user.departmentName || "—"}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 py-3.5 px-4 items-center hover:bg-blue-50/40 transition-colors">
                                            <span className="text-sm font-medium text-gray-500">Học hàm</span>
                                            <span className="col-span-2 text-sm font-semibold text-gray-900">
                                                {user.academicTitle || "—"}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 py-3.5 px-4 items-center hover:bg-blue-50/40 transition-colors">
                                            <span className="text-sm font-medium text-gray-500">Chuyên môn</span>
                                            <span className="col-span-2 text-sm font-semibold text-gray-900">
                                                {user.specialization || "—"}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 py-3.5 px-4 items-center hover:bg-blue-50/40 transition-colors">
                                            <span className="text-sm font-medium text-gray-500">Loại hợp đồng</span>
                                            <span className="col-span-2 text-sm font-semibold text-gray-900">
                                                {user.isVisiting === true ? "Giảng viên thỉnh giảng" : user.isVisiting === false ? "Biên chế" : "—"}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 py-3.5 px-4 items-center hover:bg-blue-50/40 transition-colors">
                                            <span className="text-sm font-medium text-gray-500">Ngày tuyển dụng</span>
                                            <span className="col-span-2 text-sm font-semibold text-gray-900">
                                                {formatDate(user.hireDate)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {user.studentCode && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-gray-400" /> Thông tin sinh viên
                                    </h3>
                                    <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 bg-emerald-50/20">
                                        <div className="grid grid-cols-3 py-3.5 px-4 items-center hover:bg-emerald-50/40 transition-colors">
                                            <span className="text-sm font-medium text-gray-500">Mã sinh viên</span>
                                            <span className="col-span-2 text-sm font-bold text-emerald-700 font-mono">
                                                {user.studentCode}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 py-3.5 px-4 items-center hover:bg-emerald-50/40 transition-colors">
                                            <span className="text-sm font-medium text-gray-500">Khóa học</span>
                                            <span className="col-span-2 text-sm font-semibold text-gray-900">
                                                {user.cohort ? `Khóa ${user.cohort}` : "—"}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 py-3.5 px-4 items-center hover:bg-emerald-50/40 transition-colors">
                                            <span className="text-sm font-medium text-gray-500">Ngành học</span>
                                            <span className="col-span-2 text-sm font-semibold text-gray-900">
                                                {user.majorName ? `${user.majorName} (${user.majorCode})` : "—"}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 py-3.5 px-4 items-center hover:bg-emerald-50/40 transition-colors">
                                            <span className="text-sm font-medium text-gray-500">Trạng thái</span>
                                            <span className="col-span-2">
                                                <span className={clsx(
                                                    "px-2 py-0.5 rounded text-xs font-bold tracking-wide",
                                                    user.studentStatus === 'STUDYING' ? "bg-emerald-100 text-emerald-700" :
                                                    user.studentStatus === 'RESERVED' ? "bg-amber-100 text-amber-700" :
                                                    user.studentStatus === 'SUSPENDED' ? "bg-rose-100 text-rose-700" :
                                                    "bg-gray-100 text-gray-700"
                                                )}>
                                                    {STUDENT_STATUS_LABELS[user.studentStatus || ''] || user.studentStatus || "—"}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};