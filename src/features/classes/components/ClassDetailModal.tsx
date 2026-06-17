import React, { useEffect, memo } from "react";
import {
    X,
    BookOpen,
    User,
    Calendar,
    Users,
    MapPin,
    Clock,
    AlertCircle,
} from "lucide-react";
import clsx from "clsx";
import { type ClassDetailForStudentResponse } from "../types";

interface ClassDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    classDetail: ClassDetailForStudentResponse | null;
    isLoading?: boolean;
}

const STATUS_UI_CONFIG: Record<string, { label: string; style: string }> = {
    PENDING: {
        label: "Lên kế hoạch",
        style: "bg-gray-100 text-gray-700 border-gray-200",
    },
    REGISTRATION: {
        label: "Mở đăng ký",
        style: "bg-purple-50 text-purple-700 border-purple-200",
    },
    ONGOING: {
        label: "Đang diễn ra",
        style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    COMPLETED: {
        label: "Đã kết thúc",
        style: "bg-blue-50 text-blue-700 border-blue-200",
    },
    CANCELED: {
        label: "Đã hủy",
        style: "bg-red-50 text-red-700 border-red-200",
    },
};

// Định dạng thứ tự hiển thị ngày trong tuần thành object tĩnh
const DAY_OF_WEEK_MAP: Record<number, { prefix: string; suffix: string }> = {
    2: { prefix: "Thứ", suffix: "2" },
    3: { prefix: "Thứ", suffix: "3" },
    4: { prefix: "Thứ", suffix: "4" },
    5: { prefix: "Thứ", suffix: "5" },
    6: { prefix: "Thứ", suffix: "6" },
    7: { prefix: "Thứ", suffix: "7" },
    8: { prefix: "Chủ", suffix: "Nhật" },
};

// Hàm cắt chuỗi định dạng thời gian HH:mm tĩnh bảo mật an toàn dữ liệu đầu vào
const formatShortTime = (timeStr?: string): string => {
    if (!timeStr) return "00:00";
    return timeStr.length >= 5 ? timeStr.substring(0, 5) : timeStr;
};

export const ClassDetailModal: React.FC<ClassDetailModalProps> = memo(
    ({ isOpen, onClose, classDetail, isLoading = false }) => {
        // Đăng ký sự kiện nhấn phím Escape để đóng modal nhanh nâng cao trải nghiệm người dùng
        useEffect(() => {
            if (!isOpen) return;

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === "Escape") onClose();
            };

            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }, [isOpen, onClose]);

        if (!isOpen) return null;

        const statusConfig = classDetail
            ? STATUS_UI_CONFIG[classDetail.status]
            : null;
        const isCapacityFull = classDetail
            ? classDetail.currentStudents >= classDetail.maxStudents
            : false;

        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                {/* Lớp phủ nhấp ra ngoài để đóng */}
                <div className="absolute inset-0" onClick={onClose} />

                <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden">
                    {/* Tiêu đề cửa sổ */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            Chi tiết Lớp học phần
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nội dung chi tiết */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50/30">
                        {isLoading ? (
                            <div className="space-y-6 animate-pulse">
                                <div className="h-24 bg-gray-200 rounded-xl"></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-20 bg-gray-200 rounded-xl"></div>
                                    <div className="h-20 bg-gray-200 rounded-xl"></div>
                                </div>
                                <div className="h-32 bg-gray-200 rounded-xl"></div>
                            </div>
                        ) : !classDetail ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                <AlertCircle className="w-10 h-10 mb-2 text-gray-300" />
                                <p>Không thể tải thông tin chi tiết.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Khối 1: Thông tin môn học tổng quan */}
                                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-mono text-sm font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 shadow-sm">
                                                    {classDetail.classCode}
                                                </span>
                                                <span
                                                    className={clsx(
                                                        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border",
                                                        statusConfig?.style ||
                                                            "bg-gray-100 text-gray-700 border-gray-200",
                                                    )}
                                                >
                                                    {statusConfig?.label ||
                                                        classDetail.status}
                                                </span>
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900 leading-tight">
                                                {classDetail.courseName}
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-1.5 flex items-center gap-3">
                                                <span>
                                                    Mã môn:{" "}
                                                    <strong className="text-gray-700">
                                                        {classDetail.courseCode}
                                                    </strong>
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span>
                                                    Số tín chỉ:{" "}
                                                    <strong className="text-gray-700">
                                                        {classDetail.credits} TC
                                                    </strong>
                                                </span>
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-start sm:items-end bg-gray-50 p-3 rounded-xl border border-gray-100 min-w-[130px] shrink-0">
                                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5" />{" "}
                                                Sĩ số hiện tại
                                            </span>
                                            <div className="mt-1">
                                                <span
                                                    className={clsx(
                                                        "text-2xl font-black",
                                                        isCapacityFull
                                                            ? "text-rose-600"
                                                            : "text-blue-600",
                                                    )}
                                                >
                                                    {
                                                        classDetail.currentStudents
                                                    }
                                                </span>
                                                <span className="text-gray-400 mx-1.5">
                                                    /
                                                </span>
                                                <span className="text-gray-600 font-medium text-lg">
                                                    {classDetail.maxStudents}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Khối 2: Giảng viên phụ trách và Học kỳ */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
                                        <User className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                                Giảng viên phụ trách
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                                {classDetail.lecturerName ? (
                                                    classDetail.lecturerName
                                                ) : (
                                                    <span className="text-amber-600 italic">
                                                        Chưa phân công
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                                Học kỳ triển khai
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                                {classDetail.semesterCode}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Khối 3: Bảng thời khóa biểu cụ thể */}
                                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                                    <div className="bg-gray-50 border-b border-gray-100 px-5 py-3.5 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <h4 className="text-sm font-bold text-gray-800">
                                            Thời khóa biểu chi tiết
                                        </h4>
                                    </div>
                                    <div className="p-5">
                                        {!classDetail.schedules ||
                                        classDetail.schedules.length === 0 ? (
                                            <p className="text-sm text-gray-500 text-center py-6 italic bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                                                Lớp học phần này chưa được xếp
                                                lịch học.
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {classDetail.schedules.map(
                                                    (schedule, idx) => {
                                                        const dayConfig =
                                                            DAY_OF_WEEK_MAP[
                                                                schedule
                                                                    .dayOfWeek
                                                            ] || {
                                                                prefix: "Thứ",
                                                                suffix: String(
                                                                    schedule.dayOfWeek,
                                                                ),
                                                            };

                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="flex items-start gap-3 p-3.5 border border-blue-100 bg-blue-50/40 rounded-xl hover:border-blue-300 transition-colors"
                                                            >
                                                                <div className="flex flex-col items-center justify-center bg-white border border-blue-200 rounded-lg w-12 h-12 shrink-0 shadow-sm">
                                                                    <span className="text-[9px] font-bold text-gray-400 uppercase leading-none">
                                                                        {
                                                                            dayConfig.prefix
                                                                        }
                                                                    </span>
                                                                    <span className="text-base font-black text-blue-700 leading-tight mt-0.5">
                                                                        {
                                                                            dayConfig.suffix
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                                                                        {
                                                                            schedule.shiftName
                                                                        }
                                                                        <span className="font-medium text-gray-500 text-xs bg-white px-1.5 py-0.5 rounded border border-gray-100 shadow-sm">
                                                                            {formatShortTime(
                                                                                schedule.startTime,
                                                                            )}{" "}
                                                                            -{" "}
                                                                            {formatShortTime(
                                                                                schedule.endTime,
                                                                            )}
                                                                        </span>
                                                                    </p>
                                                                    <div className="flex items-center gap-1.5 mt-2 text-xs">
                                                                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                                                        <p
                                                                            className="font-medium text-gray-700 truncate"
                                                                            title={
                                                                                schedule.roomName
                                                                            }
                                                                        >
                                                                            Phòng{" "}
                                                                            {
                                                                                schedule.roomName
                                                                            }
                                                                            <span className="text-gray-400 font-normal ml-1">
                                                                                (
                                                                                {schedule.roomType ===
                                                                                "LAB"
                                                                                    ? "Thực hành"
                                                                                    : "Lý thuyết"}
                                                                                )
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chân trang đóng modal */}
                    <div className="p-5 border-t border-gray-100 bg-gray-50/80 flex justify-end shrink-0">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors focus:ring-4 focus:ring-gray-100 focus:outline-none"
                        >
                            Đóng cửa sổ
                        </button>
                    </div>
                </div>
            </div>
        );
    },
);

ClassDetailModal.displayName = "ClassDetailModal";
