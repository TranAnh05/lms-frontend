/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { X, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { semesterService } from "../services/semester.service";
import { type SemesterResponse, type SemesterClassResponse } from "../types";
import { SemesterClassStatusTable } from "./SemesterClassStatusTable";

interface SemesterClosingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    semester: SemesterResponse | null;
}

export const SemesterClosingModal: React.FC<SemesterClosingModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    semester,
}) => {
    const [classes, setClasses] = useState<SemesterClassResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        const fetchSemesterClasses = async () => {
            if (!isOpen || !semester) return;
            setIsLoading(true);
            try {
                const data = await semesterService.getClassesBySemester(
                    semester.id,
                );
                setClasses(data);
            } catch (error) {
                toast.error("Không thể tải danh sách lớp học của học kỳ này.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSemesterClasses();
    }, [isOpen, semester]);

    const hasUnfinishedClass = useMemo(() => {
        if (classes.length === 0) return false;
        return classes.some(
            (cls) => cls.status !== "COMPLETED" && cls.status !== "CANCELED",
        );
    }, [classes]);

    const handleCloseSemester = async () => {
        if (!semester || hasUnfinishedClass) return;

        setIsSubmitting(true);
        try {
            await semesterService.closeSemester(semester.id);
            toast.success(`Đóng học kỳ ${semester.semesterCode} thành công!`);
            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Đã xảy ra lỗi trong quá trình đóng học kỳ.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !semester) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Quy trình đóng học kỳ: {semester.semesterCode}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Năm học {semester.academicYear} — Học kỳ{" "}
                            {semester.semesterNumber}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {!isLoading &&
                        classes.length > 0 &&
                        (hasUnfinishedClass ? (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-amber-800 text-sm leading-relaxed animate-in fade-in duration-300">
                                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <strong className="font-bold">
                                        Hệ thống bị khóa:
                                    </strong>{" "}
                                    Hiện tại vẫn còn lớp học ở trạng thái chưa
                                    hoàn tất hoặc chưa hủy. Vui lòng đôn đốc các
                                    khoa và giảng viên chốt điểm trước khi thực
                                    hiện đóng học kỳ.
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex gap-3 text-emerald-800 text-sm leading-relaxed animate-in fade-in duration-300">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <strong className="font-bold">
                                        Đủ điều kiện đóng:
                                    </strong>{" "}
                                    Toàn bộ lớp học phần trong học kỳ này đã
                                    hoàn thành hoặc đã hủy thành công. Hệ thống
                                    đã sẵn sàng chốt dữ liệu.
                                </div>
                            </div>
                        ))}

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Tình trạng danh sách lớp học phần
                        </label>
                        <SemesterClassStatusTable
                            classes={classes}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none"
                    >
                        Hủy bỏ
                    </button>

                    <button
                        type="button"
                        disabled={
                            isLoading ||
                            hasUnfinishedClass ||
                            isSubmitting ||
                            classes.length === 0
                        }
                        onClick={handleCloseSemester}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm focus:outline-none min-w-[140px] text-center"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Đang xử lý...</span>
                            </div>
                        ) : (
                            "Đóng học kỳ"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
