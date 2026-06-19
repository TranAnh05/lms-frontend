/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { X, Lock, Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { userService } from "../services/user.service";
import clsx from "clsx";

interface LockUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userId: number | null;
}

export const LockUserModal: React.FC<LockUserModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    userId,
}) => {
    const [lockReason, setLockReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Toi uu: Reset form gon gang moi khi modal mo len
    useEffect(() => {
        if (isOpen) {
            setLockReason("");
            setError("");
            setIsSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen || !userId) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const reason = lockReason.trim();

        if (!reason) {
            setError("Vui lòng nhập lý do khóa tài khoản.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            await userService.lockUser(userId, { lockReason: reason });
            toast.success("Khóa tài khoản thành công!");
            onSuccess();
            onClose();
        } catch (err: unknown) {
            // Toi uu: Xu ly bat loi dung chuan TypeScript
            const axiosError = err as AxiosError<{ message: string }>;
            const errorMsg = axiosError.response?.data?.message || "Không thể khóa tài khoản. Vui lòng thử lại sau.";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Toi uu: Lop phu (Backdrop) ngan tuong tac */}
            <div
                className="absolute inset-0"
                onClick={!isSubmitting ? onClose : undefined}
            />

            <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-rose-50/50">
                    <h2 className="text-base font-bold text-rose-700 flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Khóa tài khoản người dùng
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors focus:outline-none disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body - Form */}
                <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
                    <div className="p-6">
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-3 text-sm text-amber-800">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                            <p className="leading-relaxed">
                                Hành động này sẽ ngay lập tức chặn người dùng
                                đăng nhập vào hệ thống. Bạn cần cung cấp lý do
                                cụ thể.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">
                                Lý do khóa <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                value={lockReason}
                                onChange={(e) => {
                                    setLockReason(e.target.value);
                                    if (error) setError("");
                                }}
                                disabled={isSubmitting}
                                placeholder="Nhập lý do chi tiết..."
                                rows={4}
                                className={clsx(
                                    "w-full px-4 py-3 bg-white border rounded-xl outline-none transition-colors resize-none disabled:bg-gray-50 text-sm",
                                    error
                                        ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                        : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
                                )}
                            />
                            {error && (
                                <p className="text-xs font-medium text-rose-600 mt-1">
                                    {error}
                                </p>
                            )}
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
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-rose-500/20 disabled:bg-rose-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                "Xác nhận Khóa"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};