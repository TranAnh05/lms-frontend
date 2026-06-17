import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, KeyRound, MailCheck } from "lucide-react";
import { toast } from "react-toastify";
import { AxiosError } from "axios"; 

import { authService } from "../services/auth.service";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import { type ForgotPasswordPayload } from "../types";

export const ForgotPasswordPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState("");

    const handleForgotPassword = async (data: ForgotPasswordPayload) => {
        setIsLoading(true);
        try {
            await authService.forgotPassword(data);
            setSubmittedEmail(data.email);
            setIsSuccess(true);
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMsg = axiosError.response?.data?.message || "Không thể gửi yêu cầu. Vui lòng thử lại sau.";
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-500">
                {isSuccess ? (
                    // UI: Thông báo gửi Email thành công
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-200">
                            <MailCheck className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Kiểm tra hòm thư của bạn
                        </h2>
                        <p className="text-sm text-gray-500 leading-relaxed mb-8">
                            Chúng tôi đã gửi một liên kết đặt lại mật khẩu an toàn đến email{" "}
                            <span className="font-semibold text-gray-800">{submittedEmail}</span>. 
                            Vui lòng kiểm tra cả thư mục Spam nếu không tìm thấy.
                        </p>
                        <Link
                            to="/login"
                            className="w-full flex items-center justify-center py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all focus:ring-4 focus:ring-blue-500/20 shadow-sm"
                        >
                            Quay lại Đăng nhập
                        </Link>
                    </div>
                ) : (
                    // UI: Form nhập Email yêu cầu
                    <div className="flex flex-col">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                            <KeyRound className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Quên mật khẩu?
                        </h2>
                        <p className="text-sm text-gray-500 leading-relaxed mb-8">
                            Đừng lo lắng! Hãy nhập địa chỉ email liên kết với tài khoản của bạn, chúng tôi sẽ gửi mã hướng dẫn khôi phục truy cập.
                        </p>

                        <ForgotPasswordForm
                            onSubmit={handleForgotPassword}
                            isLoading={isLoading}
                        />

                        <div className="mt-8 text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại trang Đăng nhập
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};