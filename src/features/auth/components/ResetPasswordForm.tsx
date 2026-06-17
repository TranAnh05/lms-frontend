import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const resetPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(8, "Mật khẩu mới phải chứa ít nhất 8 ký tự")
        .regex(
            PASSWORD_REGEX,
            "Mật khẩu phải bao gồm ít nhất: 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
        ),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
    onSubmit: (newPassword: string) => Promise<void>;
    isLoading?: boolean;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
    onSubmit,
    isLoading = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onBlur", 
    });

    const handleFormSubmit = async (data: ResetPasswordFormData) => {
        if (isLoading) return;
        await onSubmit(data.newPassword);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5" noValidate>
            <div className="space-y-1.5">
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">
                    Mật khẩu mới
                </label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className={clsx("h-5 w-5 transition-colors", errors.newPassword ? "text-rose-400" : "text-gray-400 group-focus-within:text-blue-500")} />
                    </div>
                    <input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Tối thiểu 8 ký tự"
                        disabled={isLoading}
                        autoComplete="new-password" 
                        aria-invalid={errors.newPassword ? "true" : "false"}
                        {...register("newPassword")}
                        className={clsx(
                            "block w-full pl-11 pr-11 py-3 sm:text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
                            errors.newPassword
                                ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
                        )}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        tabIndex={-1} 
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-blue-600 focus:outline-none transition-colors disabled:opacity-50"
                        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
                {errors.newPassword && (
                    <p className="mt-1.5 text-xs text-rose-600 font-medium animate-in fade-in slide-in-from-top-1">
                        {errors.newPassword.message}
                    </p>
                )}
            </div>
            
            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-sm mt-2 active:scale-[0.98]"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang thiết lập...</span>
                    </>
                ) : (
                    <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Xác nhận đổi mật khẩu</span>
                    </>
                )}
            </button>
        </form>
    );
};