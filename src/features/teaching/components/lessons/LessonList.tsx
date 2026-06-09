import React, { useMemo } from "react";
import { Loader2, Inbox } from "lucide-react";
import { type LessonBasic } from "../../types";
import { LessonItem } from "./LessonItem";

interface LessonListProps {
    lessons: LessonBasic[];
    isLoading: boolean;
}

export const LessonList: React.FC<LessonListProps> = ({ lessons, isLoading }) => {
    // Sắp xếp bài học theo thứ tự tăng dần của orderIndex
    const sortedLessons = useMemo(() => {
        if (!lessons) return [];
        return [...lessons].sort((a, b) => a.orderIndex - b.orderIndex);
    }, [lessons]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                <p className="text-sm font-medium text-gray-500">Đang tải danh sách bài học...</p>
            </div>
        );
    }

    if (sortedLessons.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm border-dashed">
                <div className="p-4 bg-gray-50 rounded-full mb-3 text-gray-400">
                    <Inbox className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Chưa có bài học nào</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Bấm vào nút "Thêm bài học" phía trên để tạo nội dung mới.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sortedLessons.map((lesson) => (
                <LessonItem key={lesson.id} lesson={lesson} />
            ))}
        </div>
    );
};