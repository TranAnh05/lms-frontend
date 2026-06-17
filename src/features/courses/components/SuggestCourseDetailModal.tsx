import React, { useEffect, useState, memo } from "react";
import {
    X,
    BookOpen,
    AlertCircle,
    CheckCircle2,
    XCircle,
    MessageSquare,
} from "lucide-react";
import clsx from "clsx";
import { toast } from "react-toastify";
import { type Course } from "../types";
import { courseService } from "../services/course.service";

const STATUS_UI_CONFIG: Record<string, { label: string; color: string }> = {
    approved: {
        label: "Đã duyệt",
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

// Sử dụng memo để tránh re-render InfoBlock không cần thiết
const InfoBlock = memo<{
    label: string;
    value: React.ReactNode;
    isFullWidth?: boolean;
}>(({ label, value, isFullWidth = false }) => (
    <div
        className={clsx(
            "flex flex-col gap-1.5 p-3 rounded-lg bg-gray-50/50 border border-gray-100",
            isFullWidth && "col-span-full",
        )}
    >
        <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider">
            {label}
        </div>
        <div className="text-sm font-semibold text-gray-900 break-words">
            {value || (
                <span className="text-gray-400 italic font-normal">
                    Chưa cập nhật
                </span>
            )}
        </div>
    </div>
));

InfoBlock.displayName = "InfoBlock";

// Tách riêng cụm xử lý Modal Từ chối để mã nguồn gọn gàng và cô lập re-render
interface RejectModalProps {
    isOpen: boolean;
    isProcessing: boolean;
    courseName?: string;
    reasonInput: string;
    onReasonChange: (val: string) => void;
    onClose: () => void;
    onConfirm: () => void;
}

const RejectModal: React.FC<RejectModalProps> = ({
    isOpen,
    isProcessing,
    courseName,
    reasonInput,
    onReasonChange,
    onClose,
    onConfirm,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="h-1.5 w-full bg-red-500"></div>
                <div className="p-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        Từ chối đề xuất
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Vui lòng cho biết lý do từ chối đề xuất môn học{" "}
                        <span className="font-semibold text-gray-700">
                            {courseName}
                        </span>
                        .
                    </p>
                </div>
                <div className="p-5">
                    <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none">
                            <MessageSquare className="h-4 w-4 text-gray-400" />
                        </div>
                        <textarea
                            autoFocus
                            rows={4}
                            placeholder="Nhập lý do chi tiết..."
                            value={reasonInput}
                            onChange={(e) => onReasonChange(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors custom-scrollbar"
                        />
                    </div>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-4 focus:ring-gray-100 disabled:opacity-50"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:ring-4 focus:ring-red-500/20 disabled:bg-red-400"
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Đang xử lý...
                            </>
                        ) : (
                            "Xác nhận từ chối"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface CourseDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: number | null;
    canApprove?: boolean;
    onSuccess?: () => void;
}

export const SuggestCourseDetailModal: React.FC<CourseDetailModalProps> = ({
    isOpen,
    onClose,
    courseId,
    canApprove = false,
    onSuccess,
}) => {
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
    const [rejectReasonInput, setRejectReasonInput] = useState<string>("");

    // Đồng bộ hóa dữ liệu và dọn dẹp bộ nhớ chống rò rỉ (Memory leak)
    useEffect(() => {
        let isCurrentRequest = true;
        let cleanupTimer: ReturnType<typeof setTimeout>;

        const fetchCourseDetail = async () => {
            if (!courseId) return;
            setIsLoading(true);
            try {
                const data = await courseService.getCourseById(courseId);
                if (isCurrentRequest) {
                    setCourse(data);
                }
            } catch (error) {
                console.error("Lỗi khi tải chi tiết môn học:", error);
                toast.error("Không thể lấy thông tin chi tiết môn học.");
                onClose();
            } finally {
                if (isCurrentRequest) {
                    setIsLoading(false);
                }
            }
        };

        if (isOpen) {
            fetchCourseDetail();
        } else {
            cleanupTimer = setTimeout(() => {
                if (isCurrentRequest) {
                    setCourse(null);
                    setIsRejectModalOpen(false);
                    setRejectReasonInput("");
                }
            }, 200);
        }

        return () => {
            isCurrentRequest = false;
            if (cleanupTimer) clearTimeout(cleanupTimer);
        };
    }, [isOpen, courseId, onClose]);

    const handleApprove = async () => {
        if (!courseId) return;

        setIsProcessing(true);
        try {
            await courseService.approveCourse({ courseId });
            toast.success("Đã phê duyệt đề xuất môn học thành công!");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Lỗi khi duyệt môn học:", error);
            toast.error("Đã xảy ra lỗi khi phê duyệt môn học.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleOpenRejectModal = () => {
        setRejectReasonInput("");
        setIsRejectModalOpen(true);
    };

    const handleConfirmReject = async () => {
        if (!courseId) return;

        const reason = rejectReasonInput.trim();
        if (!reason) {
            toast.warning("Bạn phải nhập lý do khi từ chối đề xuất!");
            return;
        }

        setIsProcessing(true);
        try {
            await courseService.rejectCourse({
                courseId,
                rejectReason: reason,
            });

            toast.success("Đã từ chối đề xuất môn học.");
            setIsRejectModalOpen(false);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Lỗi khi từ chối môn học:", error);
            toast.error("Đã xảy ra lỗi khi từ chối môn học.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    const statusKey = course?.status?.toLowerCase() || "pending";
    const statusConfig =
        STATUS_UI_CONFIG[statusKey] || STATUS_UI_CONFIG.pending;
    const isPendingStatus = statusKey === "pending";

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900/50 backdrop-blur-sm p-4">
                <div
                    className="absolute inset-0"
                    onClick={() => {
                        if (!isProcessing && !isRejectModalOpen) onClose();
                    }}
                ></div>

                <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            Chi tiết Đề xuất môn học
                        </h3>
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

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
                                {(course.rejectReason || course.lockReason) && (
                                    <div className="flex gap-3 p-4 bg-red-50 text-red-800 rounded-xl border border-red-100">
                                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                                        <div>
                                            <h4 className="font-semibold text-sm mb-1">
                                                Lưu ý quan trọng
                                            </h4>
                                            {course.rejectReason && (
                                                <p className="text-sm leading-relaxed">
                                                    <span className="font-medium">
                                                        Lý do từ chối:
                                                    </span>{" "}
                                                    {course.rejectReason}
                                                </p>
                                            )}
                                            {course.lockReason && (
                                                <p className="text-sm leading-relaxed mt-1">
                                                    <span className="font-medium">
                                                        Lý do khóa:
                                                    </span>{" "}
                                                    {course.lockReason}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InfoBlock
                                        label="Mã & Tên môn học"
                                        value={
                                            <div>
                                                <span className="text-blue-700 font-mono bg-blue-50 px-1.5 py-0.5 rounded text-xs border border-blue-100 mr-2">
                                                    {course.code}
                                                </span>
                                                {course.name}
                                            </div>
                                        }
                                    />
                                    <InfoBlock
                                        label="Đơn vị phụ trách"
                                        value={
                                            <div>{course.departmentName}</div>
                                        }
                                    />
                                    <InfoBlock
                                        label="Thời lượng đào tạo"
                                        value={`${course.credits} Tín chỉ (${course.theoreticalHours} LT - ${course.practicalHours} TH)`}
                                    />
                                    <InfoBlock
                                        label="Trạng thái"
                                        value={
                                            <span
                                                className={clsx(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border",
                                                    statusConfig.color,
                                                )}
                                            >
                                                {statusConfig.label}
                                            </span>
                                        }
                                    />
                                </div>

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

                    <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex items-center justify-end gap-3">
                        {canApprove && isPendingStatus && (
                            <div className="flex items-center gap-2 mr-auto">
                                <button
                                    onClick={handleOpenRejectModal}
                                    disabled={isProcessing}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors focus:ring-4 focus:ring-red-100 disabled:opacity-50"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Từ chối
                                </button>

                                <button
                                    onClick={handleApprove}
                                    disabled={isProcessing}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 transition-colors focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-50"
                                >
                                    {isProcessing ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <CheckCircle2 className="w-4 h-4" />
                                    )}
                                    Phê duyệt
                                </button>
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-4 focus:ring-gray-100 disabled:opacity-50"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>

            {/* Gọi Sub-component đã tách rời */}
            <RejectModal
                isOpen={isRejectModalOpen}
                isProcessing={isProcessing}
                courseName={course?.name}
                reasonInput={rejectReasonInput}
                onReasonChange={setRejectReasonInput}
                onClose={() => setIsRejectModalOpen(false)}
                onConfirm={handleConfirmReject}
            />
        </>
    );
};
