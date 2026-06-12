/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    X,
    BookOpen,
    Building2,
    Hash,
    AlignLeft,
    Clock,
    Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import clsx from "clsx";

import { courseService } from "../services/course.service";
import { type Department } from "../types";

const createProposalSchema = z
    .object({
        departmentId: z
            .number({ message: "Vui lòng chọn Khoa phụ trách" })
            .min(1, "Vui lòng chọn Khoa phụ trách"),
        code: z
            .string()
            .min(1, "Mã môn học không được để trống")
            .max(20, "Mã môn học không vượt quá 20 ký tự"),
        name: z
            .string()
            .min(1, "Tên môn học không được để trống")
            .max(150, "Tên môn học không vượt quá 150 ký tự"),
        credits: z
            .number({ message: "Bắt buộc nhập" })
            .min(1, "Ít nhất 1 tín chỉ")
            .max(20, "Tối đa 20 tín chỉ"),
        theoreticalHours: z
            .number({ message: "Bắt buộc nhập" })
            .min(0, "Không được âm"),
        practicalHours: z
            .number({ message: "Bắt buộc nhập" })
            .min(0, "Không được âm"),
        description: z.string().optional(),
    })
    .refine((data) => data.theoreticalHours + data.practicalHours > 0, {
        message: "Tổng số tiết LT và TH phải lớn hơn 0",
        path: ["practicalHours"],
    });

type FormData = z.infer<typeof createProposalSchema>;

interface CourseProposalFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editId?: number | null; // Cờ nhận biết chế độ Cập nhật
}

export const CourseProposalFormModal: React.FC<CourseProposalFormModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    editId,
}) => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoadingDepts, setIsLoadingDepts] = useState(false);
    const [isFetchingDetail, setIsFetchingDetail] = useState(false);

    const isEditMode = !!editId;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(createProposalSchema),
        defaultValues: {
            departmentId: 0,
            code: "",
            name: "",
            credits: 3,
            theoreticalHours: 30,
            practicalHours: 15,
            description: "",
        },
    });

    // Khởi tạo dữ liệu: fetch danh sách Khoa và chi tiết môn học (nếu đang sửa)
    useEffect(() => {
        const initializeData = async () => {
            setIsLoadingDepts(true);
            try {
                const depts = await courseService.getDepartments();
                setDepartments(depts);

                if (editId) {
                    setIsFetchingDetail(true);
                    const course = await courseService.getCourseById(editId);
                    
                    setValue("departmentId", course.departmentId);
                    setValue("code", course.code);
                    setValue("name", course.name);
                    setValue("credits", course.credits);
                    setValue("theoreticalHours", course.theoreticalHours);
                    setValue("practicalHours", course.practicalHours);
                    setValue("description", course.description || "");
                }
            } catch (error) {
                toast.error("Không thể tải thông tin dữ liệu cấu hình.");
                onClose();
            } finally {
                setIsLoadingDepts(false);
                setIsFetchingDetail(false);
            }
        };

        if (isOpen) {
            reset();
            initializeData();
        }
    }, [isOpen, editId, reset, setValue, onClose]);

    // Xử lý Gửi đề xuất (POST) hoặc Lưu thay đổi (PUT)
    const onSubmit = async (data: FormData) => {
        try {
            if (isEditMode && editId) {
                await courseService.updateCourse(editId, {
                    departmentId: data.departmentId,
                    name: data.name.trim(),
                    credits: data.credits,
                    theoreticalHours: data.theoreticalHours,
                    practicalHours: data.practicalHours,
                    description: data.description?.trim(),
                });
                toast.success("Cập nhật thông tin môn học thành công!");
            } else {
                await courseService.createCourseProposal(data);
                toast.success("Đã gửi đề xuất môn học thành công!");
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi trong quá trình xử lý.";
            toast.error(errorMsg);
        }
    };

    if (!isOpen) return null;

    const { onChange: onCodeChange, ...codeRest } = register("code");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto overflow-x-hidden">
            <div
                className="absolute inset-0"
                onClick={(!isSubmitting && !isFetchingDetail) ? onClose : undefined}
            ></div>

            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                
                {isFetchingDetail && (
                    <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                )}

                {/* HEADER */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl shrink-0">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        {isEditMode ? "Cập nhật Môn học" : "Tạo Đề xuất Môn học"}
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting || isFetchingDetail}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* BODY FORM */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form
                        id="proposalForm"
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-b border-gray-100 pb-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Khoa phụ trách <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building2 className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <select
                                        disabled={isLoadingDepts}
                                        {...register("departmentId", {
                                            valueAsNumber: true,
                                        })}
                                        className={clsx(
                                            "bg-white block w-full pl-10 pr-10 py-2 sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors appearance-none cursor-pointer",
                                            errors.departmentId
                                                ? "border-red-300 focus:ring-red-500/20 text-red-900"
                                                : "border-gray-300 focus:ring-blue-500/20"
                                        )}
                                    >
                                        <option value={0} disabled>
                                            {isLoadingDepts
                                                ? "Đang tải danh sách Khoa..."
                                                : "-- Chọn khoa phụ trách --"}
                                        </option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.departmentId && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.departmentId.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Mã môn học <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Hash className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        disabled={isEditMode}
                                        placeholder="VD: SWE101"
                                        {...codeRest}
                                        onChange={(e) => {
                                            e.target.value = e.target.value.toUpperCase();
                                            onCodeChange(e);
                                        }}
                                        className={clsx(
                                            "block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                                            isEditMode && "bg-gray-100 text-gray-500 cursor-not-allowed",
                                            errors.code
                                                ? "border-red-300 focus:ring-red-500/20"
                                                : "border-gray-300 focus:ring-blue-500/20"
                                        )}
                                    />
                                </div>
                                {errors.code && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.code.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Tên môn học <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BookOpen className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="VD: Nhập môn Kỹ thuật phần mềm"
                                        {...register("name")}
                                        className={clsx(
                                            "block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                                            errors.name
                                                ? "border-red-300 focus:ring-red-500/20"
                                                : "border-gray-300 focus:ring-blue-500/20"
                                        )}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Số tín chỉ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    {...register("credits", {
                                        valueAsNumber: true,
                                    })}
                                    className={clsx(
                                        "block w-full px-3 py-2 sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                                        errors.credits
                                            ? "border-red-300 focus:ring-red-500/20"
                                            : "border-gray-300 focus:ring-blue-500/20"
                                    )}
                                />
                                {errors.credits && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.credits.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 text-blue-700">
                                    <Clock className="w-3.5 h-3.5 inline mr-1" />{" "}
                                    Số tiết LT
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    {...register("theoreticalHours", {
                                        valueAsNumber: true,
                                    })}
                                    className={clsx(
                                        "block w-full px-3 py-2 sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-blue-50/50",
                                        errors.theoreticalHours
                                            ? "border-red-300 focus:ring-red-500/20"
                                            : "border-blue-200 focus:ring-blue-500/20"
                                    )}
                                />
                                {errors.theoreticalHours && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.theoreticalHours.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 text-amber-700">
                                    <Clock className="w-3.5 h-3.5 inline mr-1" />{" "}
                                    Số tiết TH
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    {...register("practicalHours", {
                                        valueAsNumber: true,
                                    })}
                                    className={clsx(
                                        "block w-full px-3 py-2 sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-amber-50/50",
                                        errors.practicalHours
                                            ? "border-red-300 focus:ring-red-500/20"
                                            : "border-amber-200 focus:ring-amber-500/20"
                                    )}
                                />
                                {errors.practicalHours && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.practicalHours.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Mô tả nội dung môn học
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none">
                                    <AlignLeft className="h-4 w-4 text-gray-400" />
                                </div>
                                <textarea
                                    rows={4}
                                    placeholder="Nhập tóm tắt nội dung, mục tiêu của môn học..."
                                    {...register("description")}
                                    className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors custom-scrollbar"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex items-center justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting || isFetchingDetail}
                        className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-50"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        form="proposalForm"
                        disabled={isSubmitting || isFetchingDetail}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:bg-blue-400 min-w-[140px] justify-center"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {isEditMode ? "Đang lưu..." : "Đang gửi..."}
                            </>
                        ) : (
                            isEditMode ? "Lưu thay đổi" : "Gửi đề xuất"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};