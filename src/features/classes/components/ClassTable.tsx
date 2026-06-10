import React, { useState, useRef, useEffect } from "react";
import { Eye, MoreHorizontal, ShieldAlert, UserPlus } from "lucide-react";
import clsx from "clsx";
import { type ClassDetailResponse, type PageResponse } from "../types";

const STATUS_UI = {
    PENDING: { label: "Lên kế hoạch", style: "bg-gray-100 text-gray-700 border-gray-200" },
    REGISTRATION: { label: "Mở đăng ký", style: "bg-purple-50 text-purple-700 border-purple-200" },
    ONGOING: { label: "Đang diễn ra", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    COMPLETED: { label: "Đã kết thúc", style: "bg-blue-50 text-blue-700 border-blue-200" },
    CANCELED: { label: "Đã hủy", style: "bg-red-50 text-red-700 border-red-200" },
} as const;

const ActionMenu: React.FC<{
    classItem: ClassDetailResponse;
    index: number;
    total: number;
    isHead: boolean;
    onViewDetail: (id: number) => void;
    onAssignLecturer: (id: number) => void;
}> = ({ classItem, index, total, isHead, onViewDetail, onAssignLecturer }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Nếu là 1 trong 2 dòng cuối (và bảng có > 1 dòng) -> Xổ menu lên trên
    const isBottomRow = index > 0 && index >= total - 2;

    return (
        <div className="relative flex justify-center" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "p-1.5 rounded-md outline-none transition-colors",
                    isOpen ? "bg-gray-200 text-gray-900" : "text-gray-400 hover:text-gray-800 hover:bg-gray-100"
                )}
            >
                <MoreHorizontal className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className={clsx(
                    "absolute right-6 w-44 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-[9999]",
                    isBottomRow ? "bottom-full mb-1" : "top-full mt-1"
                )}>
                    <button
                        onClick={() => { setIsOpen(false); onViewDetail(classItem.id); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                        <Eye className="w-4 h-4" /> Xem chi tiết
                    </button>

                    {isHead && !["COMPLETED", "CANCELED"].includes(classItem.status) && (
                        <button
                            onClick={() => { setIsOpen(false); onAssignLecturer(classItem.id); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                        >
                            <UserPlus className="w-4 h-4" /> Phân công
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

interface ClassTableProps {
    data: PageResponse<ClassDetailResponse> | null;
    isLoading: boolean;
    isHead: boolean;
    onViewDetail: (id: number) => void;
    onAssignLecturer: (id: number) => void;
    onPageChange: (page: number) => void;
}

export const ClassTable: React.FC<ClassTableProps> = ({ data, isLoading, isHead, onViewDetail, onAssignLecturer, onPageChange }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col relative w-full">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm text-left text-gray-500 min-w-[900px]">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50/80 border-b border-gray-100 font-bold">
                        <tr>
                            <th className="px-5 py-4 w-[12%]">Mã lớp</th>
                            <th className="px-5 py-4 w-[25%] max-w-[200px]">Môn học</th>
                            <th className="px-5 py-4 w-[12%]">Học kỳ</th>
                            <th className="px-5 py-4 w-[18%]">Giảng viên</th>
                            <th className="px-5 py-4 text-center w-[13%]">Sĩ số</th>
                            <th className="px-5 py-4 text-center w-[12%]">Trạng thái</th>
                            <th className="px-3 py-4 text-center w-[8%] sticky right-0 bg-gray-50/80 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.03)] z-20">Tác vụ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 relative">
                        {isLoading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse bg-white">
                                    <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                                    <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
                                    <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div></td>
                                    <td className="px-5 py-4"><div className="h-6 bg-gray-200 rounded-full w-24 mx-auto"></div></td>
                                    <td className="px-5 py-4 sticky right-0 bg-white"><div className="h-8 bg-gray-200 rounded-lg w-8 mx-auto"></div></td>
                                </tr>
                            ))
                        ) : !data || data.content.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-16 text-center bg-white">
                                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                                        <ShieldAlert className="w-12 h-12 text-gray-300 mb-2" />
                                        <span className="text-base font-medium text-gray-600">Không có lớp học phần nào</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.content.map((item, index) => {
                                const current = item.currentStudents || 0;
                                const max = item.maxStudents || 1;
                                const isFull = current >= max;
                                const percent = Math.min(Math.round((current / max) * 100), 100);
                                const status = STATUS_UI[item.status as keyof typeof STATUS_UI] || { label: item.status, style: "bg-gray-100 text-gray-700" };

                                return (
                                    <tr key={item.id} className="hover:bg-blue-50/40 bg-white transition-colors group relative focus-within:z-30 hover:z-30">
                                        <td className="px-5 py-4">
                                            <span className="font-semibold text-gray-900 bg-gray-50 px-2 py-1 rounded border border-gray-200 font-mono text-xs whitespace-nowrap">
                                                {item.code}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 max-w-[200px]">
                                            <p className="font-medium text-gray-900 truncate" title={item.courseName}>{item.courseName}</p>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 font-medium whitespace-nowrap">{item.semesterCode}</td>
                                        <td className="px-5 py-4">
                                            {item.lecturerName ? (
                                                <span className="text-gray-900 font-medium truncate block" title={item.lecturerName}>{item.lecturerName}</span>
                                            ) : (
                                                <span className="inline-block text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 whitespace-nowrap">Chưa phân công</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex flex-col items-center gap-1.5 w-full max-w-[80px] mx-auto">
                                                <div className="flex items-center justify-center text-xs font-semibold whitespace-nowrap">
                                                    <span className="text-gray-600">{max}</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className={clsx("h-full rounded-full transition-all duration-500", isFull ? "bg-red-500" : "bg-blue-500")} style={{ width: `${percent}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center whitespace-nowrap">
                                            <span className={clsx("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border", status.style)}>{status.label}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center sticky right-0 bg-white group-hover:bg-blue-50/40 transition-colors shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.03)] z-10">
                                            <ActionMenu classItem={item} index={index} total={data.content.length} isHead={isHead} onViewDetail={onViewDetail} onAssignLecturer={onAssignLecturer} />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            
            {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border-t border-gray-100 text-sm">
                    <span className="text-gray-500">Hiển thị {data.number * data.size + 1} - {Math.min((data.number + 1) * data.size, data.totalElements)} trong tổng {data.totalElements} lớp</span>
                    <div className="inline-flex items-center gap-1.5">
                        <button onClick={() => onPageChange(data.number - 1)} disabled={data.number === 0 || isLoading} className="px-3 py-1.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white font-medium">Trước</button>
                        <button onClick={() => onPageChange(data.number + 1)} disabled={data.number === data.totalPages - 1 || isLoading} className="px-3 py-1.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white font-medium">Sau</button>
                    </div>
                </div>
            )}
        </div>
    );
};