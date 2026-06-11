/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/refs */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    Timer,
    AlertTriangle,
    ShieldAlert,
    FileCheck,
    Loader2,
    ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { studentService } from "../services/student.service";
import {
    type ExamTakingResponse,
    type ExamSubmitResponse,
    type StudentExamBasic,
} from "../types";
import { QuestionCard } from "../components/exams/QuestionCard";

export const StudentTakeExamPage: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const examBasic = location.state?.exam as StudentExamBasic;

    const [isStarting, setIsStarting] = useState(false);
    const [examPaper, setExamPaper] = useState<ExamTakingResponse | null>(null);

    const [isStarted, setIsStarted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitResult, setSubmitResult] = useState<ExamSubmitResponse | null>(null);

    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState(0);

    const [showOverlay, setShowOverlay] = useState(false);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false); // State quản lý Modal nộp bài

    const isSubmittedRef = useRef(false);
    const isOverlayVisibleRef = useRef(false);
    const violationCountRef = useRef(0);
    const attemptIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!examBasic) {
            toast.error("Vui lòng truy cập bài kiểm tra từ danh sách lớp.");
            navigate(-1);
        }
    }, [examBasic, navigate]);

    const handleSelectOption = useCallback(async (questionId: number, optionId: number) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));

        if (attemptIdRef.current) {
            try {
                await studentService.saveStudentAnswer(attemptIdRef.current, {
                    questionId,
                    selectedOptionId: optionId,
                });
            } catch (error) {
                console.error("Lỗi khi đồng bộ đáp án với máy chủ:", error);
            }
        }
    }, []);

    const handleSubmit = useCallback(
        async (forced = false) => {
            if (!examPaper || isSubmittedRef.current) return;

            if (!attemptIdRef.current) {
                toast.error("Lỗi đồng bộ: Không tìm thấy mã phiên làm bài.");
                return;
            }

            isSubmittedRef.current = true;
            setIsSubmitted(true);

            try {
                let result;

                if (forced) {
                    result = await studentService.submitExam(attemptIdRef.current, true);
                } else {
                    try {
                        result = await studentService.submitExam(attemptIdRef.current, false);
                    } catch (error: any) {
                        // Custom confirm khi thiếu câu (có thể nâng cấp tiếp thành Modal sau nếu muốn)
                        if (window.confirm("Hệ thống phát hiện bạn còn câu hỏi chưa chọn đáp án. Bạn có thực sự muốn nộp bài không?")) {
                            result = await studentService.submitExam(attemptIdRef.current, true);
                        } else {
                            isSubmittedRef.current = false;
                            setIsSubmitted(false);
                            return;
                        }
                    }
                }

                setSubmitResult(result);

                if (document.fullscreenElement) {
                    await document.exitFullscreen().catch(() => {});
                }
                
                if (forced) {
                    toast.error("Bài làm đã được tự động thu do hết giờ hoặc vi phạm!");
                } else {
                    toast.success("Nộp bài thành công!");
                }
            } catch (error) {
                toast.error("Lỗi khi nộp bài. Vui lòng báo cáo giám thị.");
                isSubmittedRef.current = false;
                setIsSubmitted(false);
            }
        },
        [examPaper]
    );

    useEffect(() => {
        if (!isStarted || isSubmitted || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isStarted, isSubmitted, timeLeft, handleSubmit]);

    useEffect(() => {
        if (!isStarted || isSubmitted) return;

        const handleViolation = () => {
            if (isSubmittedRef.current || isOverlayVisibleRef.current) return;

            isOverlayVisibleRef.current = true;
            setShowOverlay(true);
            violationCountRef.current += 1;

            if (violationCountRef.current >= 2) {
                handleSubmit(true);
            } else {
                toast.warning(
                    `Cảnh báo vi phạm (${violationCountRef.current}/2). Đề thi bị tạm ẩn!`,
                );
            }
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) handleViolation();
        };
        const handleVisibilityChange = () => {
            if (document.hidden) handleViolation();
        };
        const handleBlur = () => handleViolation();

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isStarted, isSubmitted, handleSubmit]);

    const requestFullScreen = async () => {
        try {
            await document.documentElement.requestFullscreen();
            isOverlayVisibleRef.current = false;
            setShowOverlay(false);
            setIsStarted(true);
        } catch (err) {
            toast.error("Trình duyệt từ chối quyền toàn màn hình.");
            throw err;
        }
    };

    const handleStart = async () => {
        if (!examId || !examBasic) return;
        try {
            setIsStarting(true);

            try {
                const attemptData = await studentService.startExam(Number(examId));
                attemptIdRef.current = attemptData.attemptId;
            } catch (startError) {
                console.log("Phiên làm bài có thể đã được khởi tạo trước đó.");
            }

            const paperData = await studentService.getExamQuestions(Number(examId));
            setExamPaper(paperData);
            setTimeLeft(paperData.timeLimit * 60);

            await requestFullScreen();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Không thể tải cấu hình đề thi."
            );
        } finally {
            setIsStarting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    if (!examBasic) return null;

    if (isSubmitted && submitResult) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileCheck className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Đã nộp bài thành công
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Bạn đã hoàn thành bài kiểm tra.
                    </p>

                    <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                        <div className="text-sm text-gray-500 mb-1">
                            Điểm số của bạn
                        </div>
                        <div className="text-4xl font-black text-blue-600 mb-4">
                            {submitResult.score.toFixed(2)}
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                            Số câu đúng: {submitResult.correctAnswers} / {submitResult.totalQuestions}
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Thoát và quay lại lớp
                    </button>
                </div>
            </div>
        );
    }

    if (!isStarted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-xl w-full">
                    <button
                        onClick={() => navigate("/dashboard/student-classes")}
                        className="mb-3 font-bold text-[16px] hover:text-blue-600 flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-lg"
                    >
                        <ArrowLeft /> <span>Trở về</span>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">
                        {examBasic.title}
                    </h1>
                    <div className="flex gap-6 mb-8 text-sm font-medium text-gray-600 bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2">
                            <Timer className="w-5 h-5 text-blue-600" />
                            Thời gian: {examBasic.timeLimit} phút
                        </div>
                        <div className="flex items-center gap-2">
                            <FileCheck className="w-5 h-5 text-indigo-600" />
                            Tổng số: {examBasic.totalQuestions} câu hỏi
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-8 flex gap-3 text-rose-800 text-sm leading-relaxed">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <strong>Lưu ý quan trọng:</strong> Hệ thống bắt buộc
                            làm bài ở chế độ toàn màn hình. Nếu bạn rời khỏi màn
                            hình (Esc, Alt+Tab, chia màn hình) quá{" "}
                            <strong>2 lần</strong>, hệ thống sẽ tự động nộp bài!
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        disabled={isStarting}
                        className="w-full flex items-center justify-center py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-lg disabled:opacity-70"
                    >
                        {isStarting ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            "Bắt đầu làm bài"
                        )}
                    </button>
                </div>
            </div>
        );
    }

    if (!examPaper) return null;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col relative select-none">
            {showOverlay && (
                <div className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center">
                    <ShieldAlert className="w-20 h-20 text-rose-500 mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Đề thi đã bị tạm ẩn
                    </h2>
                    <p className="text-gray-300 max-w-lg text-lg mb-8">
                        Bạn đã vi phạm quy chế thi (thoát màn hình hoặc chuyển
                        tab).
                        <br />
                        Đây là lần vi phạm thứ{" "}
                        <strong>{violationCountRef.current}</strong>. Nếu vi
                        phạm 2 lần, bài sẽ tự động nộp.
                    </p>
                    <button
                        onClick={requestFullScreen}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-lg transition-colors shadow-sm shadow-blue-500/20"
                    >
                        Tôi đã hiểu, quay lại làm bài
                    </button>
                </div>
            )}

            <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-4 shadow-sm flex items-center justify-between">
                <h1 className="text-lg font-bold text-gray-800 truncate max-w-2xl">
                    {examPaper.title}
                </h1>
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg font-mono text-xl font-bold shrink-0">
                    <Timer className="w-5 h-5" />
                    {formatTime(timeLeft)}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-32">
                <div className="max-w-4xl mx-auto space-y-6 pb-20">
                    {examPaper.questions.map((q, idx) => (
                        <QuestionCard
                            key={q.questionId}
                            index={idx + 1}
                            question={q}
                            selectedOptionId={answers[q.questionId] || null}
                            onSelectOption={handleSelectOption}
                        />
                    ))}
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="text-gray-600 font-medium">
                        Đã chọn:{" "}
                        <span className="font-bold text-blue-600">
                            {Object.keys(answers).length}
                        </span>{" "}
                        / {examPaper.totalQuestions}
                    </div>
                    <button
                        onClick={() => setIsSubmitModalOpen(true)}
                        className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                    >
                        Nộp bài
                    </button>
                </div>
            </footer>

            {/* Modal Xác nhận nộp bài */}
            {isSubmitModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận nộp bài</h3>
                            <p className="text-gray-500 mb-6">
                                Bạn đã trả lời <strong className="text-blue-600">{Object.keys(answers).length}</strong> / {examPaper.totalQuestions} câu hỏi. Bạn có chắc chắn muốn nộp bài ngay bây giờ?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsSubmitModalOpen(false)}
                                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                                >
                                    Quay lại
                                </button>
                                <button
                                    onClick={() => {
                                        setIsSubmitModalOpen(false);
                                        handleSubmit(false);
                                    }}
                                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                                >
                                    Xác nhận nộp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};