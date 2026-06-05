import React, { useState, useEffect, useMemo } from "react";
import { 
    X, 
    CalendarDays, 
    StopCircle, 
    Users, 
    BookOpen, 
    AlertTriangle, 
    TrendingUp,
    Loader2
} from "lucide-react";
import clsx from "clsx";
import { toast } from "react-toastify";

import { type ClassDetailResponse } from "../../types";
import { type RegistrationPeriodResponse } from "../../types/registration.types";
import { registrationService } from "../../services/registration.service";

// Định nghĩa Type mở rộng cho màn hình Chi tiết (Bao gồm Thông tin đợt + Danh sách lớp)
export interface RegistrationPeriodDetail extends RegistrationPeriodResponse {
    classes: ClassDetailResponse[];
}

interface RegistrationDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    periodId: number | null;
    onSuccess: () => void; // Trigger để reload lại bảng bên ngoài sau khi Đóng đợt
}

// Helper: Format Date
const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    }).format(date);
};

const STATUS_UI_CONFIG: Record<string, { label: string; style: string }> = {
    PENDING: { label: "Sắp diễn ra", style: "bg-amber-50 text-amber-700 border-amber-200" },
    ACTIVE: { label: "Đang mở", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    CLOSED: { label: "Đã đóng", style: "bg-gray-100 text-gray-700 border-gray-200" },
};

export const RegistrationDetailModal: React.FC<RegistrationDetailModalProps> = ({
    isOpen,
    onClose,
    periodId,
    onSuccess
}) => {
    const [detailData, setDetailData] = useState<RegistrationPeriodDetail | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isClosing, setIsClosing] = useState<boolean>(false);

    // ========================================================================
    // FETCH DATA
    // ========================================================================
    useEffect(() => {
        const fetchDetail = async () => {
            if (!periodId || !isOpen) return;
            
            setIsLoading(true);
            try {
                // TẠM THỜI MOCK: Gọi API lấy chi tiết đợt đăng ký
                // Thực tế: await registrationService.getRegistrationPeriodDetail(periodId)
                const response = await registrationService.getRegistrationPeriodDetail(periodId);
                setDetailData(response);
            } catch (error) {
                console.error(error);
                toast.error("Không thể tải thông tin chi tiết đợt đăng ký.");
                onClose();
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetail();
    }, [periodId, isOpen, onClose]);

    // ========================================================================
    // TÍNH TOÁN KPI THỐNG KÊ
    // ========================================================================
    const stats = useMemo(() => {
        if (!detailData) return { totalClasses: 0, totalStudents: 0, overload: 0, warning: 0 };
        
        const classes = detailData.classes;
        let totalStudents = 0;
        let overload = 0;
        let warning = 0;

        classes.forEach(c => {
            totalStudents += c.currentStudents;
            if (c.currentStudents >= c.maxStudents) overload += 1;
            if (c.currentStudents < 10) warning += 1; // Dưới 10 sinh viên -> Cảnh báo ế
        });

        return {
            totalClasses: classes.length,
            totalStudents,
            overload,
            warning
        };
    }, [detailData]);

    // ========================================================================
    // HANDLERS
    // ========================================================================
    const handleForceClose = async () => {
        if (!periodId) return;
        
        const confirmMsg = "Bạn có chắc chắn muốn đóng đợt đăng ký này sớm hơn dự kiến? Hành động này sẽ chuyển tất cả các lớp đang mở sang trạng thái 'Đang diễn ra'.";
        if (!window.confirm(confirmMsg)) return;

        setIsClosing(true);
        try {
            await registrationService.closeRegistrationPeriod(periodId);
            toast.success("Đã đóng đợt đăng ký thành công!");
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Đã xảy ra lỗi khi đóng đợt đăng ký.");
        } finally {
            setIsClosing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={!isClosing ? onClose : undefined}></div>

            <div className="relative w-full max-w-6xl bg-gray-50/50 rounded-2xl shadow-2xl flex flex-col h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden">
                
                {isLoading || !detailData ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Đang tải dữ liệu chi tiết...</p>
                    </div>
                ) : (
                    <>
                        {/* ================= HEADER ================= */}
                        <div className="bg-white border-b border-gray-100 shrink-0 p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 shadow-sm">
                            <div>
                                <div className="flex items-center gap-3 mb-1.5">
                                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                        {detailData.name}
                                    </h3>
                                    <span className={clsx(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide border whitespace-nowrap",
                                        STATUS_UI_CONFIG[detailData.status]?.style
                                    )}>
                                        {STATUS_UI_CONFIG[detailData.status]?.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <CalendarDays className="w-4 h-4 text-gray-400" />
                                        Mở: {formatDateTime(detailData.startTime)} - Đóng: {formatDateTime(detailData.endTime)}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span>Học kỳ: {detailData.semester.semesterCode}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 shrink-0">
                                {detailData.status === 'ACTIVE' && (
                                    <button
                                        onClick={handleForceClose}
                                        disabled={isClosing}
                                        className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 font-bold rounded-lg hover:bg-rose-100 transition-colors focus:ring-4 focus:ring-rose-500/20 disabled:opacity-50"
                                    >
                                        {isClosing ? <Loader2 className="w-4 h-4 animate-spin" /> : <StopCircle className="w-4 h-4" />}
                                        Đóng đăng ký
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* ================= BODY ================= */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                            
                            {/* KHU VỰC 2: KPI DASHBOARD */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tổng lớp mở</p>
                                        <p className="text-2xl font-black text-gray-900">{stats.totalClasses}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Lượt đăng ký</p>
                                        <p className="text-2xl font-black text-gray-900">{stats.totalStudents}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm flex items-start gap-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-bl-full -z-0"></div>
                                    <div className="p-3 bg-rose-50 text-rose-600 rounded-lg shrink-0 z-10">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <div className="z-10">
                                        <p className="text-xs font-bold text-rose-600/80 uppercase tracking-wider mb-1">Lớp đã đầy (100%)</p>
                                        <p className="text-2xl font-black text-rose-700">{stats.overload}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm flex items-start gap-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -z-0"></div>
                                    <div className="p-3 bg-amber-50 text-amber-600 rounded-lg shrink-0 z-10">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <div className="z-10">
                                        <p className="text-xs font-bold text-amber-600/80 uppercase tracking-wider mb-1">Lớp vắng (&lt;10 SV)</p>
                                        <p className="text-2xl font-black text-amber-700">{stats.warning}</p>
                                    </div>
                                </div>
                            </div>

                            {/* KHU VỰC 3: DANH SÁCH LỚP HỌC PHẦN CƠ BẢN */}
                            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
                                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h4 className="font-bold text-gray-900">Danh sách Lớp học phần trong đợt</h4>
                                </div>
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-white border-b border-gray-100 font-bold">
                                            <tr>
                                                <th scope="col" className="px-5 py-4 w-[15%]">Mã lớp</th>
                                                <th scope="col" className="px-5 py-4 w-[35%]">Môn học</th>
                                                <th scope="col" className="px-5 py-4 w-[25%]">Sĩ số / Tỷ lệ lấp đầy</th>
                                                <th scope="col" className="px-5 py-4 w-[25%]">Giảng viên</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {detailData.classes.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic">
                                                        Chưa có lớp học phần nào được gắn vào đợt này.
                                                    </td>
                                                </tr>
                                            ) : (
                                                detailData.classes.map((cls) => {
                                                    const percent = Math.min(Math.round((cls.currentStudents / cls.maxStudents) * 100), 100);
                                                    let progressColor = "bg-emerald-500";
                                                    if (percent >= 100) progressColor = "bg-rose-500";
                                                    else if (percent < 30) progressColor = "bg-amber-400";

                                                    return (
                                                        <tr key={cls.id} className="hover:bg-blue-50/30 transition-colors">
                                                            <td className="px-5 py-3">
                                                                <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded border border-gray-200 font-mono text-xs">
                                                                    {cls.code}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                <p className="font-bold text-gray-900">{cls.course.name}</p>
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                <div className="flex flex-col gap-1.5 w-full max-w-[200px]">
                                                                    <div className="flex justify-between items-center text-xs font-bold">
                                                                        <span className={percent >= 100 ? "text-rose-600" : "text-gray-700"}>
                                                                            {cls.currentStudents} / {cls.maxStudents}
                                                                        </span>
                                                                        <span className="text-gray-500">{percent}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                                        <div 
                                                                            className={clsx("h-2 rounded-full transition-all duration-500", progressColor)} 
                                                                            style={{ width: `${percent}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3 text-gray-600">
                                                                {cls.lecturer ? cls.lecturer.fullName : <span className="italic text-amber-600 text-xs">Chưa phân công</span>}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </div>
        </div>
    );
};