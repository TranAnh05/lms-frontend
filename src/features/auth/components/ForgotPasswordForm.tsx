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
    });

    // Xử lý gửi form (chặn gọi hàm nếu đang loading)
    const handleFormSubmit = async (data: ForgotPasswordFormData) => {
        if (isLoading) return;
        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Địa chỉ Email 
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="email"
                        placeholder="VD: tranan@gmail.com"
                        disabled={isLoading}
                        {...register("email")}
                        className={clsx(
                            "block w-full pl-11 pr-4 py-3 sm:text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:text-gray-500",
                            errors.email
                                ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
                        )}
                    />
                </div>
                {errors.email && (
                    <p className="mt-1.5 text-xs text-rose-600 font-medium">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-sm"
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