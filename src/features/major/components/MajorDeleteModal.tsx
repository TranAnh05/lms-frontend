import React, { useState } from "react";
import axios from "axios";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { majorService } from "../services/major.service";

interface MajorDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    majorInfo: {
        id: number;
        name: string;
        code: string;
    } | null;
}

const DEFAULT_ERROR_MESSAGE =
    "Đã xảy ra lỗi khi xóa ngành học.";

export const MajorDeleteModal: React.FC<
    MajorDeleteModalProps
> = ({
    isOpen,
    onClose,
    onSuccess,
    majorInfo,
}) => {
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    if (!isOpen || !majorInfo) {
        return null;
    }

    const majorDisplayName = `${majorInfo.name} (${majorInfo.code})`;

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);

        try {
            await majorService.deleteMajor(
                majorInfo.id,
            );

            toast.success(
                `Đã xóa ngành học "${majorInfo.name}" thành công!`,
            );

            onSuccess();
            onClose();
        } catch (error: unknown) {
            const errorMessage =
                axios.isAxiosError(error)
                    ? error.response?.data?.message
                    : null;

            toast.error(
                errorMessage ||
                    DEFAULT_ERROR_MESSAGE,
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="absolute inset-0"
                onClick={handleClose}
            />

            <div className="relative flex flex-col w-full max-w-md overflow-hidden bg-white shadow-xl rounded-2xl animate-in zoom-in-95 duration-200">
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="absolute p-1.5 text-gray-400 transition-colors rounded-lg top-4 right-4 hover:text-gray-700 hover:bg-gray-100 focus:outline-none disabled:opacity-50"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center p-6 mt-2 text-center sm:p-8">
                    <div className="flex items-center justify-center w-14 h-14 mb-5 border rounded-full shadow-sm bg-rose-100 border-rose-50 shrink-0">
                        <AlertTriangle className="w-7 h-7 text-rose-600" />
                    </div>

                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                        Xác nhận xóa ngành học
                    </h3>

                    <p className="mb-6 text-sm leading-relaxed text-gray-500">
                        Bạn có chắc chắn muốn xóa ngành{" "}
                        <strong className="text-gray-800">
                            {majorDisplayName}
                        </strong>{" "}
                        không? Hành động này sẽ đưa ngành học vào trạng thái xóa
                        và không thể hiển thị trên hệ thống.
                    </p>

                    <div className="flex items-center justify-center w-full gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="flex items-center justify-center flex-1 gap-2 px-5 py-2.5 text-sm font-bold text-white transition-all rounded-xl shadow-sm bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Đang xóa...</span>
                                </>
                            ) : (
                                "Xóa ngành học"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};