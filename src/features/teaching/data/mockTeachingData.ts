import { 
    type ClassBasic, 
    type StudentInClass, 
    type LessonBasic, 
    type ExamBasic, 
    type StudentGrade 
} from "../types";

export const MOCK_CLASSES: ClassBasic[] = [
    {
        id: 1,
        code: "SWE301_L01",
        courseCode: "SWE301",
        courseName: "Kỹ thuật phần mềm nâng cao",
        credits: 3,
        semesterCode: "SE2026",
        maxStudents: 40,
        currentStudents: 2,
        status: "ONGOING"
    },
    {
        id: 2,
        code: "ITE204_L02",
        courseCode: "ITE204",
        courseName: "Cơ sở dữ liệu nâng cao (PostgreSQL)",
        credits: 4,
        semesterCode: "SE2026",
        maxStudents: 35,
        currentStudents: 2,
        status: "ONGOING"
    }
];

export const MOCK_STUDENTS: Record<number, StudentInClass[]> = {
    1: [
        {
            enrollmentId: 101,
            studentId: 501,
            studentCode: "SV220145",
            fullName: "Trần Văn Anh",
            email: "vananh.tran@student.gdu.edu.vn",
            cohort: 2022,
            enrollmentStatus: "OFFICIAL",
            enrolledAt: "2026-01-10T08:00:00Z"
        },
        {
            enrollmentId: 102,
            studentId: 502,
            studentCode: "SV220189",
            fullName: "Nguyễn Thị Mai",
            email: "mainguyen@student.gdu.edu.vn",
            cohort: 2022,
            enrollmentStatus: "OFFICIAL",
            enrolledAt: "2026-01-10T08:30:00Z"
        }
    ],
    2: [
        {
            enrollmentId: 103,
            studentId: 501,
            studentCode: "SV220145",
            fullName: "Trần Văn Anh",
            email: "vananh.tran@student.gdu.edu.vn",
            cohort: 2022,
            enrollmentStatus: "OFFICIAL",
            enrolledAt: "2026-01-12T09:00:00Z"
        },
        {
            enrollmentId: 104,
            studentId: 503,
            studentCode: "SV220210",
            fullName: "Lê Hoàng Nam",
            email: "namle@student.gdu.edu.vn",
            cohort: 2022,
            enrollmentStatus: "OFFICIAL",
            enrolledAt: "2026-01-12T10:15:00Z"
        }
    ]
};

export const MOCK_LESSONS: Record<number, LessonBasic[]> = {
    1: [
        {
            id: 201,
            title: "Bài 01: Kiến trúc phần mềm & Design Patterns thông dụng",
            description: "Tổng quan về các mẫu kiến trúc MVC, Microservices và Singleton, Factory Pattern.",
            orderIndex: 1,
            isPublished: true,
            materials: [
                { id: 401, fileName: "Slide_KienTrucPhanMem.pdf", fileUrl: "#", fileType: "pdf", fileSize: 2450000 },
                { id: 402, fileName: "BaiTap_DesignPattern.docx", fileUrl: "#", fileType: "docx", fileSize: 450000 }
            ],
            createdAt: "2026-01-15T07:00:00Z",
            updatedAt: "2026-01-15T07:00:00Z"
        },
        {
            id: 202,
            title: "Bài 02: Clean Architecture và Nguyên lý SOLID",
            description: "Hướng dẫn tổ chức cấu trúc dự án chuẩn hóa doanh nghiệp theo các lớp Domain, Application, Infrastructure.",
            orderIndex: 2,
            isPublished: true,
            materials: [
                { id: 403, fileName: "Document_SOLID_Principles.pdf", fileUrl: "#", fileType: "pdf", fileSize: 1850000 }
            ],
            createdAt: "2026-01-22T07:00:00Z",
            updatedAt: "2026-01-22T08:15:00Z"
        }
    ],
    2: [
        {
            id: 203,
            title: "Bài 01: Cài đặt, Cấu hình và Tối ưu hóa PostgreSQL",
            description: "Tổng quan hệ quản trị cơ sở dữ liệu PostgreSQL. Thiết lập indexing nâng cao.",
            orderIndex: 1,
            isPublished: true,
            materials: [
                { id: 404, fileName: "PostgreSQL_Advanced_Index.pdf", fileUrl: "#", fileType: "pdf", fileSize: 3200000 }
            ],
            createdAt: "2026-01-16T13:00:00Z",
            updatedAt: "2026-01-16T13:00:00Z"
        }
    ]
};

export const MOCK_EXAMS: Record<number, ExamBasic[]> = {
    1: [
        {
            id: 301,
            title: "Kiểm tra định kỳ lần 1: Trắc nghiệm Design Patterns",
            description: "Thời gian làm bài 15 phút, hệ thống tự động khóa khi hết giờ.",
            examType: "REGULAR",
            timeLimit: 15,
            totalQuestions: 15,
            status: "CLOSED",
            createdAt: "2026-02-05T09:00:00Z"
        },
        {
            id: 302,
            title: "Kiểm tra giữa kỳ: Thực hành & Trắc nghiệm Kiến trúc phần mềm",
            description: "Đề thi bao phủ kiến trúc SOLID, Clean Architecture và quản lý State ứng dụng.",
            examType: "MIDTERM",
            timeLimit: 45,
            totalQuestions: 30,
            status: "OPEN",
            createdAt: "2026-03-10T14:00:00Z"
        }
    ],
    2: [
        {
            id: 303,
            title: "Trắc nghiệm: Thiết kế và Tối ưu hóa Database Query",
            description: "Đánh giá khả năng hiểu luồng xử lý câu lệnh SQL giải thuật Index.",
            examType: "REGULAR",
            timeLimit: 20,
            totalQuestions: 20,
            status: "OPEN",
            createdAt: "2026-02-18T10:00:00Z"
        }
    ]
};

export const MOCK_GRADES: Record<number, StudentGrade[]> = {
    1: [
        {
            enrollmentId: 101,
            studentCode: "SV220145",
            fullName: "Trần Văn Anh",
            regularScore1: 8.5,
            regularScore2: 9.0,
            midtermScore: 8.0,
            finalScore: 8.5,
            totalScore: 8.45,
            status: "PASS"
        },
        {
            enrollmentId: 102,
            studentCode: "SV220189",
            fullName: "Nguyễn Thị Mai",
            regularScore1: 7.0,
            regularScore2: 7.5,
            midtermScore: 6.5,
            finalScore: 7.0,
            totalScore: 6.85,
            status: "PENDING"
        }
    ],
    2: [
        {
            enrollmentId: 103,
            studentCode: "SV220145",
            fullName: "Trần Văn Anh",
            regularScore1: 9.0,
            regularScore2: 8.5,
            midtermScore: 9.0,
            finalScore: 9.5,
            totalScore: 9.20,
            status: "PASS"
        },
        {
            enrollmentId: 104,
            studentCode: "SV220210",
            fullName: "Lê Hoàng Nam",
            regularScore1: 5.0,
            regularScore2: 6.0,
            midtermScore: 5.5,
            finalScore: 4.0,
            totalScore: 4.75,
            status: "PENDING"
        }
    ]
};