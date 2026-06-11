/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";
import { majorService } from "../services/major.service";
import { type Department, type CreateMajorInput } from "../types";

interface MajorFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    departments: Department[];
}

const initialFormState: CreateMajorInput = {
    code: "",
    name: "",
    requiredMinimumCredits: 1,
    departmentId: 0,
    description: "",
};

export const MajorFormModal: React.FC<MajorFormModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    departments,
}) => {
    const [formData, setFormData] = useState<CreateMajorInput>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormState);
        }
    }, [isOpen]);

    const handleChange = (field: keyof CreateMajorInput, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.code.trim() || !formData.name.trim() || !formData.departmentId) {
            toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc.");
            return;
        }

        if (formData.requiredMinimumCredits <= 0) {
            toast.error("Số tín chỉ tối thiểu phải lớn hơn 0.");
            return;
        }

        setIsSubmitting(true);
        try {
            await majorService.createMajor({
                ...formData,
                code: formData.code.trim().toUpperCase(),
                name: formData.name.trim(),
                description: formData.description?.trim() || null,
            });
            toast.success("Thêm mới ngành học thành công!");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tạo ngành học.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Thêm ngành học mới</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Khởi tạo ngành đào tạo mới trong hệ thống</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <div className="sm:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Mã ngành <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.code}
                                    onChange={(e) => handleChange("code", e.target.value)}
                                    placeholder="VD: PM"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none uppercase font-mono tracking-wider"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Tên ngành học <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    placeholder="Nhập tên ngành học chính thức"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Khoa quản lý <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    value={formData.departmentId || ""}
                                    onChange={(e) => handleChange("departmentId", Number(e.target.value))}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none"
                                >
                                    <option value="" disabled>Chọn khoa trực thuộc</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="sm:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Tín chỉ tối thiểu <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    min={1}
                                    value={formData.requiredMinimumCredits}
                                    onChange={(e) => handleChange("requiredMinimumCredits", Number(e.target.value))}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-center font-semibold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả tóm tắt</label>
                            <textarea
                                rows={4}
                                value={formData.description || ""}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Nhập một vài thông tin mô tả giới thiệu về ngành đào tạo này (tùy chọn)..."
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none leading-relaxed"
                            />
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px] justify-center"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Tạo ngành học
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};