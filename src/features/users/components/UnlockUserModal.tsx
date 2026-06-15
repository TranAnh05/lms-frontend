import React, { useState } from "react";
import { X, Unlock, Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { userService } from "../services/user.service";

interface UnlockUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userId: number | null;
}

export const UnlockUserModal: React.FC<UnlockUserModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    userId,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !userId) return null;

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            await userService.unlockUser(userId);
            toast.success("Mở khóa tài khoản thành công!");
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Lỗi khi mở khóa tài khoản:", err);
            const errorMsg =
                err.response?.data?.message ||
                "Không thể mở khóa tài khoản. Vui lòng thử lại sau.";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="absolute inset-0"
                onClick={!isSubmitting ? onClose : undefined}
            ></div>

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-100 bg-emerald-50/50">
                    <h2 className="text-base font-bold text-emerald-700 flex items-center gap-2">
                        <Unlock className="w-5 h-5" />
                        Xác nhận mở khóa tài khoản
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors focus:outline-none disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 text-sm text-blue-800">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
                        <p className="leading-relaxed">
                            Bạn đang thực hiện thao tác mở khóa cho người dùng.
                            Tài khoản này sẽ có thể đăng nhập và sử dụng hệ
                            thống bình thường trở lại.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none disabled:opacity-50"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:bg-emerald-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>Xác nhận Mở khóa</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
