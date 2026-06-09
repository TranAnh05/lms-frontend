/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { Loader2, Inbox } from "lucide-react";
import { toast } from "react-toastify";
import { studentService } from "../../services/student.service";
import { type StudentLessonBasic } from "../../types";
import { StudentLessonItem } from "./StudentLessonItem";

interface StudentLessonListProps {
    classId: number;
}

export const StudentLessonList: React.FC<StudentLessonListProps> = ({ classId }) => {
    const [lessons, setLessons] = useState<StudentLessonBasic[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            if (!classId) return;
            
            setIsLoading(true);
            try {
                const data = await studentService.getLessons(classId);
                
                const publishedLessons = data
                    .filter((lesson) => lesson.isPublished)
                    .sort((a, b) => a.orderIndex - b.orderIndex);
                
                setLessons(publishedLessons);
            } catch (error) {
                toast.error("Không thể tải danh sách bài học.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLessons();
    }, [classId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm mt-6">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                <p className="text-sm font-medium text-gray-500">Đang tải danh sách bài học...</p>
            </div>
        );
    }

    if (lessons.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm border-dashed mt-6">
                <div className="p-4 bg-gray-50 rounded-full mb-4 text-gray-400">
                    <Inbox className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Chưa có bài học</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm text-center">
                    Giảng viên chưa đăng tải hoặc chưa xuất bản nội dung bài học nào cho lớp này.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {lessons.map((lesson) => (
                <StudentLessonItem key={lesson.id} lesson={lesson} />
            ))}
        </div>
    );
};