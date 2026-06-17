import React, { useState, useEffect, memo } from "react";
import {
    X,
    CalendarDays,
    BookOpen,
    Clock,
    CheckCircle2,
    Layers,
    ShieldAlert,
} from "lucide-react";
import clsx from "clsx";
import { semesterService } from "../services/semester.service";
import { type SemesterDetailResponse } from "../types";

interface SemesterDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    semesterId: number | null;
}

// Toi uu: Dua mang tinh va ham ho tro ra ngoai Component de tiet kiem bo nho
const SKELETON_ITEMS = [1, 2, 3, 4, 5, 6];

const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
};

// Toi uu: Su dung React.memo de ngan chan re-render tu Component cha
export const SemesterDetailModal: React.FC<SemesterDetailModalProps> = memo(
    ({ isOpen, onClose, semesterId }) => {
        const [semester, setSemester] = useState<SemesterDetailResponse | null>(
            null,
        );
        const [isFetching, setIsFetching] = useState<boolean>(true);

        useEffect(() => {
            if (!isOpen || !semesterId) return;

            // Toi uu: Su dung AbortController de huy request neu Component bi huy
            const abortController = new AbortController();

            const fetchDetails = async () => {
                setIsFetching(true);
                try {
                    // Toi uu: Loai bo ep kieu 'any' va su dung data truc tiep tu service
                    const semesterData =
                        await semesterService.getSemesterById(semesterId);

                    if (!abortController.signal.aborted) {
                        // Ep kieu tam thoi hoac xu ly dong bo type giua SemesterResponse va SemesterDetailResponse
                        // tuy thuoc vao dinh nghia API tra ve thuc te
                        setSemester(
                            semesterData as unknown as SemesterDetailResponse,
                        );
                    }
                } catch (error) {
                    if (!abortController.signal.aborted) {
                        console.error("Lỗi khi tải chi tiết học kỳ:", error);
                    }
                } finally {
                    if (!abortController.signal.aborted) {
                        setIsFetching(false);
                    }
                }
            };

            fetchDetails();

            return () => {
                abortController.abort();
                setSemester(null);
            };
        }, [isOpen, semesterId]);

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
                <div
                    className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300"
                    onClick={onClose}
                />

                <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white z-20 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                                    Chi tiết Học kỳ
                                </h2>
                                {semester && !isFetching && (
                                    <p className="text-sm text-gray-500 font-medium mt-0.5">
                                        {semester.semesterCode}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        {isFetching ? (
                            <div className="space-y-8 animate-pulse">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {SKELETON_ITEMS.map((i) => (
                                        <div
                                            key={i}
                                            className="h-20 bg-gray-100 rounded-xl w-full"
                                        ></div>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    <div className="h-6 bg-gray-100 rounded w-40"></div>
                                    <div className="h-32 bg-gray-50 rounded-xl w-full"></div>
                                </div>
                            </div>
                        ) : semester ? (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex items-start gap-3 transition-colors hover:bg-gray-50">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-gray-500 border border-gray-100 shrink-0">
                                            <CalendarDays className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                                Năm học
                                            </p>
                                            <div className="text-sm font-semibold text-gray-800">
                                                {semester.academicYear}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex items-start gap-3 transition-colors hover:bg-gray-50">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-gray-500 border border-gray-100 shrink-0">
                                            <Layers className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                                Kỳ thứ
                                            </p>
                                            <div className="text-sm font-semibold text-gray-800">
                                                Học kỳ {semester.semesterNumber}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex items-start gap-3 transition-colors hover:bg-gray-50">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-gray-500 border border-gray-100 shrink-0">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                                Trạng thái
                                            </p>
                                            <div className="text-sm font-semibold text-gray-800">
                                                <span
                                                    className={clsx(
                                                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border",
                                                        semester.status ===
                                                            "ACTIVE"
                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                            : "bg-gray-100 text-gray-600 border-gray-200",
                                                    )}
                                                >
                                                    {semester.status ===
                                                    "ACTIVE"
                                                        ? "ĐANG MỞ"
                                                        : "ĐÃ ĐÓNG"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex items-start gap-3 transition-colors hover:bg-gray-50">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-gray-500 border border-gray-100 shrink-0">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                                Ngày bắt đầu
                                            </p>
                                            <div className="text-sm font-semibold text-gray-800">
                                                {formatDate(semester.startDate)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex items-start gap-3 transition-colors hover:bg-gray-50">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-gray-500 border border-gray-100 shrink-0">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                                Ngày kết thúc
                                            </p>
                                            <div className="text-sm font-semibold text-gray-800">
                                                {formatDate(semester.endDate)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                                <ShieldAlert className="w-12 h-12 mb-3 text-gray-300" />
                                <p className="text-base font-medium">
                                    Không tìm thấy thông tin học kỳ.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-100 shadow-sm"
                        >
                            Đóng cửa sổ
                        </button>
                    </div>
                </div>
            </div>
        );
    },
);

SemesterDetailModal.displayName = "SemesterDetailModal";
