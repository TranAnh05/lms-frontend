import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { teachingService } from "../services/teaching.service";
import { type StudentOfClassResponse } from "../types";
import { StudentListTable } from "../components/students/StudentListTable";

export const StudentManagePage: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const [students, setStudents] = useState<StudentOfClassResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            if (!classId) return;
            setIsLoading(true);
            try {
                const data = await teachingService.getStudentsOfClass(Number(classId));
                setStudents(data);
            } catch (error) {
                toast.error("Không thể tải danh sách sinh viên.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, [classId]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">Quản lý Sinh viên</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                    Theo dõi và quản lý danh sách sinh viên thuộc học phần
                </p>
            </div>

            <StudentListTable 
                students={students} 
                isLoading={isLoading} 
            />
        </div>
    );
};