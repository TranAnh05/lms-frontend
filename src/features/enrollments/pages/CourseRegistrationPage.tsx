/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { Library } from "lucide-react";

import { 
    type CourseWithClassesDTO, 
    type RegisteredClassDTO, 
    type ClassRegistrationDTO, 
    type CourseBasic 
} from "../types";
import { enrollmentService } from "../services/enrollment.service";

import { CourseListWithClasses } from "../components/CourseListWithClasses";
import { RegisteredClassesTable } from "../components/RegisteredClassesTable";
import { EnrollmentSummary } from "../components/EnrollmentSummary";
import { ClassDetailModal } from "../components/ClassDetailModal";

import { mockCoursesWithClasses, mockRegisteredClasses } from "../data/mockEnrollmentData";

export const CourseRegistrationPage: React.FC = () => {
    const [courses, setCourses] = useState<CourseWithClassesDTO[]>([]);
    const [registeredClasses, setRegisteredClasses] = useState<RegisteredClassDTO[]>([]);
    
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [isLoadingCart, setIsLoadingCart] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const [selectedClass, setSelectedClass] = useState<ClassRegistrationDTO | null>(null);
    const [selectedCourseContext, setSelectedCourseContext] = useState<CourseBasic | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchInitialData = useCallback(async () => {
        setIsLoadingCourses(true);
        setIsLoadingCart(true);
        try {
            // TODO: Thay bằng API thực tế
            setTimeout(() => {
                setCourses(mockCoursesWithClasses);
                setRegisteredClasses(mockRegisteredClasses);
                setIsLoadingCourses(false);
                setIsLoadingCart(false);
            }, 800);
        } catch (error) {
            toast.error("Lỗi khi tải dữ liệu đăng ký học phần.");
            setIsLoadingCourses(false);
            setIsLoadingCart(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const { totalCredits, totalClasses } = useMemo(() => {
        return registeredClasses.reduce(
            (acc, curr) => ({
                totalCredits: acc.totalCredits + curr.credits,
                totalClasses: acc.totalClasses + 1
            }),
            { totalCredits: 0, totalClasses: 0 }
        );
    }, [registeredClasses]);

    const registeredClassIds = useMemo(() => {
        return registeredClasses.map(rc => rc.classId);
    }, [registeredClasses]);

    const handleRegisterClass = async (classId: number) => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            // TODO: API logic
            const targetCourse = courses.find(c => c.classes.some(cls => cls.id === classId));
            const targetClass = targetCourse?.classes.find(cls => cls.id === classId);
            
            if (targetCourse && targetClass) {
                const newRegistered: RegisteredClassDTO = {
                    enrollmentId: Date.now(),
                    status: "REGISTERED",
                    enrolledAt: new Date().toISOString(),
                    classId: targetClass.id,
                    classCode: targetClass.code,
                    courseId: targetCourse.course.id,
                    courseName: targetCourse.course.name,
                    courseCode: targetCourse.course.code,
                    credits: targetCourse.course.credits,
                    schedules: targetClass.schedules
                };
                
                setCourses(prev => prev.map(c => ({
                    ...c,
                    classes: c.classes.map(cls => cls.id === classId ? { ...cls, currentStudents: cls.currentStudents + 1 } : cls)
                })));
                
                setRegisteredClasses(prev => [newRegistered, ...prev]);
                toast.success(`Đăng ký thành công lớp ${targetClass.code}`);
            }
        } catch (error) {
            toast.error("Đăng ký thất bại. Lớp có thể đã đầy hoặc bị trùng lịch.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancelRegistration = async (targetId: number, isClassId: boolean = false) => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            const classIdToCancel = isClassId 
                ? targetId 
                : registeredClasses.find(rc => rc.enrollmentId === targetId)?.classId;

            if (!classIdToCancel) return;

            setCourses(prev => prev.map(c => ({
                ...c,
                classes: c.classes.map(cls => cls.id === classIdToCancel ? { ...cls, currentStudents: cls.currentStudents - 1 } : cls)
            })));

            setRegisteredClasses(prev => prev.filter(rc => rc.classId !== classIdToCancel));
            toast.info("Đã hủy lớp học phần.");
        } catch (error) {
            toast.error("Hủy đăng ký thất bại.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleViewDetail = (classData: ClassRegistrationDTO, course: CourseBasic) => {
        setSelectedClass(classData);
        setSelectedCourseContext(course);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-4 lg:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900">DANH SÁCH MÔN HỌC MỞ ĐĂNG KÝ</h2>
                        </div>
                        
                        <CourseListWithClasses 
                            data={courses}
                            isLoading={isLoadingCourses}
                            registeredClassIds={registeredClassIds}
                            onRegisterClass={handleRegisterClass}
                            onViewDetail={handleViewDetail}
                        />
                    </div>

                    <EnrollmentSummary 
                        totalCredits={totalCredits}
                        totalClasses={totalClasses}
                        minCredits={14}
                        maxCredits={24}
                    />
                    
                    <RegisteredClassesTable 
                        data={registeredClasses}
                        isLoading={isLoadingCart}
                    />
                </div>
            </div>

            <ClassDetailModal 
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                classData={selectedClass}
                courseName={selectedCourseContext?.name}
                courseCode={selectedCourseContext?.code}
            />
        </div>
    );
};