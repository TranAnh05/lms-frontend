/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { X, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";
import clsx from "clsx";

import { type Major } from "../types";
import { majorService } from "../services/major.service";

interface MajorDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    majorId: number | null;
}

export const MajorDetailModal: React.FC<MajorDetailModalProps> = ({
    isOpen,
    onClose,
    majorId,
}) => {
    const [data, setData] = useState<Major | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!isOpen || !majorId) {
            setData(null);
            return;
        }

        // Toi uu: Huy API call khi Component unmount de tranh memory leak
        const abortController = new AbortController();

        const fetchDetail = async () => {
            setIsLoading(true);
            try {
                const response = await majorService.getMajorById(majorId);
                if (!abortController.signal.aborted) {
                    setData(response);
                }
            } catch {
                if (!abortController.signal.aborted) {
                    toast.error("Không thể lấy thông tin chi tiết ngành học.");
                    onClose();
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchDetail();

        return () => {
            abortController.abort();
            setData(null);
        };
    }, [isOpen, majorId, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Toi uu: Tach rieng the backdrop de xu ly click ra ngoai, khong dung stopPropagation */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">
                        Chi tiết ngành học
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="mt-3 text-sm text-gray-500">
                                Đang tải dữ liệu...
                            </span>
                        </div>
                    ) : data ? (
                        <div className="space-y-6">
                            {/* Khối 1: Thông tin cơ bản */}
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                                    Thông tin cơ bản
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Mã ngành
                                        </p>
                                        <p className="font-mono text-blue-600 font-medium">
                                            {data.code}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Tên ngành
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {data.name}
                                        </p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <p className="text-sm text-gray-500 mb-1">
                                            Khoa trực thuộc
                                        </p>
                                        <p className="text-gray-900 font-medium">
                                            {data.departmentName}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Khối 2: Chi tiết học vụ & Trạng thái */}
                            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                                    Học vụ & Trạng thái
                                </h3>
                                <div className="grid grid-cols-1 gap-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">
                                                Số tín chỉ tối thiểu
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {data.requiredMinimumCredits}{" "}
                                                tín chỉ
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">
                                                Trạng thái
                                            </p>
                                            <div>
                                                <span
                                                    className={clsx(
                                                        "inline-block px-2 py-0.5 rounded text-xs font-medium border",
                                                        data.isActive
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                            : "bg-amber-50 text-amber-700 border-amber-200",
                                                    )}
                                                >
                                                    {data.isActive
                                                        ? "Đang hoạt động"
                                                        : "Đang tạm khóa"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {!data.isActive && data.lockReason && (
                                        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex gap-2 items-start border border-red-100">
                                            <ShieldAlert className="w-5 h-5 shrink-0" />
                                            <div>
                                                <p className="font-semibold mb-0.5">
                                                    Lý do khóa:
                                                </p>
                                                <p>{data.lockReason}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Mô tả ngành học
                                        </p>
                                        <p className="text-gray-700 leading-relaxed text-justify">
                                            {data.description ||
                                                "Chưa có mô tả."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            Không tìm thấy dữ liệu.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};