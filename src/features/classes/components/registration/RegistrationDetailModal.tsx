import React, { useState, useEffect } from "react";
import { 
    X, 
    CalendarDays, 
    StopCircle, 
    Users, 
    BookOpen, 
    Loader2,
    GraduationCap
} from "lucide-react";
import clsx from "clsx";
import { toast } from "react-toastify";
import { registrationService } from "../../services/registration.service";
import { type RegistrationPeriodDetailResponse } from "../../types/registration.types";

interface RegistrationDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    periodId: number | null;
    onSuccess: () => void;
}

const formatDateTime = (isoString: string) => {
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    }).format(new Date(isoString));
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
    const [detailData, setDetailData] = useState<RegistrationPeriodDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isClosing, setIsClosing] = useState<boolean>(false);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!periodId || !isOpen) return;
            
            setIsLoading(true);
            try {
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-all duration-200">
            <div className="absolute inset-0" onClick={!isClosing ? onClose : undefined} />

            <div className="relative w-full max-w-6xl bg-gray-50/90 rounded-2xl shadow-2xl flex flex-col h-[90vh] overflow-hidden transition-transform duration-200 scale-100">
                
                {isLoading || !detailData ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white">
                        <Loader2 className="w-9 h-9 text-blue-600 animate-spin mb-3" />
                        <p className="text-gray-500 font-medium text-sm">Đang tải dữ liệu chi tiết...</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white border-b border-gray-100 shrink-0 p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight leading-none">
                                        {detailData.name}
                                    </h3>
                                    <span className={clsx(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap",
                                        STATUS_UI_CONFIG[detailData.status]?.style
                                    )}>
                                        {STATUS_UI_CONFIG[detailData.status]?.label}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500 font-medium">
                                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                                        <CalendarDays className="w-4 h-4 text-gray-400" />
                                        Mở: {formatDateTime(detailData.startTime)} - Đóng: {formatDateTime(detailData.endTime)}
                                    </span>
                                    <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-300" />
                                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                                        <GraduationCap className="w-4 h-4 text-gray-400" />
                                        Học kỳ: {detailData.semesterName}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                {detailData.status === "ACTIVE" && (
                                    <button
                                        onClick={handleForceClose}
                                        disabled={isClosing}
                                        className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 text-sm font-semibold rounded-xl hover:bg-rose-100 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap"
                                    >
                                        {isClosing ? <Loader2 className="w-4 h-4 animate-spin" /> : <StopCircle className="w-4 h-4" />}
                                        Đóng đăng ký sớm
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            <div className="flex flex-wrap gap-4">
                                <div className="bg-white px-5 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 min-w-[220px]">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Tổng lớp mở</p>
                                        <p className="text-2xl font-extrabold text-gray-900 leading-none">{detailData.totalClasses || 0}</p>
                                    </div>
                                </div>

                                <div className="bg-white px-5 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 min-w-[220px]">
                                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Lượt đăng ký</p>
                                        <p className="text-2xl font-extrabold text-gray-900 leading-none">{detailData.totalEnrollments || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h4 className="font-bold text-gray-900 text-sm tracking-tight">Danh sách Lớp học phần trong đợt</h4>
                                </div>
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-sm text-left text-gray-500 border-collapse min-w-[800px]">
                                        <thead className="text-xs text-gray-400 uppercase bg-white border-b border-gray-100 font-bold tracking-wider whitespace-nowrap">
                                            <tr>
                                                <th scope="col" className="px-5 py-4">Mã lớp</th>
                                                <th scope="col" className="px-5 py-4 min-w-[250px]">Môn học</th>
                                                <th scope="col" className="px-5 py-4">Sĩ số lớp</th>
                                                <th scope="col" className="px-5 py-4">Giảng viên</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {detailData.classes.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic text-sm">
                                                        Chưa có lớp học phần nào được gắn vào đợt này.
                                                    </td>
                                                </tr>
                                            ) : (
                                                detailData.classes.map((cls) => {
                                                    const percent = Math.min(Math.round((cls.enrolledCount / cls.maxStudents) * 100), 100);

                                                    return (
                                                        <tr key={cls.id} className="hover:bg-blue-50/20 transition-colors">
                                                            <td className="px-5 py-4 whitespace-nowrap">
                                                                <span className="font-bold text-gray-700 bg-gray-100 px-2.5 py-1.5 rounded-lg border border-gray-200 font-mono text-xs shadow-sm">
                                                                    {cls.code}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-4 whitespace-nowrap">
                                                                <p className="font-semibold text-gray-900 text-sm">{cls.courseName}</p>
                                                            </td>
                                                            <td className="px-5 py-4 whitespace-nowrap">
                                                                <div className="inline-flex items-center gap-3">
                                                                    <span className={clsx("text-sm font-bold", percent >= 100 ? "text-rose-600" : "text-gray-700")}>
                                                                        {cls.enrolledCount} / {cls.maxStudents}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-4 text-gray-600 text-sm font-medium whitespace-nowrap">
                                                                {cls.lecturerName || (
                                                                    <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                                                                        Chưa phân công
                                                                    </span>
                                                                )}
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