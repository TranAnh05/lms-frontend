import React, { useState, useEffect } from "react";
import { Layers, Calendar, BookOpen, Clock, MapPin, Users, User, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { classRequestService } from "../services/classRequest.service";
import { type ClassOpeningResponseDto, type DropdownResponseDto } from "../types";

export interface ClassConfigItem {
    roomId: number | "";
    shiftId: number | "";
    dayOfWeek: number;
    maxStudents: number;
}

const DAYS_OF_WEEK = [
    { value: 2, label: "Thứ Hai" }, { value: 3, label: "Thứ Ba" },
    { value: 4, label: "Thứ Tư" }, { value: 5, label: "Thứ Năm" },
    { value: 6, label: "Thứ Sáu" }, { value: 7, label: "Thứ Bảy" },
    { value: 8, label: "Chủ Nhật" },
];

interface CreateClassFromRequestModalProps {
    isOpen: boolean;
    onSuccess: () => void; 
    request: (ClassOpeningResponseDto & { semesterId?: number }) | null;
    onConfirm: (payload: any) => Promise<void>;
}

export const CreateClassFromRequestModal: React.FC<CreateClassFromRequestModalProps> = ({
    isOpen,
    onSuccess,
    request,
    onConfirm,
}) => {
    const [classCount, setClassCount] = useState<number>(1);
    const [classesData, setClassesData] = useState<ClassConfigItem[]>([]);
    
    const [shifts, setShifts] = useState<DropdownResponseDto[]>([]);
    const [rooms, setRooms] = useState<DropdownResponseDto[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoadingDropdowns, setIsLoadingDropdowns] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            const fetchDropdowns = async () => {
                setIsLoadingDropdowns(true);
                try {
                    const [shiftsData, roomsData] = await Promise.all([
                        classRequestService.getShiftsDropdown(),
                        classRequestService.getRoomsDropdown(),
                    ]);
                    setShifts(shiftsData);
                    setRooms(roomsData);
                } catch {
                    toast.error("Không thể tải danh mục Phòng và Ca học.");
                } finally {
                    setIsLoadingDropdowns(false);
                }
            };
            fetchDropdowns();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && request) {
            setClassesData((prev) => {
                return Array.from({ length: classCount }, (_, idx) => {
                    if (prev[idx]) return prev[idx];
                    return { dayOfWeek: 2, shiftId: "", roomId: "", maxStudents: 40 };
                });
            });
        }
    }, [classCount, isOpen, request]);

    if (!isOpen || !request) return null;

    const handleClassChange = (index: number, field: keyof ClassConfigItem, value: any) => {
        setClassesData((prev) => {
            const temp = [...prev];
            temp[index] = { ...temp[index], [field]: value };
            return temp;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        for (let i = 0; i < classesData.length; i++) {
            const cls = classesData[i];
            if (!cls.roomId || !cls.shiftId) {
                toast.error(`Vui lòng chọn Phòng và Ca học cho Lớp thứ ${i + 1}.`);
                return;
            }
            if (cls.maxStudents < 1) {
                toast.error(`Sĩ số của Lớp thứ ${i + 1} phải từ 1 trở lên.`);
                return;
            }
        }

        setIsSubmitting(true);
        try {
            await onConfirm({
                requestId: request.requestId,
                // semesterId: request.semesterId || 0,
                semesterId: 5,
                courseId: request.courseId,
                managerId: request.requesterId, // Lấy trực tiếp từ người đề xuất
                classes: classesData.map(c => ({
                    roomId: Number(c.roomId),
                    shiftId: Number(c.shiftId),
                    dayOfWeek: Number(c.dayOfWeek),
                    maxStudents: Number(c.maxStudents)
                }))
            });
            onSuccess(); 
        } catch {
            console.error("Lỗi khi tạo lớp");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Vô hiệu hóa backdrop click */}
            <div className="absolute inset-0"></div>
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col h-[90vh] animate-in zoom-in-95 duration-200">
                
                <div className="flex items-center justify-between p-5 border-b border-gray-150 bg-blue-50/30 rounded-t-2xl shrink-0">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-blue-600" />
                        Khởi Tạo Lớp Học Phần
                    </h3>
                    <div className="text-xs font-semibold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
                        Vui lòng hoàn tất biểu mẫu để tiếp tục
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6 bg-gray-50/50">
                        
                        <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
                            <div className="flex items-start gap-2.5">
                                <BookOpen className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Môn học</p>
                                    <p className="text-sm font-bold text-gray-900 mt-0.5">{request.courseName}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5 border-t md:border-t-0 md:border-l border-gray-100 md:pl-4">
                                <Calendar className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Học kỳ</p>
                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{request.semesterCode}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5 border-t md:border-t-0 md:border-l border-gray-100 md:pl-4">
                                <Users className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">SV dự kiến</p>
                                    <p className="text-base font-black text-amber-600 mt-0.5">{request.expectedStudents}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm space-y-4">
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase mb-2">
                                    <User className="w-4 h-4 text-gray-500" /> Quản lý chung (Trưởng khoa)
                                </label>
                                <div className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-700 font-medium cursor-not-allowed">
                                    {request.requesterName}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800">Số lượng phân lớp thực tế</h4>
                                    <p className="text-xs text-gray-500 mt-1">Hệ thống sẽ tự động sinh mã lớp học phần (Ví dụ: SWE101-01, SWE101-02).</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number" min={1} max={10}
                                        value={classCount}
                                        onChange={(e) => setClassCount(Math.max(1, Number(e.target.value)))}
                                        disabled={isSubmitting}
                                        className="w-20 bg-gray-50 border border-gray-300 rounded-lg p-2 text-center text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    />
                                    <span className="text-sm font-medium text-gray-600">Lớp</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {classesData.map((cls, idx) => (
                                <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                    <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
                                        <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
                                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Cấu hình Lớp thứ {idx + 1}</span>
                                    </div>
                                    <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Sĩ số tối đa <span className="text-rose-500">*</span></label>
                                            <input
                                                type="number" min={1}
                                                value={cls.maxStudents}
                                                onChange={(e) => handleClassChange(idx, "maxStudents", Number(e.target.value))}
                                                disabled={isSubmitting}
                                                className="w-full text-sm bg-white border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Thứ <span className="text-rose-500">*</span></label>
                                            <select
                                                value={cls.dayOfWeek}
                                                onChange={(e) => handleClassChange(idx, "dayOfWeek", Number(e.target.value))}
                                                disabled={isSubmitting}
                                                className="w-full text-sm bg-white border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            >
                                                {DAYS_OF_WEEK.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-1 text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                                                <Clock className="w-3 h-3"/> Ca học <span className="text-rose-500">*</span>
                                            </label>
                                            <select
                                                value={cls.shiftId}
                                                onChange={(e) => handleClassChange(idx, "shiftId", Number(e.target.value))}
                                                disabled={isSubmitting || isLoadingDropdowns}
                                                className="w-full text-sm bg-white border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            >
                                                <option value="" disabled>-- Chọn Ca --</option>
                                                {shifts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-1 text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                                                <MapPin className="w-3 h-3"/> Phòng học <span className="text-rose-500">*</span>
                                            </label>
                                            <select
                                                value={cls.roomId}
                                                onChange={(e) => handleClassChange(idx, "roomId", Number(e.target.value))}
                                                disabled={isSubmitting || isLoadingDropdowns}
                                                className="w-full text-sm bg-white border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            >
                                                <option value="" disabled>-- Chọn Phòng --</option>
                                                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-white flex justify-end shrink-0">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all focus:ring-4 focus:ring-blue-500/20 disabled:bg-blue-400"
                        >
                            {isSubmitting ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <CheckCircle2 className="w-5 h-5" />
                            )}
                            Khởi tạo {classesData.length} Lớp Học Phần
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};