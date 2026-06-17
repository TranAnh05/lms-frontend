import React, { useMemo, useCallback, memo } from "react";
import {
    Calendar,
    Clock,
    Building2,
    Users,
    Type,
    Tag,
    ChevronRight,
    AlertCircle,
} from "lucide-react";
import clsx from "clsx";
import {
    type SemesterResponse,
    type DepartmentResponse,
} from "../../types/registration.types";

export interface Step1FormState {
    name: string;
    semesterId: number | "";
    type: string;
    startTime: string;
    endTime: string;
    targetCohorts: number[];
    targetDepartments: number[];
}

interface WizardStep1ConfigProps {
    formData: Step1FormState;
    onChange: (data: Partial<Step1FormState>) => void;
    onNext: () => void;
    semesters: SemesterResponse[];
    departments: DepartmentResponse[];
}

// Toi uu 1: Dua cac hang so, chuoi class va SVG ra ngoai component de tranh cap phat lai bo nho
const AVAILABLE_COHORTS = [2023, 2024, 2025, 2026]; // Mo rong danh sach cac khoa dang hoat dong

const INPUT_CLASSES =
    "w-full bg-gray-50/50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block px-4 py-2.5 outline-none transition-all placeholder:text-gray-400";
const LABEL_CLASSES =
    "block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1 flex items-center gap-1.5";
const SELECT_BG_IMAGE = `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;

// Toi uu 2: Su dung memo de ngan Component re-render khi form data khong lien quan thay doi
export const WizardStep1Config: React.FC<WizardStep1ConfigProps> = memo(
    ({ formData, onChange, onNext, semesters, departments }) => {
        // Toi uu 3: Gom nhom viec xu ly thoi gian de tranh parse Date nhieu lan
        const timeValidation = useMemo(() => {
            if (!formData.startTime || !formData.endTime) {
                return { isValid: false, isInvalidTime: false };
            }

            const start = new Date(formData.startTime).getTime();
            const end = new Date(formData.endTime).getTime();

            return {
                isValid: start < end,
                isInvalidTime: start >= end,
            };
        }, [formData.startTime, formData.endTime]);

        const isFormValid = useMemo(() => {
            const hasBasicInfo =
                !!formData.name.trim() &&
                !!formData.semesterId &&
                !!formData.type;
            const hasTargets =
                formData.targetCohorts.length > 0 &&
                formData.targetDepartments.length > 0;

            return hasBasicInfo && hasTargets && timeValidation.isValid;
        }, [formData, timeValidation.isValid]);

        // Toi uu 4: Boc useCallback cho cac ham xu ly su kien phuc tap
        const handleToggleDepartment = useCallback(
            (deptId: number) => {
                const current = formData.targetDepartments;
                const updated = current.includes(deptId)
                    ? current.filter((id) => id !== deptId)
                    : [...current, deptId];
                onChange({ targetDepartments: updated });
            },
            [formData.targetDepartments, onChange],
        );

        const handleToggleCohort = useCallback(
            (cohort: number) => {
                const current = formData.targetCohorts;
                const updated = current.includes(cohort)
                    ? current.filter((c) => c !== cohort)
                    : [...current, cohort];
                onChange({ targetCohorts: updated });
            },
            [formData.targetCohorts, onChange],
        );

        const handleSelectAllDepartments = useCallback(() => {
            onChange({ targetDepartments: departments.map((d) => d.id) });
        }, [departments, onChange]);

        return (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        Cấu hình Đợt đăng ký
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Thiết lập thông tin chung, thời gian và đối tượng sinh
                        viên được phép tham gia đăng ký học phần.
                    </p>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2 pb-6">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <div>
                            <label className={LABEL_CLASSES}>
                                <Type className="w-4 h-4 text-gray-400" /> Tên
                                đợt đăng ký{" "}
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="VD: Đợt đăng ký chính thức HK1 (Khóa 16)"
                                value={formData.name}
                                onChange={(e) =>
                                    onChange({ name: e.target.value })
                                }
                                className={INPUT_CLASSES}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={LABEL_CLASSES}>
                                    <Calendar className="w-4 h-4 text-gray-400" />{" "}
                                    Học kỳ áp dụng{" "}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={formData.semesterId}
                                    onChange={(e) =>
                                        onChange({
                                            semesterId: Number(e.target.value),
                                        })
                                    }
                                    className={clsx(
                                        INPUT_CLASSES,
                                        "appearance-none cursor-pointer",
                                    )}
                                    style={{
                                        backgroundImage: SELECT_BG_IMAGE,
                                        backgroundPosition: "right 1rem center",
                                        backgroundSize: "1rem",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                >
                                    <option value="" disabled>
                                        Chọn học kỳ
                                    </option>
                                    {semesters.map((sem) => (
                                        <option key={sem.id} value={sem.id}>
                                            {sem.semesterCode} (
                                            {sem.academicYear})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={LABEL_CLASSES}>
                                    <Tag className="w-4 h-4 text-gray-400" />{" "}
                                    Loại đợt{" "}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) =>
                                        onChange({ type: e.target.value })
                                    }
                                    className={clsx(
                                        INPUT_CLASSES,
                                        "appearance-none cursor-pointer",
                                    )}
                                    style={{
                                        backgroundImage: SELECT_BG_IMAGE,
                                        backgroundPosition: "right 1rem center",
                                        backgroundSize: "1rem",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                >
                                    <option value="NORMAL">Chính thức</option>
                                    <option value="EXTENDED">Bổ sung</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={LABEL_CLASSES}>
                                    <Clock className="w-4 h-4 text-gray-400" />{" "}
                                    Thời gian mở{" "}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.startTime}
                                    onChange={(e) =>
                                        onChange({ startTime: e.target.value })
                                    }
                                    className={INPUT_CLASSES}
                                />
                            </div>
                            <div>
                                <label className={LABEL_CLASSES}>
                                    <Clock className="w-4 h-4 text-gray-400" />{" "}
                                    Thời gian đóng{" "}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.endTime}
                                    onChange={(e) =>
                                        onChange({ endTime: e.target.value })
                                    }
                                    className={INPUT_CLASSES}
                                />
                            </div>
                        </div>
                        {timeValidation.isInvalidTime && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-rose-600 bg-rose-50 px-4 py-3 rounded-lg border border-rose-100 animate-in fade-in">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>
                                    Thời gian đóng phải diễn ra sau thời gian mở
                                    đợt.
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-5">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                                    <Building2 className="w-4 h-4 text-gray-400" />{" "}
                                    Khoa được phép đăng ký{" "}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={handleSelectAllDepartments}
                                    className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                                >
                                    Chọn tất cả
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {departments.map((dept) => {
                                    const isSelected =
                                        formData.targetDepartments.includes(
                                            dept.id,
                                        );
                                    return (
                                        <button
                                            key={dept.id}
                                            type="button"
                                            onClick={() =>
                                                handleToggleDepartment(dept.id)
                                            }
                                            className={clsx(
                                                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border outline-none",
                                                isSelected
                                                    ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                                                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300",
                                            )}
                                        >
                                            {dept.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 w-full"></div>

                        <div>
                            <label className={LABEL_CLASSES}>
                                <Users className="w-4 h-4 text-gray-400" /> Khóa
                                được phép đăng ký{" "}
                                <span className="text-rose-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {AVAILABLE_COHORTS.map((cohort) => {
                                    const isSelected =
                                        formData.targetCohorts.includes(cohort);
                                    return (
                                        <button
                                            key={cohort}
                                            type="button"
                                            onClick={() =>
                                                handleToggleCohort(cohort)
                                            }
                                            className={clsx(
                                                "px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 border outline-none",
                                                isSelected
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-md"
                                                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300",
                                            )}
                                        >
                                            Khóa {cohort}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end shrink-0">
                    <button
                        onClick={onNext}
                        disabled={!isFormValid}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-500/20 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-sm"
                    >
                        Tiếp tục cấu hình lớp
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    },
);

WizardStep1Config.displayName = "WizardStep1Config";
