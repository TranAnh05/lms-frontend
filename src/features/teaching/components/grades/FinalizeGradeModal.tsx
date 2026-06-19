import React, { useState, useCallback, memo } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

interface FinalizeGradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

// Toi uu: Su dung React.memo de co dinh modal, tranh re-render theo component cha
export const FinalizeGradeModal: React.FC<FinalizeGradeModalProps> = memo(
    ({ isOpen, onClose, onConfirm }) => {
        const [isSubmitting, setIsSubmitting] = useState(false);

        // Toi uu: Boc useCallback de giu vung tham chieu phuong thuc submit
        const handleConfirm = useCallback(async () => {
            setIsSubmitting(true);
            try {
                await onConfirm();
                onClose();
            } catch (error) {
                console.error("Lỗi khi chốt điểm học phần:", error);
            } finally {
                // Toi uu: Sua lai thanh khoi finally dung chuan cu phap
                setIsSubmitting(false);
            }
        }, [onConfirm, onClose]);

        // Toi uu: Dat early return phia sau cac Hook de dam bao dung thu tu render trong React
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                {/* Bo sung lop phu backdrop ho tro click de tat modal an toan */}
                <div
                    className="absolute inset-0"
                    onClick={!isSubmitting ? onClose : undefined}
                />

                <div className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
                        <h2 className="text-lg font-bold text-gray-900">
                            Xác nhận chốt điểm
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 flex flex-col items-center text-center flex-1 overflow-y-auto">
                        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-rose-50/50 shrink-0">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            Bạn có chắc chắn muốn chốt điểm?
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Sau khi chốt điểm, toàn bộ dữ liệu sẽ được khóa và
                            gửi lên Phòng Đào tạo. Bạn sẽ{" "}
                            <strong className="text-rose-600">
                                không thể chỉnh sửa
                            </strong>{" "}
                            bất kỳ điểm số nào của học phần này nữa.
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none min-w-[150px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                "Đồng ý chốt điểm"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    },
);

FinalizeGradeModal.displayName = "FinalizeGradeModal";
