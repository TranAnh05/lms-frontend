import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import clsx from "clsx";
import { Link } from "react-router-dom";

const loginSchema = z.object({
    username: z
        .string()
        .min(1, "Vui lòng nhập tên đăng nhập")
        .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    password: z
        .string()
        .min(1, "Vui lòng nhập mật khẩu")
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => void;
    isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    onSubmit,
    isLoading,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 w-full max-w-sm"
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-blue-900">Đăng Nhập</h2>
                <p className="text-sm text-gray-500 mt-2">
                    Hệ thống quản lý đào tạo LMS
                </p>
            </div>

            <div className="space-y-1">
                <label
                    htmlFor="username"
                    className="block text-sm font-medium text-blue-900"
                >
                    Tên đăng nhập
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="username"
                        type="text"
                        placeholder="Ví dụ: admin, GV001..."
                        disabled={isLoading}
                        className={clsx(
                            "block w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm transition-colors",
                            "focus:outline-none focus:ring-2 focus:border-transparent",
                            errors.username
                                ? "border-red-500 focus:ring-red-200"
                                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
                            isLoading &&
                                "bg-gray-100 text-gray-400 cursor-not-allowed",
                        )}
                        {...register("username")}
                    />
                </div>
                {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.username.message}
                    </p>
                )}
            </div>

            <div className="space-y-1">
                <div className="flex justify-between items-center">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-blue-900"
                    >
                        Mật khẩu
                    </label>
                    <Link
                        to="/forgot-password"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        Quên mật khẩu?
                    </Link>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className={clsx(
                            "block w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm transition-colors",
                            "focus:outline-none focus:ring-2 focus:border-transparent",
                            errors.password
                                ? "border-red-500 focus:ring-red-200"
                                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
                            isLoading &&
                                "bg-gray-100 text-gray-400 cursor-not-allowed",
                        )}
                        {...register("password")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 focus:outline-none disabled:opacity-50"
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={clsx(
                    "w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all",
                    isLoading && "opacity-75 cursor-not-allowed",
                )}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                        Đang đăng nhập...
                    </>
                ) : (
                    "Đăng Nhập"
                )}
            </button>
        </form>
    );
};
