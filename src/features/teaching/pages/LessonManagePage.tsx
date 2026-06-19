import React, { useState, useEffect, useCallback, useRef } from "react";
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

    // Toi uu: Dung useRef de quan ly trang thai mounted, chong memory leak khi goi API bat dong bo
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Tai lai danh sach bai hoc tu server
    const fetchLessons = useCallback(async () => {
        if (!classId) return;
        try {
            const data = await teachingService.getLessons(Number(classId));
            if (isMounted.current) {
                setLessons(data);
            }
        } catch {
            if (isMounted.current) {
                toast.error("Không thể tải danh sách bài học.");
            }
        }
    }, [classId]);

    // Khoi tao va nap du lieu ban dau
    useEffect(() => {
        const initFetch = async () => {
            setIsLoading(true);
            await fetchLessons();
            if (isMounted.current) {
                setIsLoading(false);
            }
        };

        initFetch();
    }, [fetchLessons]);

    // Toi uu: Su dung useCallback de giu co dinh tham chieu ham, tranh re-render Modal con
    const handleCreateLesson = useCallback(
        async (formData: FormData) => {
            if (!classId) return;
            try {
                await teachingService.createLesson(Number(classId), formData);
                await fetchLessons();
                if (isMounted.current) {
                    toast.success("Tạo bài học mới thành công!");
                }
            } catch (error) {
                if (isMounted.current) {
                    toast.error("Đã xảy ra lỗi khi tạo bài học.");
                }
                throw error;
            }
        },
        [classId, fetchLessons],
    );

    // Toi uu: Giu co dinh tham chieu ham dong/mo modal
    const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
    const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Thanh tieu de lam viec va nut chuc nang */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            Bài học & Tài liệu
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Quản lý giáo trình, slide bài giảng và tài liệu tham
                            khảo
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleOpenModal}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4" />
                    Thêm bài học
                </button>
            </div>

            {/* Danh sach bai hoc */}
            <LessonList lessons={lessons} isLoading={isLoading} />

            {/* Modal tao moi bai hoc */}
            <CreateLessonModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleCreateLesson}
            />
        </div>
    );
};
