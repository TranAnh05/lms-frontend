import React from "react";
import clsx from "clsx";
import {
    type StudentOfClassResponse,
    type EnrollmentStatus,
} from "../../types";

interface StudentListTableProps {
    students: StudentOfClassResponse[];
    isLoading: boolean;
}

// Cau hinh mau sac co dinh cho tung trang thai dang ky hoc
const STATUS_CONFIG: Record<
    EnrollmentStatus,
    { label: string; color: string }
> = {
    REGISTERED: {
        label: "Đăng ký",
        color: "bg-blue-50 text-blue-700 ring-blue-600/20",
    },
    OFFICIAL: {
        label: "Chính thức",
        color: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    },
    DROPPED: {
        label: "Đã rút",
        color: "bg-rose-50 text-rose-700 ring-rose-600/20",
    },
};

// Phuong an du phong neu trang thai khong nam trong cau hinh truc thuoc
const DEFAULT_STATUS = {
    label: "Không xác định",
    color: "bg-gray-50 text-gray-700 ring-gray-600/20",
};

// Helper: Lay chu cai viet tat tu ho ten sinh vien, an toan truoc cac loi ky tu khoang trang
const getStudentInitials = (fullName: string): string => {
    if (!fullName) return "";
    const nameParts = fullName.trim().split(/\s+/);
    return nameParts
        .map((n) => n[0])
        .slice(-2)
        .join("");
};

// Toi uu: Su dung React.memo de chan chan table khong render lai khi khong can thiet
export const StudentListTable = React.memo<StudentListTableProps>(
    ({ students, isLoading }) => {
        // Tron hieu ung loading
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Đang tải danh sách sinh viên...
                    </p>
                </div>
            );
        }

        // Xu ly truong hop danh sach trong
        if (!students || students.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-gray-200 shadow-sm border-dashed">
                    <h3 className="text-base font-bold text-gray-900">
                        Chưa có sinh viên
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Lớp học này hiện tại chưa có sinh viên nào đăng ký.
                    </p>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Thanh thong ke tong quan */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="text-base font-bold text-gray-900">
                        Danh sách sinh viên
                    </h3>
                    <span className="text-sm font-medium text-gray-500">
                        Tổng số:{" "}
                        <strong className="text-gray-900">
                            {students.length}
                        </strong>
                    </span>
                </div>

                {/* Bang du lieu chi tiet */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left table-auto">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold w-16 text-center">
                                    STT
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Sinh viên
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Liên hệ
                                </th>
                                <th className="px-6 py-4 font-semibold text-center">
                                    Trạng thái
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {students.map((student, index) => {
                                const status =
                                    STATUS_CONFIG[student.enrollmentStatus] ||
                                    DEFAULT_STATUS;
                                const initials = getStudentInitials(
                                    student.fullName,
                                );

                                return (
                                    <tr
                                        key={student.studentId}
                                        className="hover:bg-gray-50/50 transition-colors bg-white"
                                    >
                                        {/* So thu tu */}
                                        <td className="px-6 py-4 text-center text-gray-500 font-medium">
                                            {index + 1}
                                        </td>

                                        {/* Thong tin chi tiet kem anh dai dien */}
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
                                                    <div className="font-bold text-gray-900">
                                                        {student.fullName}
                                                    </div>
                                                    <div className="text-xs font-medium text-gray-500 mt-0.5">
                                                        {student.studentCode}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Thong tin email lien he */}
                                        <td className="px-6 py-4">
                                            <span
                                                className="block text-gray-600 truncate max-w-[200px]"
                                                title={student.email}
                                            >
                                                {student.email}
                                            </span>
                                        </td>

                                        {/* Nhãn trang thai phan lop */}
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={clsx(
                                                    "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ring-1 ring-inset",
                                                    status.color,
                                                )}
                                            >
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
    },
);

StudentListTable.displayName = "StudentListTable";
