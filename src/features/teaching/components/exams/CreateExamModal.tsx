import React, { useState, useEffect, useCallback, memo } from "react";
import { X, Loader2 } from "lucide-react";
import clsx from "clsx";
import { type ExamType, type CreateExamPayload } from "../../types";

interface CreateExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateExamPayload) => Promise<void>;
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

// Toi uu 1: Đưa hang so va class CSS dung chung ra ngoai de tranh tao lai moi khi render
const ANSWER_LABELS = ["A", "B", "C", "D"] as const;

const INPUT_BASE_CLASSES =
    "w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed";

interface QuestionItemProps {
    index: number;
    question: QuestionInput;
    onQuestionChange: (
        index: number,
        field: keyof QuestionInput,
        value: string | number,
    ) => void;
    disabled: boolean;
}

// Toi uu 2: Tach va memo hoa tung o nhap cau hoi de co lap re-render, gop phan tang toc UI khi nhap lieu
const QuestionItem: React.FC<QuestionItemProps> = memo(
    ({ index, question, onQuestionChange, disabled }) => {
        return (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/60 space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <span className="font-bold text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md shrink-0">
                        Câu {index + 1}
                    </span>
                    <input
                        type="text"
                        required
                        disabled={disabled}
                        placeholder="Nhập nội dung câu hỏi..."
                        value={question.questionText}
                        onChange={(e) =>
                            onQuestionChange(
                                index,
                                "questionText",
                                e.target.value,
                            )
                        }
                        className={INPUT_BASE_CLASSES}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 sm:pl-[76px]">
                    {ANSWER_LABELS.map((label) => {
                        const fieldName =
                            `answer${label}` as keyof QuestionInput;
                        const isCorrect = question.correctAnswer === label;

                        return (
                            <div
                                key={label}
                                className="flex items-center gap-2"
                            >
                                <button
                                    type="button"
                                    disabled={disabled}
                                    onClick={() =>
                                        onQuestionChange(
                                            index,
                                            "correctAnswer",
                                            label,
                                        )
                                    }
                                    className={clsx(
                                        "w-7 h-7 rounded-full text-xs font-bold shrink-0 border transition-all flex items-center justify-center focus:outline-none disabled:opacity-50",
                                        isCorrect
                                            ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                                            : "bg-white border-gray-300 text-gray-500 hover:border-gray-400",
                                    )}
                                >
                                    {label}
                                </button>
                                <input
                                    type="text"
                                    required
                                    disabled={disabled}
                                    placeholder={`Đáp án ${label}`}
                                    value={question[fieldName] as string}
                                    onChange={(e) =>
                                        onQuestionChange(
                                            index,
                                            fieldName,
                                            e.target.value,
                                        )
                                    }
                                    className={clsx(
                                        INPUT_BASE_CLASSES,
                                        isCorrect
                                            ? "border-emerald-500 ring-2 ring-emerald-500/10"
                                            : "border-gray-300 focus:border-blue-500",
                                    )}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    },
);

QuestionItem.displayName = "QuestionItem";

export const CreateExamModal: React.FC<CreateExamModalProps> = memo(
    ({ isOpen, onClose, onSubmit }) => {
        const [title, setTitle] = useState("");
        const [description, setDescription] = useState("");
        const [examType, setExamType] = useState<ExamType>("REGULAR");
        const [timeLimit, setTimeLimit] = useState<number>(15);
        const [totalQuestions, setTotalQuestions] = useState<number>(5);
        const [questions, setQuestions] = useState<QuestionInput[]>([]);
        const [isSubmitting, setIsSubmitting] = useState(false);

        useEffect(() => {
            const count = Math.max(0, totalQuestions);
            setQuestions((prev) => {
                if (prev.length === count) return prev;

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
                    return next;
                }
                return next.slice(0, count);
            });
        }, [totalQuestions]);

        // Toi uu 3: Boc useCallback de giu tham chieu hàm on dinh cho component con su dung
        const handleQuestionChange = useCallback(
            (
                index: number,
                field: keyof QuestionInput,
                value: string | number,
            ) => {
                setQuestions((prev) => {
                    const updated = [...prev];
                    updated[index] = { ...updated[index], [field]: value };
                    return updated;
                });
            },
            [],
        );

        const handleSubmit = useCallback(
            async (e: React.FormEvent) => {
                e.preventDefault();
                if (!title.trim() || timeLimit <= 0 || totalQuestions <= 0)
                    return;

                setIsSubmitting(true);
                try {
                    const formattedQuestions = questions.map((q) => ({
                        content: q.questionText.trim(),
                        orderIndex: q.orderIndex,
                        options: [
                            {
                                content: q.answerA.trim(),
                                isCorrect: q.correctAnswer === "A",
                                orderIndex: 1,
                            },
                            {
                                content: q.answerB.trim(),
                                isCorrect: q.correctAnswer === "B",
                                orderIndex: 2,
                            },
                            {
                                content: q.answerC.trim(),
                                isCorrect: q.correctAnswer === "C",
                                orderIndex: 3,
                            },
                            {
                                content: q.answerD.trim(),
                                isCorrect: q.correctAnswer === "D",
                                orderIndex: 4,
                            },
                        ],
                    }));

                    await onSubmit({
                        title: title.trim(),
                        description: description.trim(),
                        examType,
                        timeLimit,
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
                    console.error("Lỗi tạo đề thi:", error);
                }
                {
                    setIsSubmitting(false);
                }
            },
            [
                title,
                description,
                examType,
                timeLimit,
                totalQuestions,
                questions,
                onSubmit,
                onClose,
            ],
        );

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                {/* Overlay nhan su kien click de dong */}
                <div
                    className="absolute inset-0"
                    onClick={!isSubmitting ? onClose : undefined}
                />

                <div className="relative z-10 bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Tạo đề thi mới
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Thiết lập thông tin chung và bộ câu hỏi trắc
                                nghiệm
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
                        noValidate
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Tiêu đề bài thi *
                                </label>
                                <input
                                    type="text"
                                    required
                                    disabled={isSubmitting}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ví dụ: Kiểm tra giữa kỳ - Kiến trúc Phần mềm"
                                    className={INPUT_BASE_CLASSES}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Mô tả bài thi
                                </label>
                                <textarea
                                    value={description}
                                    disabled={isSubmitting}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="Nhập hướng dẫn làm bài hoặc nội dung lưu ý cho sinh viên..."
                                    rows={2}
                                    className={clsx(
                                        INPUT_BASE_CLASSES,
                                        "resize-none",
                                    )}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Loại bài thi
                                </label>
                                <select
                                    value={examType}
                                    disabled={isSubmitting}
                                    onChange={(e) =>
                                        setExamType(e.target.value as ExamType)
                                    }
                                    className={clsx(
                                        INPUT_BASE_CLASSES,
                                        "cursor-pointer appearance-none pr-10",
                                    )}
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                        backgroundPosition:
                                            "right 0.75rem center",
                                        backgroundSize: "1rem",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                >
                                    <option value="REGULAR">
                                        Điểm chuyên cần / Thường kỳ
                                    </option>
                                    <option value="MIDTERM">
                                        Kiểm tra Giữa kỳ
                                    </option>
                                    <option value="FINAL">Thi Cuối kỳ</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Thời gian (phút)
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        required
                                        disabled={isSubmitting}
                                        value={timeLimit}
                                        onChange={(e) =>
                                            setTimeLimit(Number(e.target.value))
                                        }
                                        className={clsx(
                                            INPUT_BASE_CLASSES,
                                            "text-center",
                                        )}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Số lượng câu hỏi
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={100}
                                        required
                                        disabled={isSubmitting}
                                        value={totalQuestions}
                                        onChange={(e) =>
                                            setTotalQuestions(
                                                Number(e.target.value),
                                            )
                                        }
                                        className={clsx(
                                            INPUT_BASE_CLASSES,
                                            "text-center",
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {questions.length > 0 && (
                            <div className="border-t border-gray-100 pt-5 space-y-6">
                                <h3 className="text-base font-bold text-gray-900">
                                    Nội dung bộ câu hỏi ({questions.length} câu)
                                </h3>

                                {questions.map((q, idx) => (
                                    <QuestionItem
                                        key={idx}
                                        index={idx}
                                        question={q}
                                        disabled={isSubmitting}
                                        onQuestionChange={handleQuestionChange}
                                    />
                                ))}
                            </div>
                        )}
                    </form>

                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-end gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>
                        {/* Toi uu 4: Chuyen ve type submit tuyen minh, loai bo onClick han che double tap */}
                        <button
                            type="submit"
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
    },
);

CreateExamModal.displayName = "CreateExamModal";
