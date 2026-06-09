import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Plus, FileCheck } from "lucide-react";
import { toast } from "react-toastify";
import { teachingService } from "../services/teaching.service";
import { type ExamBasic, type CreateExamPayload } from "../types";
import { ExamList } from "../components/exams/ExamList";
import { CreateExamModal } from "../components/exams/CreateExamModal";

export const ExamManagePage: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const [exams, setExams] = useState<ExamBasic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Tách hàm fetch để tái sử dụng sau khi tạo mới
    const fetchExams = useCallback(async () => {
        if (!classId) return;
        try {
            const data = await teachingService.getExams(Number(classId));
            setExams(data);
        } catch (error) {
            toast.error("Không thể tải danh sách bài kiểm tra.");
        }
    }, [classId]);

    useEffect(() => {
        const initFetch = async () => {
            setIsLoading(true);
            await fetchExams();
            setIsLoading(false);
        };

        initFetch();
    }, [fetchExams]);

    const handleCreateExam = async (payload: CreateExamPayload) => {
        if (!classId) return;
        try {
            await teachingService.createExam(Number(classId), payload);
            await fetchExams(); // Tải lại danh sách từ server thay vì append chuỗi
            toast.success("Tạo bài kiểm tra thành công!");
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tạo bài kiểm tra.");
            throw error; 
        }
    };

    const handleOpenExam = async (examId: number) => {
    if (!classId) return;
    try {
        await teachingService.openExam(Number(classId), examId);
        setExams((prev) =>
            prev.map((exam) => (exam.id === examId ? { ...exam, status: "OPEN" } : exam))
        );
        toast.success("Đã mở bài kiểm tra cho sinh viên làm bài!");
    } catch (error) {
        toast.error("Không thể mở bài kiểm tra.");
    }
};

const handleCloseExam = async (examId: number) => {
    if (!classId) return;
    try {
        await teachingService.closeExam(Number(classId), examId);
        setExams((prev) =>
            prev.map((exam) => (exam.id === examId ? { ...exam, status: "CLOSED" } : exam))
        );
        toast.success("Đã đóng bài kiểm tra thành công.");
    } catch (error) {
        toast.error("Không thể đóng bài kiểm tra.");
    }
};

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                        <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Bài kiểm tra</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Quản lý cấu hình đề thi, số lượng câu hỏi và thời gian làm bài
                        </p>
                    </div>
                </div>
                
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4" />
                    Tạo bài kiểm tra
                </button>
            </div>

            <ExamList 
                exams={exams} 
                isLoading={isLoading} 
                onOpenExam={handleOpenExam}
                onCloseExam={handleCloseExam}
            />

            <CreateExamModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateExam}
            />
        </div>
    );
};