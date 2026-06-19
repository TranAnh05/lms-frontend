import React from "react";
import {
    FileText,
    Download,
    MoreVertical,
    EyeOff,
    Paperclip,
} from "lucide-react";
import clsx from "clsx";
import { type LessonBasic } from "../../types";

interface LessonItemProps {
    lesson: LessonBasic;
}

// Chuyen doi dung luong file tu dang bytes sang dang chuoi de doc
const formatFileSize = (bytes?: number): string => {
    if (!bytes || bytes <= 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

// Toi uu: Su dung React.memo de co lap phan tu danh sach,tranh re-render thua khi danh sach cha cap nhat
export const LessonItem = React.memo<LessonItemProps>(({ lesson }) => {
    // Dinh dang index hien thi luon co 2 chu so
    const displayOrder = lesson.orderIndex.toString().padStart(2, "0");

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        {/* Hien thi so thu tu bai hoc */}
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                            <span className="text-lg font-bold text-blue-700">
                                {displayOrder}
                            </span>
                        </div>

                        {/* Thong tin tieu de va trang thai xuat ban */}
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold text-gray-900 leading-snug">
                                    {lesson.title}
                                </h3>
                                {!lesson.isPublished && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-semibold shrink-0">
                                        <EyeOff className="w-3 h-3" />
                                        Bản nháp
                                    </span>
                                )}
                            </div>

                            {lesson.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {lesson.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Nut thao tac mo rong */}
                    <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>

                {/* Danh sach cac tai lieu dinh kem neu co */}
                {lesson.materials && lesson.materials.length > 0 && (
                    <div className="mt-5 pl-16">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Paperclip className="w-3.5 h-3.5" />
                            Tài liệu đính kèm ({lesson.materials.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {lesson.materials.map((file) => {
                                const isPdf = file.fileType?.includes("pdf");

                                return (
                                    <div
                                        key={file.id}
                                        className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            {/* Mau sac bieu tuong phan biet theo dinh dang file */}
                                            <div
                                                className={clsx(
                                                    "p-2 rounded-lg shrink-0",
                                                    isPdf
                                                        ? "bg-rose-50 text-rose-600"
                                                        : "bg-blue-50 text-blue-600",
                                                )}
                                            >
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="truncate">
                                                <p
                                                    className="text-sm font-semibold text-gray-900 truncate"
                                                    title={file.fileName}
                                                >
                                                    {file.fileName}
                                                </p>
                                                <p className="text-xs text-gray-500 font-medium mt-0.5">
                                                    {formatFileSize(
                                                        file.fileSize,
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Duong dan tai xuong tap tin */}
                                        <a
                                            href={file.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-all focus:outline-none focus:opacity-100"
                                            title="Tải xuống"
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

// Dinh danh ten component ho tro devtools tracking
LessonItem.displayName = "LessonItem";
