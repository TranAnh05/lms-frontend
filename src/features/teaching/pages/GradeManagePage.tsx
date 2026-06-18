import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { GraduationCap, Lock, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { teachingService } from "../services/teaching.service";
import { type StudentGrade, type LecturerClassResponse } from "../types";
import {
    GradebookTable,
    type GradeFormula,
} from "../components/grades/GradebookTable";

// Toi uu: Ap dung Code Splitting de giam dung luong JS ban dau khi tai trang
const FinalizeGradeModal = lazy(() =>
    import("../components/grades/FinalizeGradeModal").then((m) => ({
        default: m.FinalizeGradeModal,
    })),
);

// Toi uu: Dua hang so cau hinh ra ngoai Component de co dinh tham chieu bo nho, tranh Re-render Table
const GRADE_FORMULA: GradeFormula = {
    regularWeight: 0.2,
    midtermWeight: 0.3,
    finalWeight: 0.5,
};

export const GradeManagePage: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const { classData } = useOutletContext<{
        classData: LecturerClassResponse;
    }>();

    const [grades, setGrades] = useState<StudentGrade[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFinalized, setIsFinalized] = useState(
        classData?.status === "COMPLETED",
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!classId) return;

        // Toi uu: Su dung AbortController de chan tinh trang Race Condition va Memory Leak
        const abortController = new AbortController();

        const fetchGrades = async () => {
            setIsLoading(true);
            try {
                const data = await teachingService.getClassGrades(
                    Number(classId),
                );
                if (!abortController.signal.aborted) {
                    setGrades(data.students || []);
                }
            } catch {
                if (!abortController.signal.aborted) {
                    toast.error("Không thể tải bảng điểm lớp học.");
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchGrades();

        return () => abortController.abort();
    }, [classId]);

    // Toi uu: Boc useCallback giup giu vung tham chieu ham khi truyen xuong o nhap lieu o Table con
    const handleGradeChange = useCallback(
        (
            studentId: number,
            field:
                | "regularScore1"
                | "regularScore2"
                | "midtermScore"
                | "finalScore",
            value: number | null,
        ) => {
            setGrades((prev) =>
                prev.map((grade) =>
                    grade.studentId === studentId
                        ? { ...grade, [field]: value }
                        : grade,
                ),
            );
        },
        [],
    );

    // Toi uu: Boc useCallback on dinh hoa phuong thuc submit
    const handleFinalize = useCallback(async () => {
        if (!classId) return;
        try {
            await teachingService.finalizeGrades(Number(classId));
            setIsFinalized(true);
            toast.success("Đã chốt điểm học phần thành công!");
        } catch {
            toast.error("Đã xảy ra lỗi khi chốt điểm.");
        }
    }, [classId]);

    const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
    const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            Quản lý Bảng điểm
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Cập nhật điểm thành phần và chốt điểm khi kết thúc
                            học phần
                        </p>
                    </div>
                </div>

                {isFinalized ? (
                    <div className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg w-full sm:w-auto">
                        <CheckCircle className="w-4 h-4" />
                        Đã chốt học phần
                    </div>
                ) : (
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={handleOpenModal}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/20 w-full sm:w-auto shadow-sm"
                        >
                            <Lock className="w-4 h-4" />
                            Chốt điểm
                        </button>
                    </div>
                )}
            </div>

            {/* Main Gradebook Table */}
            <GradebookTable
                grades={grades}
                formula={GRADE_FORMULA}
                isLoading={isLoading}
                isFinalized={isFinalized}
                onGradeChange={handleGradeChange}
            />

            {/* Lazy Load Modals Container */}
            <Suspense fallback={null}>
                {isModalOpen && (
                    <FinalizeGradeModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onConfirm={handleFinalize}
                    />
                )}
            </Suspense>
        </div>
    );
};
