import React from "react";
import { BookText, Download, FileText, FileArchive, File, FileCode2 } from "lucide-react";
import clsx from "clsx";
import { type StudentLessonBasic, type StudentLessonMaterial } from "../../types";

interface StudentLessonItemProps {
    lesson: StudentLessonBasic;
}

// Format dung lượng file (Bytes -> KB/MB)
const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

// Map icon và màu sắc theo định dạng file
const getFileConfig = (fileType?: string) => {
    const type = fileType?.toLowerCase() || "";
    if (type.includes("pdf")) {
        return { icon: FileText, color: "text-rose-500", bg: "bg-rose-50" };
    }
    if (type.includes("zip") || type.includes("rar")) {
        return { icon: FileArchive, color: "text-amber-500", bg: "bg-amber-50" };
    }
    if (type.includes("doc") || type.includes("docx")) {
        return { icon: BookText, color: "text-blue-500", bg: "bg-blue-50" };
    }
    if (type.includes("js") || type.includes("ts") || type.includes("html") || type.includes("css")) {
        return { icon: FileCode2, color: "text-indigo-500", bg: "bg-indigo-50" };
    }
    return { icon: File, color: "text-gray-500", bg: "bg-gray-100" };
};

export const StudentLessonItem: React.FC<StudentLessonItemProps> = ({ lesson }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold text-lg">
                    {lesson.orderIndex}
                </div>
                
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 leading-snug">
                        {lesson.title}
                    </h3>
                </div>
            </div>

            {lesson.description && (
                <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {lesson.description}
                </div>
            )}

            {lesson.materials && lesson.materials.length > 0 && (
                <div className="mt-2 space-y-2.5">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Tài liệu đính kèm ({lesson.materials.length})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {lesson.materials.map((material: StudentLessonMaterial) => {
                            const { icon: FileIcon, color, bg } = getFileConfig(material.fileType);

                            return (
                                <a
                                    key={material.id}
                                    href={material.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", bg)}>
                                        <FileIcon className={clsx("w-5 h-5", color)} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-700 truncate group-hover:text-blue-700 transition-colors">
                                            {material.fileName}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {formatFileSize(material.fileSize)}
                                        </p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-100 transition-colors shrink-0">
                                        <Download className="w-4 h-4" />
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};