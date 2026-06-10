/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Inbox, Loader2 } from "lucide-react";
import clsx from "clsx";
import { type CourseWithClassesResponse, type ClassInfo } from "../types";

interface CourseListWithClassesProps {
    data: CourseWithClassesResponse[];
    isLoading: boolean;
    registeredClassIds: number[];
    onRegisterClass: (classId: number) => void;
    onViewDetail: (classData: ClassInfo, course: CourseWithClassesResponse) => void;
}

export const CourseListWithClasses: React.FC<CourseListWithClassesProps> = ({
    data,
    isLoading,
    registeredClassIds,
    onRegisterClass,
    onViewDetail,
}) => {
    const [expandedCourses, setExpandedCourses] = useState<number[]>([]);

    // Tự động mở rộng môn học đầu tiên khi có dữ liệu
    useEffect(() => {
        if (data.length > 0) {
            setExpandedCourses([data[0].courseId]);
        }
    }, [data]);

    const toggleCourse = (courseId: number) => {
        setExpandedCourses(prev => 
            prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
        );
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                <p className="text-sm font-medium text-gray-500">Đang tải danh sách môn học...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-4 bg-gray-50 rounded-full mb-3 text-gray-400">
                    <Inbox className="w-10 h-10" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Không có môn học nào</h3>
                <p className="text-sm text-gray-500 mt-1">Hiện không có đợt đăng ký nào đang mở cho bạn.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {data.map((courseGroup) => {
                const { courseId, courseName, credits, classes } = courseGroup;
                const isExpanded = expandedCourses.includes(courseId);
                
                // Kiểm tra xem sinh viên đã đăng ký lớp nào trong môn này chưa (để disable các lớp khác cùng môn)
                const registeredClassInCourse = classes.find(c => registeredClassIds.includes(c.classId));

                return (
                    <div key={courseId} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200">
                        {/* Course Header */}
                        <div 
                            className={clsx(
                                "flex items-center justify-between p-4 cursor-pointer transition-colors",
                                isExpanded ? "bg-blue-50/20 border-b border-blue-100" : "hover:bg-gray-50"
                            )}
                            onClick={() => toggleCourse(courseId)}
                        >
                            <div>
                                <h3 className="text-base font-bold text-gray-900">
                                    {courseName} - {credits} Tín chỉ
                                </h3>
                            </div>
                            <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-gray-900">{classes.length}</p>
                                    <p className="text-xs text-gray-500">Lớp học phần</p>
                                </div>
                                {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </div>
                        </div>

                        {/* Classes Table */}
                        <div className={clsx(
                            "overflow-hidden transition-all duration-300 ease-in-out",
                            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                        )}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-5 py-3 font-semibold">Mã lớp</th>
                                            <th className="px-5 py-3 font-semibold">Giảng viên</th>
                                            <th className="px-5 py-3 font-semibold">Lịch học</th>
                                            <th className="px-5 py-3 font-semibold">Phòng</th>
                                            <th className="px-5 py-3 font-semibold text-center">Sĩ số</th>
                                            <th className="px-5 py-3 font-semibold text-center">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {classes.map((cls) => {
                                            const isRegistered = registeredClassIds.includes(cls.classId);
                                            const isFull = cls.currentStudents >= cls.maxStudents;
                                            
                                            // Khóa nút đăng ký nếu lớp đã đầy hoặc môn này đã được đăng ký (tránh đăng ký 2 lớp cùng 1 môn)
                                            const isDisabled = (!isRegistered && isFull) || (!isRegistered && !!registeredClassInCourse);
                                            
                                            const dayStr = cls.dayOfWeek === 8 ? "CN" : `T${cls.dayOfWeek}`;
                                            const timeString = cls.dayOfWeek ? `${dayStr} (${cls.shiftName} ${cls.startTimeShilf} - ${cls.endTimeShilf})` : "";

                                            return (
                                                <tr key={cls.classId} className={clsx(
                                                    "transition-colors",
                                                    isRegistered ? "bg-emerald-50/40" : "hover:bg-gray-50/50 bg-white"
                                                )}>
                                                    <td className="px-5 py-4 font-semibold text-gray-900">{cls.classCode}</td>
                                                    <td className="px-5 py-4 font-medium text-gray-700">
                                                        {cls.lecturerName || <span className="text-gray-400 italic">Chưa phân công</span>}
                                                    </td>
                                                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                                                        {timeString ? timeString : <span className="italic text-gray-400">Chưa có</span>}
                                                    </td>
                                                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                                                        {cls.roomName || <span className="italic text-gray-400">-</span>}
                                                    </td>
                                                    <td className="px-5 py-4 text-center whitespace-nowrap">
                                                        <span className={clsx("font-bold", isFull ? "text-rose-600" : "text-emerald-600")}>
                                                            {cls.currentStudents}
                                                        </span>
                                                        <span className="text-gray-400 font-medium mx-1">/</span>
                                                        <span className="text-gray-700 font-medium">{cls.maxStudents}</span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button 
                                                                onClick={() => onViewDetail(cls, courseGroup)}
                                                                className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none"
                                                            >
                                                                Chi tiết
                                                            </button>
                                                            {!isRegistered && (
                                                                <button
                                                                    onClick={() => onRegisterClass(cls.classId)}
                                                                    disabled={isDisabled}
                                                                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors focus:outline-none"
                                                                >
                                                                    {isFull ? "Đã đầy" : "Đăng ký"}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};