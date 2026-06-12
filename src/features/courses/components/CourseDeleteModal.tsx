/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { courseService } from "../services/course.service";

interface CourseDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    courseInfo: { id: number; name: string; code: string } | null;
}

export const CourseDeleteModal: React.FC<CourseDeleteModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    courseInfo,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async () => {
        if (!courseInfo) return;

        setIsSubmitting(true);
        try {
            await courseService.deleteCourse(courseInfo.id);
            toast.success(`Xóa môn học "${courseInfo.name}" thành công!`);
            onSuccess();
            onClose();
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi xóa môn học.";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !courseInfo) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={!isSubmitting ? onClose : undefined} />

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
                <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none disabled:opacity-50"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 sm:p-8 flex flex-col items-center text-center mt-2">
                    <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mb-5 shrink-0 shadow-sm border border-rose-50">
                        <AlertTriangle className="w-7 h-7 text-rose-600" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa môn học</h3>

                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                        Bạn có chắc chắn muốn xóa môn học <strong className="text-gray-800">{courseInfo.name} ({courseInfo.code})</strong> không? Hành động này sẽ chuyển trạng thái hệ thống và không thể phục hồi trực tiếp.
                    </p>

                    <div className="flex items-center justify-center gap-3 w-full">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none"
                        >
                            Hủy bỏ
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="flex-1 px-5 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 rounded-xl transition-all shadow-sm focus:outline-none flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Đang xóa...</span>
                                </>
                            ) : (
                                "Xóa môn học"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};