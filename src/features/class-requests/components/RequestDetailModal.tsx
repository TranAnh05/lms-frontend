import React from "react";
import {
    X,
    BookOpen,
    User,
    Calendar,
    Users,
    MessageSquare,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Ban,
    Layers,
} from "lucide-react";
import { type ClassRequestResponse } from "../types";

interface RequestDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: ClassRequestResponse | null;
    onRejectClick: (request: ClassRequestResponse) => void;
    onCreateClassClick: (request: ClassRequestResponse) => void;
    canApprove: boolean;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
    isOpen,
    onClose,
    request,
    onRejectClick,
    onCreateClassClick,
    canApprove,
}) => {
    if (!isOpen || !request) return null;

    const renderStatusBadge = (status: ClassRequestResponse["status"]) => {
        switch (status) {
            case "PENDING":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        Đang chờ duyệt
                    </span>
                );
            case "APPROVED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Đã được duyệt
                    </span>
                );
            case "REJECTED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200 shadow-sm">
                        <XCircle className="w-4 h-4 text-rose-500" />
                        Đã bị từ chối
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        Chi tiết Đề xuất Mở lớp
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 flex flex-col gap-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Trạng thái đề xuất
                            </p>
                            {renderStatusBadge(request.status)}
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Ngày gửi đề xuất
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {new Date(request.createdAt).toLocaleDateString(
                                    "vi-VN",
                                    {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    },
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-5">
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                    <BookOpen className="w-3.5 h-3.5" /> Môn học
                                </label>
                                <p className="text-sm font-bold text-gray-900 leading-snug">
                                    {request.course.name}
                                </p>
                                <div className="flex flex-wrap items-baseline gap-2 mt-2">
                                    <span className="inline-flex items-baseline text-xs text-gray-700 bg-gray-50 px-2.5 py-1 rounded border border-gray-200">
                                        <span className="text-gray-500 mr-1.5">
                                            Mã môn:
                                        </span>
                                        <strong className="font-mono">
                                            {request.course.code}
                                        </strong>
                                    </span>
                                    <span className="inline-flex items-baseline text-xs text-gray-700 bg-gray-50 px-2.5 py-1 rounded border border-gray-200">
                                        <span className="text-gray-500 mr-1.5">
                                            Số tín chỉ:
                                        </span>
                                        <strong className="font-mono">
                                            {request.course.credits} TC
                                        </strong>
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                    <Users className="w-3.5 h-3.5" /> Sĩ số dự
                                    kiến
                                </label>
                                <p className="text-base font-bold text-blue-600">
                                    {request.expectedStudents}{" "}
                                    <span className="text-sm font-normal text-gray-600">
                                        sinh viên
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                    <Calendar className="w-3.5 h-3.5" /> Học kỳ
                                    áp dụng
                                </label>
                                <p className="text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg inline-block">
                                    {request.semester.semesterCode}{" "}
                                    <span className="text-gray-400 mx-1">
                                        |
                                    </span>{" "}
                                    {request.semester.academicYear}
                                </p>
                            </div>

                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                    <User className="w-3.5 h-3.5" /> Người đề
                                    xuất
                                </label>
                                <p className="text-sm font-medium text-gray-900">
                                    {request.requester.fullName}
                                </p>
                            </div>
                        </div>
                    </div>

                    {request.note && (
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mt-2">
                            <label className="flex items-center gap-1.5 text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
                                <MessageSquare className="w-4 h-4" />
                                Ghi chú từ người đề xuất
                            </label>
                            <p className="text-sm text-blue-900 leading-relaxed italic">
                                "{request.note}"
                            </p>
                        </div>
                    )}

                    {request.status === "REJECTED" && request.rejectReason && (
                        <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mt-2">
                            <label className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
                                <Ban className="w-4 h-4" />
                                Lý do từ chối (Từ Phòng Đào tạo)
                            </label>
                            <p className="text-sm text-rose-900 leading-relaxed font-medium">
                                {request.rejectReason}
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50/80 rounded-b-2xl flex flex-col sm:flex-row justify-between items-center gap-3">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-4 focus:ring-gray-100"
                    >
                        Đóng
                    </button>

                    {request.status === "PENDING" && canApprove && (
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => {
                                    onClose();
                                    onRejectClick(request);
                                }}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors focus:ring-4 focus:ring-rose-500/20"
                            >
                                <Ban className="w-4 h-4" />
                                Từ chối
                            </button>

                            <button
                                onClick={() => {
                                    onClose();
                                    onCreateClassClick(request);
                                }}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-500/20 shadow-sm"
                            >
                                <Layers className="w-4 h-4" />
                                Tạo lớp học phần
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
