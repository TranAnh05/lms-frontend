/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, Settings, ListChecks, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { toast } from "react-toastify";

import {
    type SemesterResponse,
    type DepartmentResponse,
    type ClassPendingResponse,
} from "../../types/registration.types";
import { registrationService } from "../../services/registration.service";

import { WizardStep1Config, type Step1FormState } from "./WizardStep1Config";
import { WizardStep2Classes } from "./WizardStep2Classes";

interface RegistrationWizardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    semesters: SemesterResponse[];
    departments: DepartmentResponse[];
}

const INITIAL_STEP1_STATE: Step1FormState = {
    name: "",
    semesterId: "",
    type: "NORMAL",
    startTime: "",
    endTime: "",
    targetCohorts: [],
    targetDepartments: [],
};

export const RegistrationWizardModal: React.FC<
    RegistrationWizardModalProps
> = ({ isOpen, onClose, onSuccess, semesters, departments }) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [step1Data, setStep1Data] =
        useState<Step1FormState>(INITIAL_STEP1_STATE);
    const [pendingClasses, setPendingClasses] = useState<
        ClassPendingResponse[]
    >([]);

    const [isFetchingClasses, setIsFetchingClasses] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Toi uu: Su dung useRef de luu tru AbortController xuyen suot cac ky render
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setStep1Data(INITIAL_STEP1_STATE);
            setPendingClasses([]);
        } else {
            // Huy cac request dang cho xu ly khi Modal bi dong
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        }
    }, [isOpen]);

    const handleClose = useCallback(() => {
        if (!isSubmitting) onClose();
    }, [isSubmitting, onClose]);

    // Toi uu: Boc useCallback + Functional State Update de giu tham chieu on dinh
    const handleStep1Change = useCallback(
        (newData: Partial<Step1FormState>) => {
            setStep1Data((prev) => ({ ...prev, ...newData }));
        },
        [],
    );

    const handleNextToStep2 = useCallback(async () => {
        if (!step1Data.semesterId) return;

        setStep(2);
        setIsFetchingClasses(true);

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            const data = await registrationService.getPendingClasses(
                Number(step1Data.semesterId),
                step1Data.targetDepartments,
            );

            if (!abortController.signal.aborted) {
                setPendingClasses(data);
            }
        } catch {
            if (!abortController.signal.aborted) {
                toast.error(
                    "Không thể tải danh sách lớp học phần. Vui lòng thử lại.",
                );
                setStep(1);
            }
        } finally {
            if (!abortController.signal.aborted) {
                setIsFetchingClasses(false);
            }
        }
    }, [step1Data.semesterId, step1Data.targetDepartments]);

    const handleSubmit = useCallback(async () => {
        if (pendingClasses.length === 0) {
            toast.warning(
                "Không có lớp học phần nào hợp lệ để tạo đợt đăng ký.",
            );
            return;
        }

        setIsSubmitting(true);
        try {
            await registrationService.createRegistrationPeriod({
                semesterId: Number(step1Data.semesterId),
                name: step1Data.name,
                type: step1Data.type,
                startTime: step1Data.startTime,
                endTime: step1Data.endTime,
                targetCohorts: step1Data.targetCohorts,
                targetDepartments: step1Data.targetDepartments,
            });

            toast.success("Đã tạo đợt đăng ký thành công!");
            onSuccess();
            handleClose();
        } catch {
            toast.error("Đã xảy ra lỗi trong quá trình tạo đợt đăng ký.");
        } finally {
            setIsSubmitting(false);
        }
    }, [pendingClasses.length, step1Data, onSuccess, handleClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Toi uu: Lop Overlay de chan click ra ngoai */}
            <div className="absolute inset-0" onClick={handleClose}></div>

            <div className="relative z-10 w-full max-w-5xl bg-gray-50/50 rounded-2xl shadow-2xl flex flex-col h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden">
                <div className="bg-white border-b border-gray-100 shrink-0 rounded-t-2xl z-10 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-50">
                        <h3 className="text-xl font-bold text-gray-900">
                            Mở Đợt đăng ký học phần mới
                        </h3>
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress Wizard */}
                    <div className="px-8 py-4 flex items-center justify-center">
                        <div className="flex items-center w-full max-w-2xl">
                            <div
                                className={clsx(
                                    "flex items-center gap-3 transition-colors duration-300",
                                    step === 1
                                        ? "text-blue-600"
                                        : "text-gray-500",
                                )}
                            >
                                <div
                                    className={clsx(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors",
                                        step === 1
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-gray-300 bg-white",
                                    )}
                                >
                                    <Settings className="w-5 h-5" />
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                        Bước 1
                                    </p>
                                    <p className="text-sm font-semibold">
                                        Cấu hình đợt
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 mx-4 sm:mx-6 flex items-center">
                                <div
                                    className={clsx(
                                        "h-0.5 w-full transition-colors duration-500",
                                        step === 2
                                            ? "bg-blue-600"
                                            : "bg-gray-200",
                                    )}
                                ></div>
                                <ChevronRight
                                    className={clsx(
                                        "w-5 h-5 -ml-3 transition-colors duration-500",
                                        step === 2
                                            ? "text-blue-600"
                                            : "text-gray-300",
                                    )}
                                />
                            </div>

                            <div
                                className={clsx(
                                    "flex items-center gap-3 transition-colors duration-300",
                                    step === 2
                                        ? "text-blue-600"
                                        : "text-gray-400",
                                )}
                            >
                                <div
                                    className={clsx(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors",
                                        step === 2
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-gray-300 bg-white",
                                    )}
                                >
                                    <ListChecks className="w-5 h-5" />
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                        Bước 2
                                    </p>
                                    <p className="text-sm font-semibold">
                                        Xem trước lớp học phần
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden p-6 bg-gray-50/50">
                    {step === 1 ? (
                        <WizardStep1Config
                            formData={step1Data}
                            onChange={handleStep1Change}
                            onNext={handleNextToStep2}
                            semesters={semesters}
                            departments={departments}
                        />
                    ) : (
                        <WizardStep2Classes
                            pendingClasses={pendingClasses}
                            onBack={() => setStep(1)}
                            onSubmit={handleSubmit}
                            isLoading={isFetchingClasses}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
