import { type ClassRequestResponse } from "../types";

export const mockClassRequests: ClassRequestResponse[] = [
    {
        id: 1,
        semester: { id: 1, semesterCode: "HK1_2025", academicYear: "2025-2026" },
        course: { id: 101, code: "SWE101", name: "Nhập môn Kỹ thuật phần mềm", credits: 3, departmentId: 1 },
        requester: { id: 5, fullName: "PGS.TS. Lê Trưởng Khoa" },
        expectedStudents: 150,
        note: "Số lượng sinh viên năm nhất đông, cần ưu tiên mở ít nhất 3 lớp phòng lớn.",
        status: "PENDING",
        createdAt: "2025-08-15T08:30:00Z",
        updatedAt: "2025-08-15T08:30:00Z",
    },
    {
        id: 2,
        semester: { id: 1, semesterCode: "HK1_2025", academicYear: "2025-2026" },
        course: { id: 104, code: "DEV401", name: "Cloud Computing & DevOps (Docker)", credits: 3, departmentId: 1 },
        requester: { id: 5, fullName: "PGS.TS. Lê Trưởng Khoa" },
        expectedStudents: 40,
        note: "Môn chuyên ngành hẹp, cần xếp phòng máy tính có cấu hình mạnh (Ram 16GB).",
        status: "PENDING",
        createdAt: "2025-08-16T10:00:00Z",
        updatedAt: "2025-08-16T10:00:00Z",
    },
    {
        id: 3,
        semester: { id: 2, semesterCode: "HK2_2025", academicYear: "2025-2026" },
        course: { id: 201, code: "ENG101", name: "Tiếng Anh giao tiếp cơ bản", credits: 2, departmentId: 2 },
        requester: { id: 8, fullName: "TS. Nguyễn Ngoại Ngữ" },
        expectedStudents: 30,
        status: "REJECTED",
        rejectReason: "Phòng đào tạo thông báo môn này dời sang học kỳ Hè do thiếu giảng viên cơ hữu.",
        createdAt: "2025-11-01T09:15:00Z",
        updatedAt: "2025-11-05T14:20:00Z",
    },
    {
        id: 4,
        semester: { id: 2, semesterCode: "HK2_2025", academicYear: "2025-2026" },
        course: { id: 102, code: "WEB201", name: "Phát triển Ứng dụng Web Front-end (React)", credits: 4, departmentId: 1 },
        requester: { id: 5, fullName: "PGS.TS. Lê Trưởng Khoa" },
        expectedStudents: 80,
        status: "REJECTED",
        rejectReason: "Phòng đào tạo thông báo môn này dời sang học kỳ Hè do thiếu giảng viên cơ hữu.",
        createdAt: "2025-11-10T11:00:00Z",
        updatedAt: "2025-11-12T16:00:00Z",
    }
];