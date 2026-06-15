/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { X, Calendar, Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";
import { semesterService } from "../services/semester.service";
import { type SemesterUpdateRequest } from "../types";

interface SemesterUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    semesterId: number | null;
}

const ACADEMIC_YEARS = ["2025-2026", "2026-2027", "2027-2028"];

export const SemesterUpdateModal: React.FC<SemesterUpdateModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    semesterId,
}) => {
    const [formData, setFormData] = useState<SemesterUpdateRequest>({
        academicYear: "",
        semesterNumber: 1,
        startDate: "",
        endDate: "",
    });

    const [semesterCode, setSemesterCode] = useState<string>("");

    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Regex kiểm tra dữ liệu trống
    const emptyRegex = /^\s*$/;
    const academicYearRegex = /^\d{4}-\d{4}$/;

    useEffect(() => {
        if (isOpen && semesterId) {
            const loadSemesterDetail = async () => {
                setIsFetching(true);
                setErrors({});
                try {
                    const response =
                        await semesterService.getSemesterById(semesterId);
                    const detail = (response as any).data || response;

                    setSemesterCode(detail.semesterCode);
                    setFormData({
                        academicYear: detail.academicYear,
                        semesterNumber: detail.semesterNumber,
                        startDate: detail.startDate,
                        endDate: detail.endDate,
                    });
                } catch (error) {
                    console.error("Lỗi khi tải chi tiết học kỳ:", error);
                    toast.error("Không thể tải thông tin học kỳ chi tiết!");
                    onClose();
                } finally {
                    setIsFetching(false);
                }
            };
            loadSemesterDetail();
        }
    }, [isOpen, onClose, semesterId]);

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "semesterNumber" ? parseInt(value, 10) : value,
        }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (
            emptyRegex.test(formData.academicYear) ||
            !academicYearRegex.test(formData.academicYear)
        ) {
            newErrors.academicYear =
                "Năm học không hợp lệ hoặc không được để trống";
        }
        if (
            !formData.semesterNumber ||
            formData.semesterNumber < 1 ||
            formData.semesterNumber > 3
        ) {
            newErrors.semesterNumber =
                "Số thứ tự học kỳ phải nằm trong khoảng từ 1 đến 3";
        }
        if (emptyRegex.test(formData.startDate)) {
            newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
        }
        if (emptyRegex.test(formData.endDate)) {
            newErrors.endDate = "Vui lòng chọn ngày kết thúc";
        }

        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            if (start >= end) {
                newErrors.endDate = "Ngày kết thúc phải lớn hơn ngày bắt đầu";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!semesterId || !validateForm()) return;

        setIsSubmitting(true);
        try {
            await semesterService.updateSemester(semesterId, formData);
            toast.success("Cập nhật học kỳ thành công!");
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Lỗi cập nhật học kỳ:", error);
            const serverMessage =
                error?.response?.data?.message ||
                "Cập nhật thất bại. Vui lòng thử lại!";
            toast.error(serverMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={!isSubmitting ? onClose : undefined}
            />

            <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 scale-100 flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
                {/* Header Modal */}
                <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Chỉnh sửa Học kỳ
                            </h3>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Cập nhật cấu hình khung thời gian hệ thống
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-8 space-y-6 flex-1 relative"
                >
                    {isFetching ? (
                        <div className="space-y-5 py-2 animate-pulse">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-11 bg-gray-100 rounded-xl w-full"></div>
                                </div>
                            ))}
                            <div className="flex gap-5 pt-2">
                                <div className="h-11 bg-gray-200 rounded-xl w-1/2"></div>
                                <div className="h-11 bg-gray-200 rounded-xl w-1/2"></div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-[13px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                                    Mã Học Kỳ (Không được sửa)
                                </label>
                                <input
                                    type="text"
                                    value={semesterCode}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 cursor-not-allowed focus:outline-none shadow-inner"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[13px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                                        Năm học{" "}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        name="academicYear"
                                        value={formData.academicYear}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium transition-shadow focus:outline-none focus:ring-2 ${
                                            errors.academicYear
                                                ? "border-rose-300 focus:ring-rose-100 text-rose-900"
                                                : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/10 text-gray-800 shadow-sm hover:border-gray-300"
                                        }`}
                                    >
                                        <option value="">
                                            -- Chọn năm học --
                                        </option>
                                        {ACADEMIC_YEARS.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.academicYear && (
                                        <p className="text-xs font-medium text-rose-500 mt-1.5">
                                            {errors.academicYear}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[13px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                                        Học kỳ thứ{" "}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        name="semesterNumber"
                                        value={formData.semesterNumber}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 shadow-sm hover:border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-shadow"
                                    >
                                        <option value={1}>Học kỳ 1</option>
                                        <option value={2}>Học kỳ 2</option>
                                        <option value={3}>Học kỳ 3</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[13px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                                        Ngày bắt đầu{" "}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium transition-shadow focus:outline-none focus:ring-2 ${
                                            errors.startDate
                                                ? "border-rose-300 focus:ring-rose-100 text-rose-900"
                                                : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/10 text-gray-800 shadow-sm hover:border-gray-300"
                                        }`}
                                    />
                                    {errors.startDate && (
                                        <p className="text-xs font-medium text-rose-500 mt-1.5">
                                            {errors.startDate}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[13px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                                        Ngày kết thúc{" "}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium transition-shadow focus:outline-none focus:ring-2 ${
                                            errors.endDate
                                                ? "border-rose-300 focus:ring-rose-100 text-rose-900"
                                                : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/10 text-gray-800 shadow-sm hover:border-gray-300"
                                        }`}
                                    />
                                    {errors.endDate && (
                                        <p className="text-xs font-medium text-rose-500 mt-1.5">
                                            {errors.endDate}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-6 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting || isFetching}
                            className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-gray-200"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isFetching}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-500/30 active:scale-95"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Lưu cập nhật
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
