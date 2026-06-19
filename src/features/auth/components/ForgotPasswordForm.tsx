import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Loader2, ArrowRight } from "lucide-react";
import clsx from "clsx";
import { type ForgotPasswordPayload } from "../types";

const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Vui lòng nhập địa chỉ email")
        .email("Email không đúng định dạng"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
    onSubmit: (data: ForgotPasswordPayload) => Promise<void>;
    isLoading?: boolean;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    onSubmit,
    isLoading = false,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onBlur", 
    });

    const handleFormSubmit = async (data: ForgotPasswordFormData) => {
        if (isLoading) return;
        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5" noValidate>
            <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    Địa chỉ Email 
                </label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className={clsx("h-5 w-5 transition-colors", errors.email ? "text-rose-400" : "text-gray-400 group-focus-within:text-blue-500")} />
                    </div>
                    <input
                        id="email"
                        type="email"
                        placeholder="VD: tranan@gmail.com"
                        disabled={isLoading}
                        autoComplete="email" 
                        aria-invalid={errors.email ? "true" : "false"} 
                        {...register("email")}
                        className={clsx(
                            "block w-full pl-11 pr-4 py-3 sm:text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
                            errors.email
                                ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
                        )}
                    />
                </div>
                {errors.email && (
                    <p className="text-xs text-rose-600 font-medium animate-in fade-in slide-in-from-top-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang gửi yêu cầu...</span>
                    </>
                ) : (
                    <>
                        <span>Gửi liên kết đặt lại mật khẩu</span>
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>
        </form>
    );
};