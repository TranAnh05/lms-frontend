/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    X,
    UserPlus,
    Mail,
    Lock,
    User,
    ShieldCheck,
    Loader2,
    Eye,
    EyeOff,
} from "lucide-react";
import { toast } from "react-toastify";
import clsx from "clsx";
import { userService } from "../services/user.service";
import { type Role, type CreateUserPayload } from "../types";

const createUserSchema = z.object({
    username: z
        .string()
        .min(1, "Username không được để trống")
        .min(4, "Username phải từ 4 đến 50 ký tự")
        .max(50, "Username phải từ 4 đến 50 ký tự"),
    password: z
        .string()
        .min(1, "Password không được để trống")
        .min(8, "Password phải từ 8 đến 32 ký tự")
        .max(32, "Password phải từ 8 đến 32 ký tự")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password phải bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (@$!%*?&)",
        ),
    email: z
        .string()
        .min(1, "Email không được để trống")
        .email("Email không đúng định dạng"),
    fullName: z.string().min(1, "Họ và tên không được để trống"),
    roleId: z
        .number({ message: "Vui lòng chọn 1 vai trò" })
        .min(1, "Vui lòng chọn 1 vai trò cho người dùng"),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            username: "",
            password: "",
            email: "",
            fullName: "",
            roleId: 0,
        },
    });

    useEffect(() => {
        const fetchRoles = async () => {
            setIsLoadingRoles(true);
            try {
                const fetchedRoles = await userService.getRoles();
                setRoles(fetchedRoles);
            } catch (error) {
                console.error("Lỗi khi tải danh sách vai trò:", error);
                toast.error("Không thể tải danh sách vai trò hệ thống.");
            } finally {
                setIsLoadingRoles(false);
            }
        };

        if (isOpen) {
            reset();
            setShowPassword(false);
            fetchRoles();
        }
    }, [isOpen, reset]);

    const onSubmitHandler = async (data: CreateUserFormData) => {
        try {
            const payload: CreateUserPayload = {
                username: data.username,
                password: data.password,
                email: data.email,
                fullName: data.fullName,
                roleIds: [data.roleId],
            };

            const response = await userService.createUser(payload);
            toast.success(response.message || "Tạo tài khoản thành công!");
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Lỗi khi tạo tài khoản:", error);
            const errorMsg =
                error.response?.data?.message ||
                "Đã xảy ra lỗi khi tạo tài khoản.";
            toast.error(errorMsg);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto overflow-x-hidden">
            <div
                className="absolute inset-0"
                onClick={!isSubmitting ? onClose : undefined}
            ></div>

            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                {/* HEADER */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-blue-600" />
                        Tạo tài khoản người dùng
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* BODY */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form
                        id="createUserForm"
                        onSubmit={handleSubmit(onSubmitHandler)}
                        className="flex flex-col gap-5"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Họ và tên{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Tên người dùng"
                                        {...register("fullName")}
                                        className={clsx(
                                            "block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                                            errors.fullName
                                                ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                                                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500",
                                        )}
                                    />
                                </div>
                                {errors.fullName && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.fullName.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Tên đăng nhập{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="nguyenvana123"
                                        {...register("username")}
                                        className={clsx(
                                            "block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                                            errors.username
                                                ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                                                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500",
                                        )}
                                    />
                                </div>
                                {errors.username && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email liên hệ{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="email@gmail.com"
                                        {...register("email")}
                                        className={clsx(
                                            "block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                                            errors.email
                                                ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                                                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500",
                                        )}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Mật khẩu khởi tạo{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="••••••••"
                                        {...register("password")}
                                        className={clsx(
                                            "block w-full pl-10 pr-10 py-2 sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                                            errors.password
                                                ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                                                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500",
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password ? (
                                    <p className="mt-1 text-xs text-red-600 leading-snug">
                                        {errors.password.message}
                                    </p>
                                ) : (
                                    <p className="mt-1 text-xs text-gray-500 leading-snug">
                                        Ít nhất 8 ký tự, gồm chữ hoa, thường, số
                                        và ký tự đặc biệt.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Gán vai trò cho tài khoản{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <ShieldCheck
                                        className={clsx(
                                            "h-4 w-4",
                                            errors.roleId
                                                ? "text-red-400"
                                                : "text-gray-400",
                                        )}
                                    />
                                </div>
                                <select
                                    disabled={isLoadingRoles}
                                    {...register("roleId", {
                                        valueAsNumber: true,
                                    })}
                                    className={clsx(
                                        "bg-white block w-full pl-10 pr-10 py-2 sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors appearance-none cursor-pointer",
                                        errors.roleId
                                            ? "border-red-300 focus:ring-red-500/20 focus:border-red-500 text-red-900"
                                            : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900",
                                    )}
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                        backgroundPosition:
                                            "right 0.75rem center",
                                        backgroundSize: "1rem",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                >
                                    <option value={0} disabled>
                                        {isLoadingRoles
                                            ? "Đang tải danh sách vai trò..."
                                            : "-- Vui lòng chọn một vai trò --"}
                                    </option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.roleId && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.roleId.message}
                                </p>
                            )}
                        </div>
                    </form>
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-50"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        form="createUserForm"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:bg-blue-400"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            "Tạo tài khoản"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
