/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import { teachingService } from "../services/teaching.service";
import { type LessonBasic } from "../types";
import { LessonList } from "../components/lessons/LessonList";
import { CreateLessonModal } from "../components/lessons/CreateLessonModal";

export const LessonManagePage: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const [lessons, setLessons] = useState<LessonBasic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchLessons = async () => {
            if (!classId) return;
            setIsLoading(true);
            try {
                const data = await teachingService.getLessons(Number(classId));
                setLessons(data);
            } catch (error) {
                toast.error("Không thể tải danh sách bài học.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLessons();
    }, [classId]);

    const handleCreateLesson = async (formData: FormData) => {
        if (!classId) return;
        try {
            const newLesson = await teachingService.createLesson(Number(classId), formData);
            setLessons((prev) => [...prev, newLesson]);
            toast.success("Tạo bài học mới thành công!");
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tạo bài học.");
            throw error; 
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Bài học & Tài liệu</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Quản lý giáo trình, slide bài giảng và tài liệu tham khảo
                        </p>
                    </div>
                </div>
                
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4" />
                    Thêm bài học
                </button>
            </div>

            <LessonList 
                lessons={lessons} 
                isLoading={isLoading} 
            />

            <CreateLessonModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateLesson}
            />
        </div>
    );
};