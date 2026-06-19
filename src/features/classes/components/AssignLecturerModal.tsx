import React, { useEffect, useMemo, memo } from "react";
import { X, BookOpen, AlertCircle, UserCircle, CheckCircle2, Loader2 } from "lucide-react";
import { type ClassDetailResponse } from "../types";
import { useAssignLecturer } from "../hooks/useAssignLecturer";
import { LecturerSelect } from "./LecturerSelect";

interface AssignLecturerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    classItem: ClassDetailResponse | null;
}

export const AssignLecturerModal: React.FC<AssignLecturerModalProps> = memo(({
    isOpen,
    onClose,
    onSuccess,
    classItem,
}) => {
    const {
        selectedLecturerId,
        instructors,
        isLoading,
        isSubmitting,
        setSelectedLecturerId,
        handleSubmitAssign,
        isSubmitDisabled,
    } = useAssignLecturer({
        classId: classItem?.id,
        onSuccess,
    });

    // Lắng nghe sự kiện bàn phím Escape để đóng nhanh cửa sổ
    useEffect(() => {
        if (!isOpen || isSubmitting) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isSubmitting, onClose]);

    // Ghi nhớ mảng giảng viên đã format để tránh tạo tham chiếu mới khi re-render
    const formattedLecturers = useMemo(() => {
        return instructors.map(ins => ({ id: ins.id, fullName: ins.name }));
    }, [instructors]);

    if (!isOpen || !classItem) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Lớp phủ nền sau, chặn bấm đóng khi đang trong tiến trình submit */}
            <div className="absolute inset-0" onClick={!isSubmitting ? onClose : undefined} />

            <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                
                {/* Tiêu đề Modal */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <UserCircle className="w-5 h-5 text-blue-600" />
                        Phân công Giảng viên
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nội dung chính */}
                <div className="p-6 flex flex-col gap-5">
                    {/* Cảnh báo ghi đè giảng viên cũ */}
                    {classItem.lecturerName && (
                        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                            <p className="text-sm leading-relaxed">
                                Lớp đang được giao cho giảng viên <strong>{classItem.lecturerName}</strong>. 
                                Hành động này sẽ thay thế bằng giảng viên mới.
                            </p>
                        </div>
                    )}

                    {/* Tóm tắt thông tin lớp học */}
                    <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-xl flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-gray-900">{classItem.courseName}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 font-medium">
                                <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono border border-blue-200">
                                    {classItem.code}
                                </span>
                                <span>{classItem.semesterCode}</span>
                            </div>
                        </div>
                    </div>

                    {/* Ô chọn tìm kiếm giảng viên */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">
                            Chọn giảng viên
                        </label>
                        <LecturerSelect
                            lecturers={formattedLecturers}
                            value={selectedLecturerId}
                            onChange={setSelectedLecturerId}
                            isLoading={isLoading}
                            disabled={isSubmitting}
                            placeholder="Gõ để tìm kiếm giảng viên..."
                        />
                    </div>
                </div>

                {/* Chân trang Button Điều khiển */}
                <div className="p-5 border-t border-gray-100 bg-gray-50/80 rounded-b-2xl flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSubmitAssign}
                        disabled={isSubmitDisabled}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <CheckCircle2 className="w-4 h-4" />
                        )}
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
});

AssignLecturerModal.displayName = "AssignLecturerModal";