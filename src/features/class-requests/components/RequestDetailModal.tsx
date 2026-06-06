import React from "react";
import {
    X,
    BookOpen,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Layers,
} from "lucide-react";
import { type ClassOpeningResponseDto } from "../types";

interface RequestDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: ClassOpeningResponseDto | null;
    onRejectClick: (request: ClassOpeningResponseDto) => void;
    onCreateClassClick: (request: ClassOpeningResponseDto) => void;
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

    const renderStatusBadge = (status: ClassOpeningResponseDto["status"]) => {
        switch (status) {
            case "PENDING":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
                        <AlertCircle className="w-4 h-4 text-amber-500" /> Đang chờ duyệt
                    </span>
                );
            case "APPROVED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Đã duyệt
                    </span>
                );
            case "REJECTED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200 shadow-sm">
                        <XCircle className="w-4 h-4 text-rose-500" /> Đã từ chối
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
                        Chi tiết đề xuất mở lớp
                    </h3>
                    <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Trạng thái</p>
                            {renderStatusBadge(request.status)}
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Ngày gửi</p>
                            <p className="text-sm font-medium text-gray-900">
                                {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Môn học</label>
                            <p className="text-sm font-bold text-gray-900">{request.courseName}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Học kỳ</label>
                            <p className="text-sm font-medium text-gray-900">{request.semesterCode}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Sĩ số dự kiến</label>
                            <p className="text-sm font-bold text-blue-600">{request.expectedStudents} sinh viên</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Người đề xuất</label>
                            <p className="text-sm font-medium text-gray-900">{request.requesterName}</p>
                        </div>
                    </div>

                    {request.note && (
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                            <label className="text-xs font-bold text-blue-800 uppercase mb-2 block">Ghi chú</label>
                            <p className="text-sm text-blue-900 italic">"{request.note}"</p>
                        </div>
                    )}

                    {request.status === "REJECTED" && request.rejectReason && (
                        <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                            <label className="text-xs font-bold text-rose-800 uppercase mb-2 block">Lý do từ chối</label>
                            <p className="text-sm text-rose-900 font-medium">{request.rejectReason}</p>
                        </div>
                    )}
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50/80 rounded-b-2xl flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Đóng
                    </button>
                    {request.status === "PENDING" && canApprove && (
                        <>
                            <button onClick={() => { onClose(); onRejectClick(request); }} className="px-5 py-2.5 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100">
                                Từ chối
                            </button>
                            <button onClick={() => { onClose(); onCreateClassClick(request); }} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                <Layers className="w-4 h-4 inline mr-1" /> Phê duyệt & Tạo lớp
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};