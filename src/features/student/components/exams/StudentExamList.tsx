/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { Loader2, FileX } from "lucide-react";
import { toast } from "react-toastify";
import { studentService } from "../../services/student.service";
import { type StudentExamBasic } from "../../types";
import { StudentExamItem } from "./StudentExamItem";

interface StudentExamListProps {
    classId: number;
}

export const StudentExamList: React.FC<StudentExamListProps> = ({ classId }) => {
    const [exams, setExams] = useState<StudentExamBasic[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            if (!classId) return;

            setIsLoading(true);
            try {
                const data = await studentService.getExams(classId);
                setExams(data || []);
            } catch (error) {
                toast.error("Không thể tải danh sách bài kiểm tra.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchExams();
    }, [classId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm mt-6">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                <p className="text-sm font-medium text-gray-500">Đang tải danh sách bài kiểm tra...</p>
            </div>
        );
    }

    if (exams.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm border-dashed mt-6">
                <div className="p-4 bg-gray-50 rounded-full mb-4 text-gray-400">
                    <FileX className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Chưa có bài kiểm tra</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm text-center">
                    Giảng viên chưa công bố bài kiểm tra nào cho lớp học này.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {exams.map((exam) => (
                <StudentExamItem key={exam.id} exam={exam} />
            ))}
        </div>
    );
};