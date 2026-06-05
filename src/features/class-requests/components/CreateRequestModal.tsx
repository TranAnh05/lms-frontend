import React, { useState, useEffect } from "react";
import {
    X,
    FilePlus,
    BookOpen,
    Calendar,
    Users,
    MessageSquare,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { toast } from "react-toastify";
import { classRequestService } from "../services/classRequest.service";
import { type DropdownResponseDto } from "../types";

interface CreateRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    semesters: { id: number | string; name: string }[];
}

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    semesters,
}) => {
    // State form
    const [semesterId, setSemesterId] = useState<string>("");
    const [courseId, setCourseId] = useState<string>("");
    const [expectedStudents, setExpectedStudents] = useState<number | "">(40);
    const [note, setNote] = useState<string>("");
    
    // State chứa dữ liệu Môn học Dropdown từ API
    const [courses, setCourses] = useState<DropdownResponseDto[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(false);
    
    // State loading submit form
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Reset form và gọi API Môn học khi mở modal
    useEffect(() => {
        if (isOpen) {
            setSemesterId("");
            setCourseId("");
            setExpectedStudents(40);
            setNote("");

            const fetchCourses = async () => {
                setIsLoadingCourses(true);
                try {
                    const data = await classRequestService.getCourseDropdown();
                    setCourses(data);
                } catch (error) {
                    console.error("Lỗi lấy danh sách môn học:", error);
                    toast.error("Không thể tải danh sách môn học. Vui lòng thử lại.");
                } finally {
                    setIsLoadingCourses(false);
                }
            };
            fetchCourses();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate đầu vào Frontend
        if (!semesterId || !courseId) {
            toast.warning("Vui lòng chọn Học kỳ và Môn học.");
            return;
        }

        // Bám sát validation @Min(value = 10) của Backend
        if (expectedStudents === "" || expectedStudents < 10) {
            toast.warning("Một lớp học phần phải có tối thiểu 10 sinh viên!");
            return;
        }

        setIsSubmitting(true);
        try {
            // Gọi API tạo đề xuất
            await classRequestService.proposeClass({
                semesterId: Number(semesterId),
                courseId: Number(courseId),
                expectedStudents: Number(expectedStudents),
                note: note.trim() || undefined,
            });

            // Message thành công đồng bộ với Backend
            toast.success("Gửi đề xuất mở lớp học phần thành công! Vui lòng chờ phê duyệt.");
            onSuccess(); // Đóng Modal và Refresh bảng data
        } catch (error: any) {
            console.error("Lỗi khi tạo đề xuất:", error);
            // Hiển thị message lỗi từ BE nếu có
            const errorMsg = error?.response?.data?.message || "Có lỗi xảy ra khi gửi đề xuất.";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isSubmitDisabled = !semesterId || !courseId || isSubmitting || isLoadingCourses;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="absolute inset-0"
                onClick={!isSubmitting ? onClose : undefined}
            ></div>
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-blue-50/50 rounded-t-2xl">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FilePlus className="w-5 h-5 text-blue-600" />
                        Tạo Đề xuất Mở Lớp Học Phần
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="p-6 flex flex-col gap-5">
                        
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                                <Calendar className="w-3.5 h-3.5" /> Học kỳ áp dụng <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={semesterId}
                                onChange={(e) => setSemesterId(e.target.value)}
                                disabled={isSubmitting}
                                className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer disabled:bg-gray-50"
                            >
                                <option value="" disabled>-- Chọn học kỳ --</option>
                                {semesters.map((sem) => (
                                    <option key={sem.id} value={sem.id}>
                                        {sem.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                                <BookOpen className="w-3.5 h-3.5" /> Môn học đề xuất <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={courseId}
                                onChange={(e) => setCourseId(e.target.value)}
                                disabled={isSubmitting || isLoadingCourses}
                                className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
                            >
                                <option value="" disabled>
                                    {isLoadingCourses ? "Đang tải danh sách môn học..." : "-- Chọn môn học --"}
                                </option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                                <Users className="w-3.5 h-3.5" /> Sĩ số dự kiến <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative w-1/2">
                                <input
                                    type="number"
                                    min={10} 
                                    value={expectedStudents}
                                    onChange={(e) => setExpectedStudents(e.target.value === "" ? "" : Number(e.target.value))}
                                    disabled={isSubmitting}
                                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 pr-12 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
                                    SV
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1.5">
                                Ghi chú: Một lớp học phần phải có tối thiểu 10 sinh viên.
                            </p>
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                                <MessageSquare className="w-3.5 h-3.5" /> Ghi chú cho Phòng Đào tạo
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                disabled={isSubmitting}
                                placeholder="Nhập ghi chú yêu cầu về phòng học, thiết bị, ưu tiên xếp lịch..."
                                rows={3}
                                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none custom-scrollbar disabled:bg-gray-50"
                            />
                        </div>
                    </div>

                    <div className="p-5 border-t border-gray-100 bg-gray-50/80 rounded-b-2xl flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-4 focus:ring-gray-100 disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang gửi...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Gửi đề xuất
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};