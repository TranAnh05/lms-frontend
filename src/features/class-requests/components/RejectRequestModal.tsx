import React, { useState, useEffect } from "react";
import { X, AlertTriangle, Ban } from "lucide-react";
import { type ClassRequestResponse } from "../types";

interface RejectRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (requestId: number, reason: string) => Promise<void>;
    request: ClassRequestResponse | null;
}

export const RejectRequestModal: React.FC<RejectRequestModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    request,
}) => {
    const [reason, setReason] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            setReason("");
        }
    }, [isOpen, request]);

    if (!isOpen || !request) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!reason.trim()) return;

        setIsSubmitting(true);
        try {
            await onConfirm(request.id, reason.trim());
            onClose();
        } catch (error) {
            console.error("Lỗi khi từ chối đề xuất:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isSubmitDisabled = !reason.trim() || isSubmitting;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="absolute inset-0"
                onClick={!isSubmitting ? onClose : undefined}
            ></div>
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100">
                <div className="flex items-center justify-between p-4 border-b border-gray-150 bg-rose-50/40 rounded-t-xl">
                    <h3 className="text-sm font-bold text-rose-700 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        Xác nhận Từ chối Đề xuất
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none disabled:opacity-50"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="p-5 flex flex-col gap-4">
                        <div className="text-sm text-gray-600 leading-relaxed">
                            Bạn đang thực hiện từ chối đề xuất mở lớp học phần
                            môn{" "}
                            <strong className="text-gray-900">
                                {request.course.name}
                            </strong>{" "}
                            ({request.course.code}) thuộc học kỳ{" "}
                            <strong className="text-gray-900">
                                {request.semester.semesterCode}
                            </strong>
                            .
                        </div>

                        {/* Ô nhập lý do */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                                Lý do từ chối{" "}
                                <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                disabled={isSubmitting}
                                placeholder="Vui lòng nhập lý do từ chối chi tiết (Ví dụ: Trùng lịch, Thiếu giảng viên, Đã gộp lớp...)"
                                rows={4}
                                maxLength={500}
                                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none disabled:bg-gray-50"
                            />
                            <div className="flex justify-end">
                                <span className="text-[11px] text-gray-400 font-medium">
                                    {reason.length}/500 ký tự
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50/80 rounded-b-xl flex justify-end gap-3.5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors focus:outline-none shadow-sm disabled:bg-rose-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <Ban className="w-3.5 h-3.5" />
                                    Từ chối đề xuất
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
