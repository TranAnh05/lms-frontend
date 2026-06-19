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
        .min(4, "Tên đăng nhập phải có ít nhất 4 ký tự"),
    password: z
        .string()
        .min(1, "Vui lòng nhập mật khẩu")
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => void;
    isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur", 
    });

    const inputBaseClass = "block w-full pl-10 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm" noValidate>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-blue-900">Đăng Nhập</h2>
                <p className="text-sm text-gray-500 mt-2">Hệ thống quản lý đào tạo LMS</p>
            </div>

            {/* Username Field */}
            <div className="space-y-1.5">
                <label htmlFor="username" className="block text-sm font-semibold text-blue-900">
                    Tên đăng nhập
                </label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className={clsx("h-5 w-5 transition-colors", errors.username ? "text-red-400" : "text-gray-400 group-focus-within:text-blue-500")} />
                    </div>
                    <input
                        {...register("username")}
                        id="username"
                        type="text"
                        placeholder="Ví dụ: admin, GV001..."
                        disabled={isLoading}
                        autoComplete="username" 
                        aria-invalid={errors.username ? "true" : "false"}
                        className={clsx(
                            inputBaseClass,
                            errors.username 
                                ? "border-red-500 focus:ring-red-200" 
                                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
                        )}
                    />
                </div>
                {errors.username && (
                    <p className="text-red-500 text-xs font-medium mt-1 animate-in fade-in slide-in-from-top-1">
                        {errors.username.message}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                    <label htmlFor="password" className="block text-sm font-semibold text-blue-900">
                        Mật khẩu
                    </label>
                    <Link to="/forgot-password" tabIndex={isLoading ? -1 : 0} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors focus:underline outline-none">
                        Quên mật khẩu?
                    </Link>
                </div>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className={clsx("h-5 w-5 transition-colors", errors.password ? "text-red-400" : "text-gray-400 group-focus-within:text-blue-500")} />
                    </div>
                    <input
                        {...register("password")}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={isLoading}
                        autoComplete="current-password" 
                        className={clsx(
                            inputBaseClass,
                            "pr-10",
                            errors.password 
                                ? "border-red-500 focus:ring-red-200" 
                                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
                        )}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        tabIndex={-1} 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 focus:outline-none transition-colors disabled:opacity-50"
                        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-red-500 text-xs font-medium mt-1 animate-in fade-in slide-in-from-top-1">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className={clsx(
                    "w-full flex justify-center items-center py-2.5 px-4 rounded-lg shadow-md text-sm font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2",
                    isLoading 
                        ? "bg-blue-400 cursor-not-allowed" 
                        : "bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.98] focus:ring-blue-500 shadow-blue-200"
                )}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Đang xác thực...
                    </>
                ) : (   
                    "Đăng Nhập"
                )}
            </button>
        </form>
    );
};