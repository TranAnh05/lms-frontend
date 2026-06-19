import React, { useEffect, useState, memo } from "react";
import { X, BookOpen, AlertCircle } from "lucide-react";
import clsx from "clsx";
import { toast } from "react-toastify";
import { type Course } from "../types";
import { courseService } from "../services/course.service";

const STATUS_UI_CONFIG: Record<string, { label: string; color: string }> = {
    approved: {
        label: "Đang hoạt động",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    pending: {
        label: "Chờ duyệt",
        color: "text-amber-700 bg-amber-50 border-amber-200",
    },
    rejected: {
        label: "Bị Từ chối",
        color: "text-red-700 bg-red-50 border-red-200",
    },
};

interface InfoBlockProps {
    label: string;
    value: React.ReactNode;
    isFullWidth?: boolean;
}

// Khối hiển thị thông tin chi tiết (đã tối ưu render)
const InfoBlock: React.FC<InfoBlockProps> = memo(({ label, value, isFullWidth = false }) => (
    <div
        className={clsx(
            "flex flex-col gap-1.5 p-3 rounded-lg bg-gray-50/50 border border-gray-100",
            isFullWidth && "col-span-full"
        )}
    >
        <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider">
            {label}
        </div>
        <div className="text-sm font-semibold text-gray-900 break-words">
            {value || <span className="text-gray-400 italic font-normal">Chưa cập nhật</span>}
        </div>
    </div>
));

InfoBlock.displayName = "InfoBlock";

interface CourseDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: number | null;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
    isOpen,
    onClose,
    courseId,
}) => {
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
    let isCurrent = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const fetchCourseDetail = async () => {
        if (!courseId) return;

        setIsLoading(true);
        try {
            const data = await courseService.getCourseById(courseId);
            if (isCurrent) {
                setCourse(data);
            }
        } catch (error) {
            console.error("Lỗi khi tải chi tiết môn học:", error);
            toast.error("Không thể lấy thông tin chi tiết môn học.");
            if (isCurrent) {
                onClose();
            }
        } finally {
            if (isCurrent) {
                setIsLoading(false);
            }
        }
    };

    if (isOpen) {
        fetchCourseDetail();
    } else {
        timeoutId = setTimeout(() => {
            if (isCurrent) {
                setCourse(null);
            }
        }, 200);
    }

    return () => {
        isCurrent = false;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };
}, [isOpen, courseId, onClose]);

    if (!isOpen) return null;

    // Tránh lỗi ứng dụng nếu dữ liệu status không khớp hệ thống cấu hình UI
    const statusConfig = STATUS_UI_CONFIG[course?.status?.toLowerCase() || ""] || STATUS_UI_CONFIG.pending;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900/50 backdrop-blur-sm p-4">
            <div className="absolute inset-0" onClick={onClose}></div>
            
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                {/* HEADER */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        Chi tiết Môn học
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* BODY */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {isLoading || !course ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-medium text-blue-600 animate-pulse">
                                Đang tải dữ liệu...
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {/* Hiển thị lý do khóa/từ chối từ quản trị viên */}
                            {(course.rejectReason || course.lockReason) && (
                                <div className="flex gap-3 p-4 bg-red-50 text-red-800 rounded-xl border border-red-100">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                                    <div>
                                        <h4 className="font-semibold text-sm mb-1">Lưu ý quan trọng</h4>
                                        {course.rejectReason && (
                                            <p className="text-sm leading-relaxed">
                                                <span className="font-medium">Lý do từ chối:</span> {course.rejectReason}
                                            </p>
                                        )}
                                        {course.lockReason && (
                                            <p className="text-sm leading-relaxed mt-1">
                                                <span className="font-medium">Lý do khóa:</span> {course.lockReason}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Khu vực lưới thông tin cơ bản */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InfoBlock
                                    label="Mã & Tên môn học"
                                    value={
                                        <div className="flex items-center flex-wrap gap-y-1">
                                            <span className="text-blue-700 font-mono bg-blue-50 px-1.5 py-0.5 rounded text-xs border border-blue-100 mr-2 shrink-0">
                                                {course.code}
                                            </span>
                                            <span className="break-all">{course.name}</span>
                                        </div>
                                    }
                                />
                                <InfoBlock
                                    label="Đơn vị phụ trách"
                                    value={course.departmentName}
                                />
                                <InfoBlock
                                    label="Thời lượng đào tạo"
                                    value={`${course.credits} Tín chỉ (${course.theoreticalHours} LT - ${course.practicalHours} TH)`}
                                />
                                <InfoBlock
                                    label="Trạng thái"
                                    value={
                                        <span className={clsx(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border font-medium",
                                            statusConfig.color
                                        )}>
                                            {statusConfig.label}
                                        </span>
                                    }
                                />
                            </div>

                            {/* Khối mô tả môn học */}
                            <div className="border-t border-gray-100 pt-5">
                                <InfoBlock
                                    isFullWidth
                                    label="Mô tả môn học"
                                    value={
                                        <p className="text-sm text-gray-700 leading-relaxed font-normal whitespace-pre-wrap">
                                            {course.description}
                                        </p>
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-4 focus:ring-gray-100"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};