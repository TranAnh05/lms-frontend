import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import { Plus, FileCheck } from "lucide-react";
import { toast } from "react-toastify";
import { teachingService } from "../services/teaching.service";
import { type ExamBasic, type CreateExamPayload } from "../types";
import { ExamList } from "../components/exams/ExamList";

// Toi uu: Ap dung Lazy Loading de giam dung luong phan phoi JS ban dau
const CreateExamModal = lazy(() =>
    import("../components/exams/CreateExamModal").then((m) => ({
        default: m.CreateExamModal,
    })),
);

export const ExamManagePage: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const [exams, setExams] = useState<ExamBasic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Toi uu: Tich hop AbortSignal de ngan chan loi memory leak khi component unmount
    const fetchExams = useCallback(
        async (signal?: AbortSignal) => {
            if (!classId) return;
            try {
                const data = await teachingService.getExams(Number(classId));
                if (!signal?.aborted) {
                    setExams(data);
                }
            } catch {
                if (!signal?.aborted) {
                    toast.error("Không thể tải danh sách bài kiểm tra.");
                }
            }
        },
        [classId],
    );

    useEffect(() => {
        const abortController = new AbortController();

        const initFetch = async () => {
            setIsLoading(true);
            await fetchExams(abortController.signal);
            if (!abortController.signal.aborted) {
                setIsLoading(false);
            }
        };

        initFetch();

        return () => abortController.abort();
    }, [fetchExams]);

    // Toi uu: Boc useCallback giup giu nguyen tham chieu ham khi truyen vao Modal con
    const handleCreateExam = useCallback(
        async (payload: CreateExamPayload) => {
            if (!classId) return;
            try {
                await teachingService.createExam(Number(classId), payload);
                await fetchExams();
                toast.success("Tạo bài kiểm tra thành công!");
            } catch {
                toast.error("Đã xảy ra lỗi khi tạo bài kiểm tra.");
                throw null;
            }
        },
        [classId, fetchExams],
    );

    // Toi uu: Boc useCallback on dinh hoa tham chieu ham de han che re-render ListTable
    const handleOpenExam = useCallback(
        async (examId: number) => {
            if (!classId) return;
            try {
                await teachingService.openExam(Number(classId), examId);
                setExams((prev) =>
                    prev.map((exam) =>
                        exam.id === examId ? { ...exam, status: "OPEN" } : exam,
                    ),
                );
                toast.success("Đã mở bài kiểm tra cho sinh viên làm bài!");
            } catch {
                toast.error("Không thể mở bài kiểm tra.");
            }
        },
        [classId],
    );

    // Toi uu: Boc useCallback tranh tao lai phuong thuc khi render lai page
    const handleCloseExam = useCallback(
        async (examId: number) => {
            if (!classId) return;
            try {
                await teachingService.closeExam(Number(classId), examId);
                setExams((prev) =>
                    prev.map((exam) =>
                        exam.id === examId
                            ? { ...exam, status: "CLOSED" }
                            : exam,
                    ),
                );
                toast.success("Đã đóng bài kiểm tra thành công.");
            } catch {
                toast.error("Không thể đóng bài kiểm tra.");
            }
        },
        [classId],
    );

    const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
    const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                        <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            Bài kiểm tra
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Quản lý cấu hình đề thi, số lượng câu hỏi và thời
                            gian làm bài
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleOpenModal}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4" />
                    Tạo bài kiểm tra
                </button>
            </div>

            {/* Main exams list */}
            <ExamList
                exams={exams}
                isLoading={isLoading}
                onOpenExam={handleOpenExam}
                onCloseExam={handleCloseExam}
            />

            {/* Modals container */}
            <Suspense fallback={null}>
                {isModalOpen && (
                    <CreateExamModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onSubmit={handleCreateExam}
                    />
                )}
            </Suspense>
        </div>
    );
};
