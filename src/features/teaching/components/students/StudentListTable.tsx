import React from "react";
import clsx from "clsx";
import { type StudentInClass, type EnrollmentStatus } from "../../types";

interface StudentListTableProps {
    students: StudentInClass[];
    isLoading: boolean;
}

const STATUS_CONFIG: Record<EnrollmentStatus, { label: string; color: string }> = {
    REGISTERED: { label: "Đăng ký", color: "bg-blue-50 text-blue-700 ring-blue-600/20" },
    OFFICIAL: { label: "Chính thức", color: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
    DROPPED: { label: "Đã rút", color: "bg-rose-50 text-rose-700 ring-rose-600/20" },
};

export const StudentListTable: React.FC<StudentListTableProps> = ({ students, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Đang tải danh sách sinh viên...</p>
            </div>
        );
    }

    if (!students || students.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-gray-200 shadow-sm border-dashed">
                <h3 className="text-base font-bold text-gray-900">Chưa có sinh viên</h3>
                <p className="text-sm text-gray-500 mt-1">Lớp học này hiện tại chưa có sinh viên nào đăng ký.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-900">Danh sách sinh viên</h3>
                <span className="text-sm font-medium text-gray-500">
                    Tổng số: <strong className="text-gray-900">{students.length}</strong>
                </span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold w-16 text-center">STT</th>
                            <th className="px-6 py-4 font-semibold">Sinh viên</th>
                            <th className="px-6 py-4 font-semibold">Liên hệ</th>
                            <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {students.map((student, index) => {
                            const status = STATUS_CONFIG[student.enrollmentStatus];
                            const initials = student.fullName.split(' ').map(n => n[0]).slice(-2).join('');
                            
                            return (
                                <tr key={student.enrollmentId} className="hover:bg-gray-50/50 transition-colors bg-white">
                                    <td className="px-6 py-4 text-center text-gray-500 font-medium">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {student.avatarUrl ? (
                                                <img 
                                                    src={student.avatarUrl} 
                                                    alt={student.fullName} 
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200 shrink-0 uppercase">
                                                    {initials}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-gray-900">{student.fullName}</div>
                                                <div className="text-xs font-medium text-gray-500 mt-0.5">{student.studentCode}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-600 truncate max-w-[200px]" title={student.email}>
                                            {student.email}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={clsx(
                                            "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ring-1 ring-inset",
                                            status.color
                                        )}>
                                            {status.label}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};