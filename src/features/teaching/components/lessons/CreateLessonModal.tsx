import React, { useState, useRef, useCallback, memo } from "react";
import { X, UploadCloud, FileText, Trash2, Loader2 } from "lucide-react";
import clsx from "clsx";

interface CreateLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void>;
}

export const CreateLessonModal: React.FC<CreateLessonModalProps> = memo(
    ({ isOpen, onClose, onSubmit }) => {
        const [title, setTitle] = useState("");
        const [orderIndex, setOrderIndex] = useState<number>(1);
        const [description, setDescription] = useState("");
        const [isPublished, setIsPublished] = useState(true);
        const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
        const [isSubmitting, setIsSubmitting] = useState(false);

        const fileInputRef = useRef<HTMLInputElement>(null);

        const handleFileChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) {
                    const filesArray = Array.from(e.target.files);
                    setSelectedFiles((prev) => [...prev, ...filesArray]);
                }
            },
            [],
        );

        const handleRemoveFile = useCallback((indexToRemove: number) => {
            setSelectedFiles((prev) =>
                prev.filter((_, index) => index !== indexToRemove),
            );
        }, []);

        const handleSubmit = useCallback(
            async (e: React.FormEvent) => {
                e.preventDefault();
                if (!title.trim() || orderIndex < 1) return;

                setIsSubmitting(true);
                try {
                    const formData = new FormData();
                    formData.append("title", title.trim());
                    formData.append("orderIndex", String(orderIndex));
                    formData.append("description", description.trim());
                    formData.append("isPublished", String(isPublished));

                    selectedFiles.forEach((file) => {
                        formData.append("files", file);
                    });

                    await onSubmit(formData);

                    setTitle("");
                    setOrderIndex(1);
                    setDescription("");
                    setIsPublished(true);
                    setSelectedFiles([]);
                    onClose();
                } catch (error) {
                    console.error("Loi khi tao bai hoc:", error);
                } finally {
                    setIsSubmitting(false);
                }
            },
            [
                title,
                orderIndex,
                description,
                isPublished,
                selectedFiles,
                onSubmit,
                onClose,
            ],
        );

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50 shrink-0">
                        <h2 className="text-lg font-bold text-gray-900">
                            Tạo bài học mới
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 rounded-full transition-colors focus:outline-none disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5"
                        noValidate
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Tiêu đề bài học{" "}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={isSubmitting}
                                    placeholder="Nhập tên bài học..."
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none disabled:opacity-70"
                                    required
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Thứ tự{" "}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    value={orderIndex}
                                    onChange={(e) =>
                                        setOrderIndex(Number(e.target.value))
                                    }
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none disabled:opacity-70 text-center"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Mô tả ngắn gọn
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isSubmitting}
                                placeholder="Nội dung chính của bài học này là gì?"
                                rows={3}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none disabled:opacity-70"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Tài liệu đính kèm
                            </label>
                            <div
                                onClick={() =>
                                    !isSubmitting &&
                                    fileInputRef.current?.click()
                                }
                                className={clsx(
                                    "border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-colors cursor-pointer group",
                                    isSubmitting &&
                                        "opacity-60 cursor-not-allowed",
                                )}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    multiple
                                    disabled={isSubmitting}
                                    className="hidden"
                                />
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-200 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                                    <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                                </div>
                                <p className="text-sm font-medium text-gray-700">
                                    Nhấn để chọn file hoặc kéo thả vào đây
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Hỗ trợ PDF, DOCX, PPTX (Tối đa 25MB)
                                </p>
                            </div>

                            {selectedFiles.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-md shrink-0">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 truncate">
                                                    {file.name}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveFile(index)
                                                }
                                                disabled={isSubmitting}
                                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors focus:outline-none shrink-0 disabled:opacity-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div>
                                <p className="text-sm font-bold text-gray-900">
                                    Đăng bài học
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Sinh viên có thể thấy bài học này ngay lập
                                    tức
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isPublished}
                                    disabled={isSubmitting}
                                    onChange={(e) =>
                                        setIsPublished(e.target.checked)
                                    }
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                            </label>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-end gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !title.trim()}
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                "Lưu bài học"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    },
);

CreateLessonModal.displayName = "CreateLessonModal";
