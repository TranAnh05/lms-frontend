import React from "react";
import { Loader2, FileX } from "lucide-react";
import { type ExamBasic } from "../../types";
import { ExamItem } from "./ExamItem";

interface ExamListProps {
    exams: ExamBasic[];
    isLoading: boolean;
    onOpenExam?: (examId: number) => void;
    onCloseExam?: (examId: number) => void;
}

export const ExamList: React.FC<ExamListProps> = ({ 
    exams, 
    isLoading, 
    onOpenExam, 
    onCloseExam 
}) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                <p className="text-sm font-medium text-gray-500">Đang tải danh sách bài kiểm tra...</p>
            </div>
        );
    }

    if (!exams || exams.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm border-dashed">
                <div className="p-4 bg-gray-50 rounded-full mb-3 text-gray-400">
                    <FileX className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Chưa có bài kiểm tra</h3>
                <p className="text-sm text-gray-500 mt-1 text-center max-w-sm">
                    Lớp học này chưa có bài kiểm tra trắc nghiệm nào. Bấm "Tạo bài kiểm tra" để bắt đầu.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {exams.map((exam) => (
                <ExamItem 
                    key={exam.id} 
                    exam={exam} 
                    onOpen={onOpenExam}
                    onClose={onCloseExam}
                />
            ))}
        </div>
    );
};