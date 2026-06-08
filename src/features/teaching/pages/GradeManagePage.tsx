/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { GraduationCap, Lock, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { teachingService } from "../services/teaching.service";
import { type StudentGrade, type ClassBasic, type GradeFormula } from "../types";
import { GradebookTable } from "../components/grades/GradebookTable";
import { FinalizeGradeModal } from "../components/grades/FinalizeGradeModal";

export const GradeManagePage: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const { classData } = useOutletContext<{ classData: ClassBasic }>();
    
    const [grades, setGrades] = useState<StudentGrade[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFinalized, setIsFinalized] = useState(classData?.status === "COMPLETED");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formula: GradeFormula = {
        regularWeight: 0.2,
        midtermWeight: 0.3,
        finalWeight: 0.5
    };

    useEffect(() => {
        const fetchGrades = async () => {
            if (!classId) return;
            setIsLoading(true);
            try {
                const data = await teachingService.getClassGrades(Number(classId));
                setGrades(data);
            } catch (error) {
                toast.error("Không thể tải bảng điểm lớp học.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchGrades();
    }, [classId]);

    const handleGradeChange = (
        enrollmentId: number, 
        field: "regularScore1" | "midtermScore" | "finalScore", 
        value: number | null
    ) => {
        setGrades(prev => prev.map(grade => 
            grade.enrollmentId === enrollmentId 
                ? { ...grade, [field]: value } 
                : grade
        ));
    };

    const handleSaveGrades = async () => {
        // TODO: Kết nối API lưu điểm thực tế
        await new Promise(resolve => setTimeout(resolve, 800));
        toast.success("Đã lưu tiến độ điểm thành công!");
    };

    const handleFinalize = async () => {
        if (!classId) return;
        try {
            await teachingService.finalizeGrades(Number(classId));
            setIsFinalized(true);
            toast.success("Đã chốt điểm học phần thành công!");
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi chốt điểm.");
            throw error;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Quản lý Bảng điểm</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Cập nhật điểm thành phần và chốt điểm khi kết thúc học phần
                        </p>
                    </div>
                </div>
                
                {isFinalized ? (
                    <div className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg w-full sm:w-auto">
                        <CheckCircle className="w-4 h-4" />
                        Đã chốt học phần
                    </div>
                ) : (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/20 w-full sm:w-auto shadow-sm"
                    >
                        <Lock className="w-4 h-4" />
                        Chốt điểm học phần
                    </button>
                )}
            </div>

            <GradebookTable 
                grades={grades} 
                formula={formula}
                isLoading={isLoading} 
                isFinalized={isFinalized}
                onGradeChange={handleGradeChange}
                onSaveGrades={handleSaveGrades}
            />

            <FinalizeGradeModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleFinalize}
            />
        </div>
    );
};