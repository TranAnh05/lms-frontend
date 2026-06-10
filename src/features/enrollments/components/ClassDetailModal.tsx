import React from "react";
import { 
    X, User, Users, CalendarDays, MapPin, Clock, BookOpen, AlertCircle 
} from "lucide-react";
import clsx from "clsx";
import { type ClassInfo } from "../types";

interface ClassDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    classData: ClassInfo | null;
    courseName?: string;
    courseCode?: string;
}

const formatDayOfWeek = (day: number) => {
    return day === 8 ? "Chủ Nhật" : `Thứ ${day}`;
};

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
    isOpen,
    onClose,
    classData,
    courseName,
    courseCode,
}) => {
    if (!isOpen || !classData) return null;

    const isFull = classData.currentStudents >= classData.maxStudents;
    const fillPercent = Math.min((classData.currentStudents / classData.maxStudents) * 100, 100);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={onClose} />
            
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header */}
                <div className="bg-blue-50/50 border-b border-blue-100 px-6 py-5 flex items-start justify-between shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md tracking-wide">
                                {classData.classCode}
                            </span>
                            <span className={clsx(
                                "text-xs font-bold px-2.5 py-1 rounded-md border",
                                isFull ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            )}>
                                {isFull ? "Đã đầy" : "Còn chỗ"}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            {courseName || "Chi tiết lớp học phần"}
                        </h2>
                        {courseCode && (
                            <p className="text-sm font-medium text-gray-500 mt-1">Mã môn: {courseCode}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-xl transition-colors shadow-sm border border-transparent hover:border-gray-200 focus:outline-none"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1 bg-gray-50/30">
                    {/* General Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
                            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Giảng viên</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {classData.lecturerName || "Chưa phân công"}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
                            <div className={clsx(
                                "p-2.5 rounded-lg shrink-0",
                                isFull ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                            )}>
                                <Users className="w-5 h-5" />
                            </div>
                            <div className="w-full">
                                <div className="flex justify-between items-end mb-1.5">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sĩ số</p>
                                    <p className="text-sm font-bold">
                                        <span className={isFull ? "text-rose-600" : "text-emerald-600"}>{classData.currentStudents}</span>
                                        <span className="text-gray-400 mx-1">/</span>
                                        <span className="text-gray-900">{classData.maxStudents}</span>
                                    </p>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className={clsx("h-full rounded-full transition-all duration-500", isFull ? "bg-rose-500" : "bg-emerald-500")}
                                        style={{ width: `${fillPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedules */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2 mb-3">
                            <CalendarDays className="w-4 h-4 text-blue-600" />
                            Lịch học dự kiến
                        </h3>
                        
                        {!classData.dayOfWeek || !classData.shiftName ? (
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 text-amber-800">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="text-sm font-medium">Lớp học phần này hiện chưa có lịch học cụ thể. Vui lòng quay lại kiểm tra sau.</p>
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
                                <div className="flex items-center gap-4 sm:w-1/3">
                                    <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">
                                        1
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Ngày học</p>
                                        <p className="text-sm font-bold text-gray-900">{formatDayOfWeek(classData.dayOfWeek)}</p>
                                    </div>
                                </div>
                                
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    <div className="flex items-start gap-2.5">
                                        <Clock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase">Ca học</p>
                                            <p className="text-sm font-semibold text-gray-700">{classData.shiftName}: {classData.startTimeShilf} - {classData.endTimeShilf}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase">Phòng học</p>
                                            <p className="text-sm font-semibold text-gray-700">{classData.roomName || "Chưa sắp xếp"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-200/50"
                    >
                        Đóng cửa sổ
                    </button>
                </div>
            </div>
        </div>
    );
};