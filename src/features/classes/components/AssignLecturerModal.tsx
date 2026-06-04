import React, { useEffect } from "react";
import {
    X,
    BookOpen,
    AlertCircle,
    Building2,
    CheckCircle2,
    UserCircle,
} from "lucide-react";
import { type ClassResponse, type DepartmentBasic } from "../types";
import { useAssignLecturer } from "../hooks/useAssignLecturer";
import { LecturerSelect } from "./LecturerSelect";

interface AssignLecturerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    classItem: ClassResponse | null;
    departments: DepartmentBasic[];
}

export const AssignLecturerModal: React.FC<AssignLecturerModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    classItem,
    departments,
}) => {
    const {
        selectedDepartmentId,
        selectedLecturerId,
        lecturers,
        isFetchingLecturers,
        isSubmitting,
        handleDepartmentChange,
        handleLecturerChange,
        handleSubmitAssign,
        handleReset,
        isSubmitDisabled,
    } = useAssignLecturer({
        classId: classItem?.id,
        initialDepartmentId: classItem?.course.departmentId,
        onSuccess: onSuccess,
    });

    useEffect(() => {
        if (!isOpen) {
            handleReset();
        }
    }, [isOpen, handleReset]);

    if (!isOpen || !classItem) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="absolute inset-0"
                onClick={!isSubmitting ? onClose : undefined}
            ></div>

            <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <UserCircle className="w-5 h-5 text-blue-600" />
                        Phân công Giảng viên
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-5">
                    {classItem.lecturer && (
                        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                            <p className="text-sm leading-relaxed">
                                Lớp học phần này đang được giao cho giảng viên{" "}
                                <strong>{classItem.lecturer.fullName}</strong>.
                                Hành động này sẽ thay thế bằng giảng viên mới.
                            </p>
                        </div>
                    )}

                    <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-xl flex flex-col gap-2">
                        <div className="flex items-start gap-2.5">
                            <BookOpen className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs font-mono mr-2 border border-blue-200">
                                        {classItem.code}
                                    </span>
                                    {classItem.course.name}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 font-medium">
                                    <span>
                                        Học kỳ:{" "}
                                        {classItem.semester.semesterCode}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span>
                                        {classItem.course.credits} Tín chỉ
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 my-1"></div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">
                            Lọc theo Khoa
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Building2 className="w-4 h-4 text-gray-400" />
                            </div>
                            <select
                                value={selectedDepartmentId}
                                onChange={(e) =>
                                    handleDepartmentChange(e.target.value)
                                }
                                disabled={isSubmitting}
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-10 pr-10 py-2.5 outline-none cursor-pointer transition-all appearance-none disabled:bg-gray-50"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                    backgroundPosition: "right 0.75rem center",
                                    backgroundSize: "1rem",
                                    backgroundRepeat: "no-repeat",
                                }}
                            >
                                <option value="" disabled>
                                    -- Chọn Khoa phụ trách --
                                </option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">
                            Chọn Giảng viên phụ trách
                        </label>
                        <LecturerSelect
                            lecturers={lecturers}
                            value={selectedLecturerId}
                            onChange={handleLecturerChange}
                            isLoading={isFetchingLecturers}
                            disabled={!selectedDepartmentId || isSubmitting}
                            placeholder={
                                !selectedDepartmentId
                                    ? "Vui lòng chọn Khoa trước..."
                                    : "Gõ để tìm kiếm giảng viên..."
                            }
                        />
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50/80 rounded-b-2xl flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-4 focus:ring-gray-100 disabled:opacity-50"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSubmitAssign}
                        disabled={isSubmitDisabled}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-500/20 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Xác nhận phân công
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
