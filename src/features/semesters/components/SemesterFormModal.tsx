import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AxiosError } from "axios";
import {
    X,
    CalendarPlus,
    Tag,
    Calendar,
    Hash,
    CalendarDays,
    Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import clsx from "clsx";
import { semesterService } from "../services/semester.service";
import { type SemesterCreatePayload } from "../types";

const createSemesterSchema = z
    .object({
        semesterCode: z
            .string()
            .min(1, "Mã học kỳ không được để trống")
            .max(50, "Mã học kỳ không vượt quá 50 ký tự"),
        academicYear: z
            .string()
            .min(1, "Năm học không được để trống")
            .regex(
                /^\d{4}-\d{4}$/,
                "Năm học phải theo định dạng YYYY-YYYY (VD: 2026-2027)",
            ),
        semesterNumber: z
            .number({ message: "Vui lòng chọn số thứ tự học kỳ" })
            .min(1, "Học kỳ phải từ 1 đến 3")
            .max(3, "Học kỳ phải từ 1 đến 3"),
        startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
        endDate: z.string().min(1, "Vui lòng chọn ngày kết thúc"),
    })
    .refine(
        (data) => {
            if (!data.startDate || !data.endDate) return true;
            return new Date(data.startDate) < new Date(data.endDate);
        },
        {
            message: "Ngày kết thúc phải sau ngày bắt đầu",
            path: ["endDate"],
        },
    );

type CreateSemesterFormData = z.infer<typeof createSemesterSchema>;

interface SemesterFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// Toi uu: Gom chung CSS class de tranh lap code va giam dung luong JSX
const INPUT_BASE_CLASS =
    "block w-full pl-10 pr-3 py-2 sm:text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors";
const INPUT_ERROR_CLASS =
    "border-red-300 focus:ring-red-500/20 focus:border-red-500";
const INPUT_NORMAL_CLASS =
    "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500";

export const SemesterFormModal: React.FC<SemesterFormModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateSemesterFormData>({
        resolver: zodResolver(createSemesterSchema),
        defaultValues: {
            semesterCode: "",
            academicYear: "",
            semesterNumber: 0,
            startDate: "",
            endDate: "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const onSubmitHandler = async (data: CreateSemesterFormData) => {
        try {
            const payload: SemesterCreatePayload = {
                semesterCode: data.semesterCode,
                academicYear: data.academicYear,
                semesterNumber: data.semesterNumber,
                startDate: data.startDate,
                endDate: data.endDate,
            };

            await semesterService.createSemester(payload);
            toast.success("Tạo học kỳ mới thành công!");
            onSuccess();
            onClose();
        } catch (error: unknown) {
            // Toi uu: Su dung AxiosError de dam bao an toan kieu du lieu, loai bo type 'any'
            const axiosError = error as AxiosError<{ message: string }>;
            console.error("Lỗi khi tạo học kỳ:", axiosError);
            const errorMsg =
                axiosError.response?.data?.message ||
                "Đã xảy ra lỗi khi tạo học kỳ. Vui lòng thử lại.";
            toast.error(errorMsg);
        }
    };

    if (!isOpen) return null;

    const { onChange: onSemesterCodeChange, ...semesterCodeRest } =
        register("semesterCode");
    const { onChange: onAcademicYearChange, ...academicYearRest } =
        register("academicYear");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto overflow-x-hidden">
            {/* Toi uu: Lop phu lang nghe su kien dong */}
            <div
                className="absolute inset-0"
                onClick={!isSubmitting ? onClose : undefined}
            />

            <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                {/* HEADER */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl shrink-0">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CalendarPlus className="w-5 h-5 text-blue-600" />
                        Tạo học kỳ mới
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
                        id="createSemesterForm"
                        onSubmit={handleSubmit(onSubmitHandler)}
                        className="flex flex-col gap-6"
                        noValidate
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Mã học kỳ{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Tag className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="VD: HK1_2026_2027"
                                        disabled={isSubmitting}
                                        {...semesterCodeRest}
                                        onChange={(e) => {
                                            e.target.value =
                                                e.target.value.toUpperCase();
                                            onSemesterCodeChange(e);
                                        }}
                                        className={clsx(
                                            INPUT_BASE_CLASS,
                                            errors.semesterCode
                                                ? INPUT_ERROR_CLASS
                                                : INPUT_NORMAL_CLASS,
                                            isSubmitting &&
                                                "opacity-70 cursor-not-allowed",
                                        )}
                                    />
                                </div>
                                {errors.semesterCode && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.semesterCode.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Năm học{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="VD: 2026-2027"
                                        disabled={isSubmitting}
                                        {...academicYearRest}
                                        onChange={(e) => {
                                            e.target.value =
                                                e.target.value.replace(
                                                    /[^\d-]/g,
                                                    "",
                                                );
                                            onAcademicYearChange(e);
                                        }}
                                        className={clsx(
                                            INPUT_BASE_CLASS,
                                            errors.academicYear
                                                ? INPUT_ERROR_CLASS
                                                : INPUT_NORMAL_CLASS,
                                            isSubmitting &&
                                                "opacity-70 cursor-not-allowed",
                                        )}
                                    />
                                </div>
                                {errors.academicYear && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.academicYear.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Học kỳ thứ{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Hash className="h-4 w-4 text-gray-400" />
                                </div>
                                <select
                                    disabled={isSubmitting}
                                    {...register("semesterNumber", {
                                        valueAsNumber: true,
                                    })}
                                    className={clsx(
                                        INPUT_BASE_CLASS,
                                        "appearance-none cursor-pointer pr-10",
                                        errors.semesterNumber
                                            ? "border-red-300 focus:ring-red-500/20 focus:border-red-500 text-red-900"
                                            : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900",
                                        isSubmitting &&
                                            "opacity-70 cursor-not-allowed",
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
                                        -- Vui lòng chọn học kỳ --
                                    </option>
                                    <option value={1}>Học kỳ 1</option>
                                    <option value={2}>Học kỳ 2</option>
                                    <option value={3}>
                                        Học kỳ 3 (Học kỳ phụ/hè)
                                    </option>
                                </select>
                            </div>
                            {errors.semesterNumber && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.semesterNumber.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-gray-100">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Ngày bắt đầu{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CalendarDays className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        disabled={isSubmitting}
                                        {...register("startDate")}
                                        className={clsx(
                                            INPUT_BASE_CLASS,
                                            errors.startDate
                                                ? INPUT_ERROR_CLASS
                                                : INPUT_NORMAL_CLASS,
                                            isSubmitting &&
                                                "opacity-70 cursor-not-allowed",
                                        )}
                                    />
                                </div>
                                {errors.startDate && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.startDate.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Ngày kết thúc{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CalendarDays className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        disabled={isSubmitting}
                                        {...register("endDate")}
                                        className={clsx(
                                            INPUT_BASE_CLASS,
                                            errors.endDate
                                                ? INPUT_ERROR_CLASS
                                                : INPUT_NORMAL_CLASS,
                                            isSubmitting &&
                                                "opacity-70 cursor-not-allowed",
                                        )}
                                    />
                                </div>
                                {errors.endDate && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.endDate.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex items-center justify-end gap-3 shrink-0">
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
                        form="createSemesterForm"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:bg-blue-400"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            "Tạo học kỳ"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
