import React, { useState, useEffect, useRef } from "react";
import {
    BookText,
    Download,
    FileText,
    FileArchive,
    File as FileIcon,
    FileCode2,
    Loader2,
} from "lucide-react";
import clsx from "clsx";
import { toast } from "react-toastify";
import { studentService } from "../../services/student.service";
import {
    type StudentLessonBasic,
    type StudentLessonMaterial,
} from "../../types";

interface StudentLessonItemProps {
    readonly lesson: StudentLessonBasic;
}

// Chuyen ham helper ra ngoai hoac dung kieu du lieu co dinh de tranh khoi tao lai khi component re-render
const formatFileSize = (bytes?: number): string => {
    if (!bytes || bytes <= 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getFileConfig = (fileType?: string) => {
    const type = fileType?.toLowerCase() || "";

    if (type.includes("pdf")) {
        return { icon: FileText, color: "text-rose-500", bg: "bg-rose-50" };
    }
    if (type.includes("zip") || type.includes("rar")) {
        return {
            icon: FileArchive,
            color: "text-amber-500",
            bg: "bg-amber-50",
        };
    }
    if (type.includes("doc") || type.includes("docx")) {
        return { icon: BookText, color: "text-blue-500", bg: "bg-blue-50" };
    }
    if (
        type.includes("js") ||
        type.includes("ts") ||
        type.includes("html") ||
        type.includes("css")
    ) {
        return {
            icon: FileCode2,
            color: "text-indigo-500",
            bg: "bg-indigo-50",
        };
    }

    return { icon: FileIcon, color: "text-gray-500", bg: "bg-gray-100" };
};

export const StudentLessonItem: React.FC<StudentLessonItemProps> = ({
    lesson,
}) => {
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    // Su dung Ref de quan ly trang thai hoat dong nham chan dung loi Memory Leak khi tai file
    const isMounted = useRef<boolean>(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleDownload = async (material: StudentLessonMaterial) => {
        if (!material.id) return;

        let downloadUrl = "";
        let link: HTMLAnchorElement | null = null;

        try {
            setDownloadingId(material.id);

            // Goi api lay Blob dung chuan cau truc boc tach .data moi o file service
            const blob = await studentService.downloadMaterial(material.id);

            if (!isMounted.current) return;

            downloadUrl = window.URL.createObjectURL(blob);

            link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", material.fileName);
            document.body.appendChild(link);
            link.click();
        } catch {
            if (isMounted.current) {
                toast.error(`Không thể tải xuống file: ${material.fileName}`);
            }
        } finally {
            // Bao ve thu hoi bo nho luon luon duoc thuc thi ke ca khi tien trinh xay ra loi chat ngam
            if (link && document.body.contains(link)) {
                link.remove();
            }
            if (downloadUrl) {
                window.URL.revokeObjectURL(downloadUrl);
            }
            if (isMounted.current) {
                setDownloadingId(null);
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6 flex flex-col gap-4">
            {/* Tieu de bai hoc va chi muc so thu tu */}
            <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold text-lg select-none">
                    {lesson.orderIndex}
                </div>

                <div className="flex-1 min-w-0">
                    <h3
                        className="text-lg font-bold text-gray-900 leading-snug truncate"
                        title={lesson.title}
                    >
                        {lesson.title}
                    </h3>
                </div>
            </div>

            {/* Mo ta ngan gon noi dung bai hoc */}
            {lesson.description && (
                <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {lesson.description}
                </div>
            )}

            {/* Danh sach cac tai lieu dinh kem bai hoc */}
            {lesson.materials && lesson.materials.length > 0 && (
                <div className="mt-2 space-y-2.5">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 select-none">
                        Tài liệu đính kèm ({lesson.materials.length})
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {lesson.materials.map((material) => {
                            const {
                                icon: FileIconCmp,
                                color,
                                bg,
                            } = getFileConfig(material.fileType);
                            const isDownloading = downloadingId === material.id;

                            return (
                                <button
                                    key={material.id}
                                    type="button"
                                    onClick={() => handleDownload(material)}
                                    disabled={isDownloading}
                                    className="group w-full text-left flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-70 disabled:cursor-wait select-none"
                                >
                                    <div
                                        className={clsx(
                                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                            bg,
                                        )}
                                    >
                                        <FileIconCmp
                                            className={clsx("w-5 h-5", color)}
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p
                                            className="text-sm font-semibold text-gray-700 truncate group-hover:text-blue-700 transition-colors"
                                            title={material.fileName}
                                        >
                                            {material.fileName}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {formatFileSize(material.fileSize)}
                                        </p>
                                    </div>

                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-100 transition-colors shrink-0">
                                        {isDownloading ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                        ) : (
                                            <Download className="w-4 h-4" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
