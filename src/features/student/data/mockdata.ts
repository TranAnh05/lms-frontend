import { 
    type StudentClassResponse, 
    type StudentLessonBasic, 
    type StudentExamBasic, 
    type ExamTakingResponse,
    type StudentGradeResponse
} from "../types";

// 1. Mock danh sách lớp đang học của sinh viên
export const MOCK_STUDENT_CLASSES: StudentClassResponse[] = [
    {
        classId: 101,
        classCode: "COMP1402_L03",
        courseName: "Phát triển ứng dụng Web chuyên nghiệp (ReactJS)",
        credits: 3,
        lecturerName: "ThS. Trần Văn Anh",
        status: "ONGOING"
    },
    {
        classId: 102,
        classCode: "COMP1405_L01",
        courseName: "Điện toán đám mây & Công nghệ Virtualization (Docker/Nginx)",
        credits: 3,
        lecturerName: "TS. Nguyễn Minh Triết",
        status: "ONGOING"
    },
    {
        classId: 103,
        classCode: "ENGL1102_L08",
        courseName: "Tiếng Anh chuyên ngành - Luyện thi TOEIC 650+",
        credits: 2,
        lecturerName: "Ms. Lê Hoàng Yến",
        status: "COMPLETED"
    }
];

// 2. Mock danh sách bài học theo từng classId
export const MOCK_STUDENT_LESSONS: Record<number, StudentLessonBasic[]> = {
    101: [
        {
            id: 1,
            classId: 101,
            title: "Chương 1: Tổng quan về Single Page Application & React Core",
            description: "Giới thiệu kiến trúc React, Virtual DOM và cách thiết lập môi trường phát triển với Vite.",
            orderIndex: 1,
            createdAt: "2026-05-10T08:00:00Z",
            materials: [
                { id: 11, fileName: "Slide_Chuong1_ReactCore.pdf", fileUrl: "#", fileType: "pdf", fileSize: 2450120 },
                { id: 12, fileName: "SourceCode_Lab1_Setup.zip", fileUrl: "#", fileType: "zip", fileSize: 15420100 }
            ]
        },
        {
            id: 2,
            classId: 101,
            title: "Chương 2: Kiến trúc Clean Code với Hooks & Tối ưu State",
            description: "Tìm hiểu sâu về useState, useEffect và kỹ thuật tách Custom Hooks để tái sử dụng logic.",
            orderIndex: 2,
            createdAt: "2026-05-17T08:00:00Z",
            materials: [
                { id: 13, fileName: "Document_Hooks_BestPractices.docx", fileUrl: "#", fileType: "docx", fileSize: 120500 }
            ]
        }
    ],
    102: [
        {
            id: 3,
            classId: 102,
            title: "Chương 1: Kiến trúc Virtualization & Tổng quan về Docker Container",
            description: "Phân biệt Virtual Machine và Container. Cài đặt Docker Engine trên môi trường Linux.",
            orderIndex: 1,
            createdAt: "2026-05-12T13:30:00Z",
            materials: [
                { id: 14, fileName: "Lab_Guide_Docker_Installation.pdf", fileUrl: "#", fileType: "pdf", fileSize: 1850000 }
            ]
        }
    ]
};

// 3. Mock danh sách bài kiểm tra theo từng classId (Bao gồm các trạng thái làm bài khác nhau)
export const MOCK_STUDENT_EXAMS: Record<number, StudentExamBasic[]> = {
    101: [
        {
            id: 501,
            classId: 101,
            title: "Kiểm tra Thường kỳ 1: Trắc nghiệm Kiến thức React Cơ bản",
            description: "Bài kiểm tra đánh giá kiến thức tuần 1 đến tuần 3. Sinh viên được làm bài 1 lần.",
            examType: "REGULAR",
            timeLimit: 15,
            totalQuestions: 10,
            status: "CLOSED",
            attemptStatus: "COMPLETED",
            score: 8.50
        },
        {
            id: 502,
            classId: 101,
            title: "Kiểm tra Giữa kỳ: Kỹ thuật xử lý State & Đồng bộ API nâng cao",
            description: "Đề thi chính thức. Đọc kỹ câu hỏi trước khi bấm chọn. Hệ thống tự nộp khi hết giờ.",
            examType: "MIDTERM",
            timeLimit: 45,
            totalQuestions: 30,
            status: "OPEN",
            attemptStatus: "NOT_STARTED"
        },
        {
            id: 503,
            classId: 101,
            title: "Kiểm tra Cuối kỳ: Kiến trúc Dự án Sản xuất & Triển khai",
            description: "Bài thi lý thuyết tổng hợp cuối môn học.",
            examType: "FINAL",
            timeLimit: 60,
            totalQuestions: 40,
            status: "CREATED",
            attemptStatus: "NOT_STARTED"
        }
    ],
    102: [
        {
            id: 601,
            classId: 102,
            title: "Kiểm tra Thường kỳ: Cấu hình Container & Quản trị Nginx Reverse Proxy",
            description: "Kiểm tra kỹ năng viết Dockerfile và điều hướng tên miền.",
            examType: "REGULAR",
            timeLimit: 20,
            totalQuestions: 15,
            status: "OPEN",
            attemptStatus: "IN_PROGRESS"
        }
    ]
};

// 4. Mock chi tiết câu hỏi của một đề thi cụ thể khi Sinh viên ấn nút "Làm bài" (Mã đề 502)
// Tuyệt đối che giấu trường 'isCorrect' ở đây
export const MOCK_EXAM_TAKING_DATA: Record<number, ExamTakingResponse> = {
    502: {
        examId: 502,
        title: "Kiểm tra Giữa kỳ: Kỹ thuật xử lý State & Đồng bộ API nâng cao",
        timeLimit: 45,
        totalQuestions: 3,
        questions: [
            {
                id: 2001,
                content: "Khi State thay đổi liên tục dẫn đến re-render không kiểm soát trong useEffect, nguyên nhân phổ biến nhất là gì?",
                orderIndex: 1,
                options: [
                    { id: 9011, content: "Quên truyền mảng phụ thuộc (dependency array) hoặc truyền sai biến kích hoạt.", orderIndex: 1 },
                    { id: 9012, content: "Sử dụng biến cục bộ thay vì biến state.", orderIndex: 2 },
                    { id: 9013, content: "Chưa bọc component trong React.memo.", orderIndex: 3 },
                    { id: 9014, content: "Không sử dụng thư viện Axios để gọi API.", orderIndex: 4 }
                ]
            },
            {
                id: 2002,
                content: "Trong kiến trúc Clean Code component, Hook nào được ưu tiên sử dụng để ghi nhớ một giá trị tính toán phức tạp nhằm tránh tính toán lại ở mỗi lượt re-render?",
                orderIndex: 2,
                options: [
                    { id: 9021, content: "useCallback", orderIndex: 1 },
                    { id: 9022, content: "useRef", orderIndex: 2 },
                    { id: 9023, content: "useMemo", orderIndex: 3 },
                    { id: 9024, content: "useReducer", orderIndex: 4 }
                ]
            },
            {
                id: 2003,
                content: "Tại sao không nên cập nhật trực tiếp biến state kiểu object mà phải clone nó ra trước bằng toán tử spread (...) hoặc các hàm deep clone?",
                orderIndex: 3,
                options: [
                    { id: 9031, content: "Để tăng tốc độ xử lý của trình duyệt Internet.", orderIndex: 1 },
                    { id: 9032, content: "Để giữ tính bất biến (Immutability), giúp React nhận diện được tham chiếu mới và kích hoạt re-render chính xác.", orderIndex: 2 },
                    { id: 9033, content: "Vì trình biên dịch TypeScript sẽ báo lỗi nghiêm trọng không cho chạy ứng dụng.", orderIndex: 3 },
                    { id: 9034, content: "Để giải phóng vùng nhớ thừa tự động.", orderIndex: 4 }
                ]
            }
        ]
    }
};

export const MOCK_STUDENT_GRADES: Record<number, StudentGradeResponse> = {
    101: {
        regularScore1: 8.5,
        regularScore2: 9.0,
        midtermScore: 7.5,
        finalScore: 8.0,
        totalScore: 8.1, // (8.5+9)/2 * 0.2 + 7.5 * 0.3 + 8 * 0.5
        status: 'PASS'
    },
    102: {
        regularScore1: 5.0,
        regularScore2: 6.0,
        midtermScore: 4.0,
        finalScore: 3.0,
        totalScore: 3.8, 
        status: 'FAIL'
    },
    103: {
        regularScore1: null,
        regularScore2: null,
        midtermScore: null,
        finalScore: null,
        totalScore: null,
        status: 'PENDING' // Lớp chưa có điểm
    }
};