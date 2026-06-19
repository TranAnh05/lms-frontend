import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShieldCheck, AlertCircle, ArrowLeft, KeyRound } from "lucide-react";
import { toast } from "react-toastify";
import { AxiosError } from "axios"; 

import { authService } from "../services/auth.service";
import { ResetPasswordForm } from "../components/ResetPasswordForm";

export const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Kiểm tra tính hợp lệ sơ bộ của token trên URL
    const isTokenValid = useMemo(() => {
        return typeof token === "string" && token.trim().length > 10;
    }, [token]);

    const handleResetPassword = async (newPassword: string) => {
        if (!token) return;

        setIsLoading(true);
        try {
            await authService.resetPassword({ token, newPassword });
            setIsSuccess(true);
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMsg = axiosError.response?.data?.message || "Đã xảy ra lỗi. Đường dẫn có thể đã hết hạn.";
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-500">
                {!isTokenValid ? (
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-rose-200">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Liên kết không hợp lệ
                        </h2>
                        <p className="text-sm text-gray-500 leading-relaxed mb-8">
                            Đường dẫn đặt lại mật khẩu không tồn tại, bị thiếu hoặc đã hết hạn. Vui lòng yêu cầu cấp lại một đường dẫn mới.
                        </p>
                        <Link
                            to="/forgot-password"
                            className="w-full flex items-center justify-center py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                        >
                            Yêu cầu cấp lại mật khẩu
                        </Link>
                    </div>
                ) : isSuccess ? (
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-200">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Thiết lập thành công!
                        </h2>
                        <p className="text-sm text-gray-500 leading-relaxed mb-8">
                            Mật khẩu của bạn đã được đặt lại an toàn. Bạn có thể sử dụng mật khẩu mới này để đăng nhập vào hệ thống ngay bây giờ.
                        </p>
                        <Link
                            to="/login"
                            className="w-full flex items-center justify-center py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                        >
                            Tiến hành Đăng nhập
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                            <KeyRound className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Tạo mật khẩu mới
                        </h2>
                        <p className="text-sm text-gray-500 leading-relaxed mb-8">
                            Vui lòng thiết lập mật khẩu mới có độ bảo mật cao để bảo vệ tài khoản của bạn.
                        </p>

                        <ResetPasswordForm
                            onSubmit={handleResetPassword}
                            isLoading={isLoading}
                        />

                        <div className="mt-8 text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors focus:outline-none focus:underline"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Hủy và Quay lại Đăng nhập
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};