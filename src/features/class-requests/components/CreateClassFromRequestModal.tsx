import React, { useState, useEffect } from "react";
import {
    X,
    Layers,
    Calendar,
    BookOpen,
    Plus,
    Trash2,
    Clock,
    MapPin,
    Users,
    User,
    CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import {
    type ClassRequestResponse,
    type CreateClassPayload,
    type ClassSchedulePayload,
} from "../types";

const MOCK_LECTURERS = [
    { id: 10, name: "ThS. Trần Giảng Viên" },
    { id: 11, name: "TS. Lê Data" },
    { id: 12, name: "ThS. Phạm Cloud" },
];

const MOCK_SHIFTS = [
    { id: 1, name: "Ca 1 (07:00 - 09:15)" },
    { id: 2, name: "Ca 2 (09:30 - 11:45)" },
    { id: 3, name: "Ca 3 (13:00 - 15:15)" },
    { id: 4, name: "Ca 4 (15:30 - 17:45)" },
    { id: 5, name: "Ca Tối (18:00 - 20:15)" },
];

const MOCK_ROOMS = [
    { id: 1, name: "Phòng Lý Thuyết A101 (Sức chứa 50)" },
    { id: 2, name: "Phòng Lý Thuyết A102 (Sức chứa 50)" },
    { id: 3, name: "Phòng Máy Tính LAB 1 (Sức chứa 40)" },
    { id: 4, name: "Phòng Máy Tính LAB 2 (Sức chứa 40)" },
    { id: 5, name: "Hội Trường Lớn H1 (Sức chứa 150)" },
];

const DAYS_OF_WEEK = [
    { value: 2, label: "Thứ Hai" },
    { value: 3, label: "Thứ Ba" },
    { value: 4, label: "Thứ Tư" },
    { value: 5, label: "Thứ Năm" },
    { value: 6, label: "Thứ Sáu" },
    { value: 7, label: "Thứ Bảy" },
    { value: 8, label: "Chủ Nhật" },
];

interface CreateClassFromRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: ClassRequestResponse | null;
    onConfirm: (payload: {
        requestId: number;
        classes: CreateClassPayload[];
    }) => Promise<void>;
}

export const CreateClassFromRequestModal: React.FC<
    CreateClassFromRequestModalProps
> = ({ isOpen, onClose, request, onConfirm }) => {
    const [classCount, setClassCount] = useState<number>(1);
    const [classesData, setClassesData] = useState<CreateClassPayload[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen && request) {
            const updatedClasses = Array.from(
                { length: classCount },
                (_, idx) => {
                    const suffixes = ["01", "02", "03", "04", "05", "06", "07"];
                    const suffix = suffixes[idx] || `${idx + 1}`;
                    if (classesData[idx]) return classesData[idx];
                    return {
                        code: `${request.course.code}-${suffix}`,
                        maxStudents: 40,
                        lecturerId: null,
                        schedules: [{ dayOfWeek: 2, shiftId: 1, roomId: 1 }],
                    };
                },
            );
            setClassesData(updatedClasses);
        }
    }, [classCount, isOpen, request]);

    if (!isOpen || !request) return null;

    const handleClassFieldChange = (
        index: number,
        field: keyof CreateClassPayload,
        value: any,
    ) => {
        const temp = [...classesData];
        temp[index] = { ...temp[index], [field]: value };
        setClassesData(temp);
    };

    const handleAddSchedule = (classIndex: number) => {
        const temp = [...classesData];
        temp[classIndex].schedules.push({
            dayOfWeek: 2,
            shiftId: 1,
            roomId: 1,
        });
        setClassesData(temp);
    };

    const handleRemoveSchedule = (
        classIndex: number,
        scheduleIndex: number,
    ) => {
        const temp = [...classesData];
        if (temp[classIndex].schedules.length <= 1) {
            toast.warning(
                "Mỗi lớp học phần bắt buộc phải có ít nhất 1 buổi học.",
            );
            return;
        }
        temp[classIndex].schedules.splice(scheduleIndex, 1);
        setClassesData(temp);
    };

    const handleScheduleFieldChange = (
        classIndex: number,
        scheduleIndex: number,
        field: keyof ClassSchedulePayload,
        value: number,
    ) => {
        const temp = [...classesData];
        temp[classIndex].schedules[scheduleIndex] = {
            ...temp[classIndex].schedules[scheduleIndex],
            [field]: value,
        };
        setClassesData(temp);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        for (const cls of classesData) {
            if (!cls.code.trim()) {
                toast.error("Vui lòng điền đầy đủ Mã lớp học phần.");
                return;
            }
            if (cls.maxStudents <= 0) {
                toast.error("Sĩ số tối đa của lớp học phần phải lớn hơn 0.");
                return;
            }
        }

        setIsSubmitting(true);
        try {
            await onConfirm({
                requestId: request.id,
                classes: classesData,
            });
            toast.success(
                `Đã phê duyệt đề xuất và tạo thành công ${classesData.length} lớp học phần!`,
            );
            onClose();
        } catch (error) {
            console.error("Lỗi khi xử lý phê duyệt tạo lớp:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="absolute inset-0"
                onClick={!isSubmitting ? onClose : undefined}
            ></div>
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col h-[90vh] animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-5 border-b border-gray-150 bg-blue-50/30 rounded-t-2xl shrink-0">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-blue-600" />
                            Phê Duyệt & Cấu Hình Mở Lớp Học Phần
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex-1 flex flex-col overflow-hidden"
                >
                    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6 bg-gray-50/50">
                        <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-sm">
                            <div className="flex items-start gap-2.5">
                                <BookOpen className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                        Môn học đề xuất
                                    </p>
                                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                                        {request.course.name}
                                    </p>
                                    <div className="flex flex-wrap items-baseline gap-2 mt-1.5">
                                        <span className="inline-flex items-baseline text-[11px] text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                                            <span className="text-gray-500 mr-1.5">
                                                Mã môn:
                                            </span>
                                            <strong>
                                                {request.course.code}
                                            </strong>
                                        </span>
                                        <span className="inline-flex items-baseline text-[11px] text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                                            <span className="text-gray-500 mr-1.5">
                                                Số tín chỉ:
                                            </span>
                                            <strong>
                                                {request.course.credits}
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 border-t md:border-t-0 md:border-x border-gray-100 md:px-4">
                                <Calendar className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                        Học kỳ áp dụng
                                    </p>
                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                                        {request.semester.semesterCode}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Năm học: {request.semester.academicYear}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 border-t md:border-t-0 md:border-r border-gray-100 md:pr-4">
                                <User className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                        Người đề xuất
                                    </p>
                                    <p className="text-sm font-bold text-gray-800 mt-0.5">
                                        {request.requester.fullName}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 border-t md:border-t-0 md:pl-2">
                                <Users className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                        Tổng SV dự kiến
                                    </p>
                                    <p className="text-base font-black text-amber-600 mt-0.5">
                                        {request.expectedStudents}{" "}
                                        <span className="text-xs font-normal text-gray-500">
                                            Sinh viên
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                            <div className="max-w-md">
                                <h4 className="text-sm font-bold flex items-center gap-1.5">
                                    Quyết định số lượng lớp mở thực tế
                                </h4>
                                <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                                    Dựa vào phòng học còn trống và số lượng
                                    giảng viên sẵn sàng, vui lòng nhập số lớp
                                    cần mở. Hệ thống sẽ sinh số lượng biểu mẫu
                                    tương ứng phía dưới.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-lg border border-white/20 self-start sm:self-auto">
                                <label className="text-xs font-semibold pl-2 shrink-0">
                                    Số lớp cần mở:
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={classCount}
                                    onChange={(e) =>
                                        setClassCount(
                                            Math.max(1, Number(e.target.value)),
                                        )
                                    }
                                    disabled={isSubmitting}
                                    className="w-16 bg-white text-gray-900 border-none rounded p-1.5 text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-5">
                            {classesData.map((cls, classIdx) => (
                                <div
                                    key={classIdx}
                                    className="bg-white border border-gray-200/80 rounded-xl shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-200"
                                >
                                    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                            <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-[11px] font-black">
                                                {classIdx + 1}
                                            </span>
                                            Cấu hình lớp thứ {classIdx + 1}
                                        </span>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                                    Mã lớp học phần{" "}
                                                    <span className="text-rose-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={cls.code}
                                                    onChange={(e) =>
                                                        handleClassFieldChange(
                                                            classIdx,
                                                            "code",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="VD: SWE101-01"
                                                    disabled={isSubmitting}
                                                    className="w-full text-xs font-mono bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                                    Sĩ số tối đa (Max){" "}
                                                    <span className="text-rose-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={cls.maxStudents}
                                                    onChange={(e) =>
                                                        handleClassFieldChange(
                                                            classIdx,
                                                            "maxStudents",
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    placeholder="VD: 40"
                                                    disabled={isSubmitting}
                                                    className="w-full text-xs bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                                    Phân công giảng viên (Tùy
                                                    chọn)
                                                </label>
                                                <select
                                                    value={cls.lecturerId || ""}
                                                    onChange={(e) =>
                                                        handleClassFieldChange(
                                                            classIdx,
                                                            "lecturerId",
                                                            e.target.value
                                                                ? Number(
                                                                      e.target
                                                                          .value,
                                                                  )
                                                                : null,
                                                        )
                                                    }
                                                    disabled={isSubmitting}
                                                    className="w-full text-xs bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none cursor-pointer"
                                                >
                                                    <option value="">
                                                        -- Chưa phân công --
                                                    </option>
                                                    {MOCK_LECTURERS.map((l) => (
                                                        <option
                                                            key={l.id}
                                                            value={l.id}
                                                        >
                                                            {l.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="border border-gray-150 rounded-lg bg-gray-50/50 p-3.5 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h5 className="text-xs font-bold text-gray-600 flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                    Thời khóa biểu hàng tuần
                                                </h5>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleAddSchedule(
                                                            classIdx,
                                                        )
                                                    }
                                                    disabled={isSubmitting}
                                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-white hover:bg-blue-50 border border-blue-200 px-2 py-1 rounded transition-all focus:outline-none shadow-xs"
                                                >
                                                    <Plus className="w-3 h-3" />{" "}
                                                    Thêm buổi học
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                {cls.schedules.map(
                                                    (sched, schedIdx) => (
                                                        <div
                                                            key={schedIdx}
                                                            className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center bg-white p-2 border border-gray-200 rounded-lg shadow-sm"
                                                        >
                                                            <select
                                                                value={
                                                                    sched.dayOfWeek
                                                                }
                                                                onChange={(e) =>
                                                                    handleScheduleFieldChange(
                                                                        classIdx,
                                                                        schedIdx,
                                                                        "dayOfWeek",
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                }
                                                                disabled={
                                                                    isSubmitting
                                                                }
                                                                className="w-full sm:w-[130px] shrink-0 text-xs bg-gray-50 border border-gray-300 rounded p-2 text-gray-800 focus:border-blue-500 outline-none cursor-pointer"
                                                            >
                                                                {DAYS_OF_WEEK.map(
                                                                    (d) => (
                                                                        <option
                                                                            key={
                                                                                d.value
                                                                            }
                                                                            value={
                                                                                d.value
                                                                            }
                                                                        >
                                                                            {
                                                                                d.label
                                                                            }
                                                                        </option>
                                                                    ),
                                                                )}
                                                            </select>
                                                            <select
                                                                value={
                                                                    sched.shiftId
                                                                }
                                                                onChange={(e) =>
                                                                    handleScheduleFieldChange(
                                                                        classIdx,
                                                                        schedIdx,
                                                                        "shiftId",
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                }
                                                                disabled={
                                                                    isSubmitting
                                                                }
                                                                className="w-full sm:w-[170px] shrink-0 text-xs bg-gray-50 border border-gray-300 rounded p-2 text-gray-800 focus:border-blue-500 outline-none cursor-pointer"
                                                            >
                                                                {MOCK_SHIFTS.map(
                                                                    (s) => (
                                                                        <option
                                                                            key={
                                                                                s.id
                                                                            }
                                                                            value={
                                                                                s.id
                                                                            }
                                                                        >
                                                                            {
                                                                                s.name
                                                                            }
                                                                        </option>
                                                                    ),
                                                                )}
                                                            </select>
                                                            <div className="flex-1 min-w-0 flex items-center gap-1.5 bg-gray-50 border border-gray-300 rounded px-2 py-1.5">
                                                                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                                <select
                                                                    value={
                                                                        sched.roomId
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleScheduleFieldChange(
                                                                            classIdx,
                                                                            schedIdx,
                                                                            "roomId",
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            ),
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isSubmitting
                                                                    }
                                                                    className="text-xs w-full bg-transparent border-none p-0 text-gray-800 focus:ring-0 outline-none cursor-pointer truncate"
                                                                >
                                                                    {MOCK_ROOMS.map(
                                                                        (r) => (
                                                                            <option
                                                                                key={
                                                                                    r.id
                                                                                }
                                                                                value={
                                                                                    r.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    r.name
                                                                                }
                                                                            </option>
                                                                        ),
                                                                    )}
                                                                </select>
                                                            </div>
                                                            <div className="flex justify-end shrink-0">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleRemoveSchedule(
                                                                            classIdx,
                                                                            schedIdx,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isSubmitting
                                                                    }
                                                                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors focus:outline-none"
                                                                    title="Xóa buổi học này"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-gray-50/80 rounded-b-2xl flex justify-between items-center shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Đang tạo hệ thống lớp...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Duyệt & Tạo {classesData.length} Lớp Học
                                    Phần
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
