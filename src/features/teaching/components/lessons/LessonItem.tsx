import React from "react";
import { FileText, Download, MoreVertical, EyeOff, Paperclip } from "lucide-react";
import clsx from "clsx";
import { type LessonBasic } from "../../types";

interface LessonItemProps {
    lesson: LessonBasic;
}

const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export const LessonItem: React.FC<LessonItemProps> = ({ lesson }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                            <span className="text-lg font-bold text-blue-700">
                                {lesson.orderIndex.toString().padStart(2, "0")}
                            </span>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold text-gray-900 leading-snug">
                                    {lesson.title}
                                </h3>
                                {!lesson.isPublished && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-semibold">
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

                    <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>

                {lesson.materials && lesson.materials.length > 0 && (
                    <div className="mt-5 pl-16">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Paperclip className="w-3.5 h-3.5" />
                            Tài liệu đính kèm ({lesson.materials.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {lesson.materials.map((file) => (
                                <div 
                                    key={file.id} 
                                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200 transition-colors group"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={clsx(
                                            "p-2 rounded-lg",
                                            file.fileType?.includes("pdf") ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
                                        )}>
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-sm font-semibold text-gray-900 truncate" title={file.fileName}>
                                                {file.fileName}
                                            </p>
                                            <p className="text-xs text-gray-500 font-medium mt-0.5">
                                                {formatFileSize(file.fileSize)}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-all focus:outline-none"
                                        title="Tải xuống"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};