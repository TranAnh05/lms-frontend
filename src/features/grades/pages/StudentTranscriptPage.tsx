import React, { useState, useEffect } from "react";
import { Loader2, FileSpreadsheet, ListTree, Shrink } from "lucide-react";
import { toast } from "react-toastify";
import { gradeService } from "../services/grade.service";
import { type StudentAcademicTranscript } from "../types";
import { GradeOverviewCard } from "../components/GradeOverviewCard";
import { SemesterGradeTable } from "../components/SemesterGradeTable";

export const StudentTranscriptPage: React.FC = () => {
    const [transcript, setTranscript] = useState<StudentAcademicTranscript | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedSemesters, setExpandedSemesters] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchTranscript = async () => {
            try {
                setIsLoading(true);
                const data = await gradeService.getAcademicTranscript();
                setTranscript(data);
                
                if (data.semesters && data.semesters.length > 0) {
                    setExpandedSemesters(new Set([data.semesters[0].summary.semesterId]));
                }
            } catch (error) {
                toast.error("Không thể tải bảng điểm. Vui lòng thử lại sau.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTranscript();
    }, []);

    const toggleSemester = (semesterId: number) => {
        setExpandedSemesters((prev) => {
            const next = new Set(prev);
            if (next.has(semesterId)) {
                next.delete(semesterId);
            } else {
                next.add(semesterId);
            }
            return next;
        });
    };

    const handleExpandAll = () => {
        if (transcript?.semesters) {
            setExpandedSemesters(new Set(transcript.semesters.map(s => s.summary.semesterId)));
        }
    };

    const handleCollapseAll = () => {
        setExpandedSemesters(new Set());
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Đang tải bảng điểm học tập...</p>
            </div>
        );
    }

    if (!transcript) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                    <FileSpreadsheet className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Chưa có dữ liệu bảng điểm</h2>
                <p className="text-gray-500">Dữ liệu quá trình học tập của bạn hiện đang trống hoặc chưa được cập nhật.</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <header className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                    Bảng điểm quá trình học tập
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                    Theo dõi chi tiết điểm số, số tín chỉ tích lũy và trạng thái học vụ qua từng học kỳ.
                </p>
            </header>

            <GradeOverviewCard overview={transcript.overview} />

            <div className="mt-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Chi tiết các học kỳ</h2>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleExpandAll}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <ListTree className="w-4 h-4" />
                            Mở rộng
                        </button>
                        <button 
                            onClick={handleCollapseAll}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-rose-600 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                        >
                            <Shrink className="w-4 h-4" />
                            Thu gọn
                        </button>
                    </div>
                </div>

                <div className="space-y-5">
                    {transcript.semesters.map((semester) => (
                        <SemesterGradeTable 
                            key={semester.summary.semesterId}
                            semesterTranscript={semester}
                            isExpanded={expandedSemesters.has(semester.summary.semesterId)}
                            onToggle={() => toggleSemester(semester.summary.semesterId)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};