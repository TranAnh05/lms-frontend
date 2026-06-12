/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { X, Lock, Key, Loader2, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import clsx from "clsx";
import { profileService } from "../services/profile.service";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/;

const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z
        .string()
        .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
        .regex(
            passwordRegex,
            "Mật khẩu phải bao gồm cả chữ số, chữ hoa, chữ thường và ký tự đặc biệt (!@#...)"
        ),
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordForm>({
        resolver: zodResolver(changePasswordSchema),
    });

    const handleClose = () => {
        reset(); 
        setShowOld(false);
        setShowNew(false);
        onClose();
    };

    const onSubmit = async (data: ChangePasswordForm) => {
        setIsSubmitting(true);
        try {
            await profileService.changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            });
            
            toast.success("Đổi mật khẩu thành công!");
            handleClose();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi đổi mật khẩu.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={handleClose}></div>

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Key className="w-5 h-5 text-blue-600" />
                        Đổi mật khẩu
                    </h3>
                    <button
                        onClick={handleClose}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    <div className="p-6 space-y-5">
                        
                        {/* Mật khẩu hiện tại */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu hiện tại</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type={showOld ? "text" : "password"}
                                    placeholder="Nhập mật khẩu hiện tại"
                                    className={clsx(
                                        "w-full pl-9 pr-10 py-2.5 bg-white border rounded-xl outline-none transition-colors focus:ring-2 text-sm font-medium",
                                        errors.oldPassword ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20" : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                                    )}
                                    {...register("oldPassword")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOld(!showOld)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.oldPassword && (
                                <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.oldPassword.message}</p>
                            )}
                        </div>

                        {/* Mật khẩu mới */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu mới</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Key className="w-4 h-4" />
                                </div>
                                <input
                                    type={showNew ? "text" : "password"}
                                    placeholder="Ít nhất 8 ký tự"
                                    className={clsx(
                                        "w-full pl-9 pr-10 py-2.5 bg-white border rounded-xl outline-none transition-colors focus:ring-2 text-sm font-medium",
                                        errors.newPassword ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20" : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                                    )}
                                    {...register("newPassword")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.newPassword.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-gray-100 bg-gray-50/80 flex items-center justify-end gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm focus:outline-none flex items-center justify-center min-w-[130px]"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Cập nhật"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};