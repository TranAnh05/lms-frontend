import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import clsx from "clsx";
import { type ExamType } from "../../types";

interface CreateExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
}

interface QuestionInput {
    questionText: string;
    orderIndex: number;
    answerA: string;
    answerB: string;
    answerC: string;
    answerD: string;
    correctAnswer: "A" | "B" | "C" | "D";
}

export const CreateExamModal: React.FC<CreateExamModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [examType, setExamType] = useState<ExamType>("REGULAR");
    const [timeLimit, setTimeLimit] = useState<number>(15);
    const [totalQuestions, setTotalQuestions] = useState<number>(5);
    const [questions, setQuestions] = useState<QuestionInput[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Tự động cập nhật danh sách và thứ tự câu hỏi ngầm
    useEffect(() => {
        const count = Math.max(0, totalQuestions);
        setQuestions((prev) => {
            const next = [...prev];
            if (next.length < count) {
                while (next.length < count) {
                    next.push({
                        questionText: "",
                        orderIndex: next.length + 1,
                        answerA: "",
                        answerB: "",
                        answerC: "",
                        answerD: "",
                        correctAnswer: "A",
                    });
                }
            } else if (next.length > count) {
                return next.slice(0, count);
            }
            return next;
        });
    }, [totalQuestions]);

    if (!isOpen) return null;

    const handleQuestionChange = (index: number, field: keyof QuestionInput, value: string | number) => {
        setQuestions((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || timeLimit <= 0 || totalQuestions <= 0) return;

        setIsSubmitting(true);
        try {
            const formattedQuestions = questions.map(q => ({
                content: q.questionText,
                orderIndex: q.orderIndex, // orderIndex được gửi ngầm xuống backend
                options: [
                    { content: q.answerA, isCorrect: q.correctAnswer === "A", orderIndex: 1 },
                    { content: q.answerB, isCorrect: q.correctAnswer === "B", orderIndex: 2 },
                    { content: q.answerC, isCorrect: q.correctAnswer === "C", orderIndex: 3 },
                    { content: q.answerD, isCorrect: q.correctAnswer === "D", orderIndex: 4 },
                ]
            }));

            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                examType,
                timeLimit,
                totalQuestions,
                questions: formattedQuestions,
            });
            
            setTitle("");
            setDescription("");
            setExamType("REGULAR");
            setTimeLimit(15);
            setTotalQuestions(5);
            setQuestions([]);
            onClose();
        } catch (error) {
            // Error handled by parent
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Tạo đề thi mới</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Thiết lập thông tin chung và bộ câu hỏi trắc nghiệm</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tiêu đề bài thi *</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ví dụ: Kiểm tra giữa kỳ - Kiến trúc Phần mềm"
                                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả bài thi</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Nhập hướng dẫn làm bài hoặc nội dung lưu ý cho sinh viên..."
                                rows={2}
                                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Loại bài thi</label>
                            <select
                                value={examType}
                                onChange={(e) => setExamType(e.target.value as ExamType)}
                                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="REGULAR">Điểm chuyên cần / Thường kỳ</option>
                                <option value="MIDTERM">Kiểm tra Giữa kỳ</option>
                                <option value="FINAL">Thi Cuối kỳ</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Thời gian (phút)</label>
                                <input
                                    type="number"
                                    min={1}
                                    required
                                    value={timeLimit}
                                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số lượng câu hỏi</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={100}
                                    required
                                    value={totalQuestions}
                                    onChange={(e) => setTotalQuestions(Number(e.target.value))}
                                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {questions.length > 0 && (
                        <div className="border-t border-gray-100 pt-5 space-y-6">
                            <h3 className="text-base font-bold text-gray-900">Nội dung bộ câu hỏi ({questions.length} câu)</h3>
                            
                            {questions.map((q, idx) => (
                                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200/60 space-y-4">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                        <span className="font-bold text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md shrink-0">
                                            Câu {idx + 1}
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Nhập nội dung câu hỏi..."
                                            value={q.questionText}
                                            onChange={(e) => handleQuestionChange(idx, "questionText", e.target.value)}
                                            className="w-full px-3.5 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 sm:pl-[76px]">
                                        {(["A", "B", "C", "D"] as const).map((label) => {
                                            const fieldName = `answer${label}` as keyof QuestionInput;
                                            const isCorrect = q.correctAnswer === label;

                                            return (
                                                <div key={label} className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuestionChange(idx, "correctAnswer", label)}
                                                        className={clsx(
                                                            "w-7 h-7 rounded-full text-xs font-bold shrink-0 border transition-all flex items-center justify-center",
                                                            isCorrect
                                                                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                                                                : "bg-white border-gray-300 text-gray-500 hover:border-gray-400"
                                                        )}
                                                    >
                                                        {label}
                                                    </button>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder={`Đáp án ${label}`}
                                                        value={q[fieldName] as string}
                                                        onChange={(e) => handleQuestionChange(idx, fieldName, e.target.value)}
                                                        className={clsx(
                                                            "w-full px-3 py-1.5 text-sm border rounded-lg bg-white focus:outline-none transition-colors",
                                                            isCorrect ? "border-emerald-500 ring-2 ring-emerald-500/10" : "border-gray-300 focus:border-blue-500"
                                                        )}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </form>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !title.trim()}
                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang tạo...
                            </>
                        ) : (
                            "Tạo đề thi"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};