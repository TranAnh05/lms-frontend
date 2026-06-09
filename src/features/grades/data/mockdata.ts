import { type StudentAcademicTranscript } from "../types";

export const MOCK_ACADEMIC_TRANSCRIPT: StudentAcademicTranscript = {
    overview: {
        totalEarnedCredits: 68,
        cumulativeGpa10: 8.25,
        cumulativeGpa4: 3.42,
        currentAcademicStatus: "NORMAL",
    },
    semesters: [
        {
            summary: {
                semesterId: 4,
                semesterCode: "HK2_2025_2026",
                academicYear: "2025-2026",
                semesterNumber: 4,
                totalRegisteredCredits: 16,
                totalEarnedCredits: 16,
                semesterGpa10: 8.6,
                semesterGpa4: 3.6,
                cumulativeGpa4: 3.42,
                academicStatus: "NORMAL"
            },
            subjects: [
                {
                    courseCode: "SWE401",
                    courseName: "Lập trình Web Frontend (React/Tailwind)",
                    credits: 4,
                    regularScore1: 9.0,
                    regularScore2: 9.5,
                    midtermScore: 8.5,
                    finalScore: 9.0,
                    totalScore10: 8.9,
                    totalScore4: 4.0,
                    letterGrade: "A",
                    status: "PASS"
                },
                {
                    courseCode: "SWE402",
                    courseName: "Kiến trúc phần mềm & Backend (Spring Boot)",
                    credits: 4,
                    regularScore1: 8.5,
                    regularScore2: 8.0,
                    midtermScore: 8.0,
                    finalScore: 8.5,
                    totalScore10: 8.3,
                    totalScore4: 3.5,
                    letterGrade: "B+",
                    status: "PASS"
                },
                {
                    courseCode: "SWE403",
                    courseName: "Điện toán đám mây & Docker",
                    credits: 3,
                    regularScore1: 8.0,
                    regularScore2: 8.5,
                    midtermScore: 7.5,
                    finalScore: 8.0,
                    totalScore10: 7.9,
                    totalScore4: 3.0,
                    letterGrade: "B",
                    status: "PASS"
                },
                {
                    courseCode: "ENG202",
                    courseName: "Tiếng Anh chuyên ngành",
                    credits: 3,
                    regularScore1: 9.0,
                    regularScore2: 9.0,
                    midtermScore: 9.0,
                    finalScore: 9.5,
                    totalScore10: 9.2,
                    totalScore4: 4.0,
                    letterGrade: "A",
                    status: "PASS"
                }
            ]
        },
        {
            summary: {
                semesterId: 3,
                semesterCode: "HK1_2025_2026",
                academicYear: "2025-2026",
                semesterNumber: 3,
                totalRegisteredCredits: 18,
                totalEarnedCredits: 18,
                semesterGpa10: 8.1,
                semesterGpa4: 3.2,
                cumulativeGpa4: 3.35,
                academicStatus: "NORMAL"
            },
            subjects: [
                {
                    courseCode: "SWE301",
                    courseName: "Cơ sở dữ liệu nâng cao",
                    credits: 4,
                    regularScore1: 8.0,
                    regularScore2: 8.0,
                    midtermScore: 7.5,
                    finalScore: 8.5,
                    totalScore10: 8.1,
                    totalScore4: 3.5,
                    letterGrade: "B+",
                    status: "PASS"
                },
                {
                    courseCode: "SWE302",
                    courseName: "Phân tích & Thiết kế hệ thống",
                    credits: 4,
                    regularScore1: 7.5,
                    regularScore2: 8.0,
                    midtermScore: 7.0,
                    finalScore: 7.5,
                    totalScore10: 7.4,
                    totalScore4: 3.0,
                    letterGrade: "B",
                    status: "PASS"
                },
                {
                    courseCode: "ENG201",
                    courseName: "Tiếng Anh giao tiếp 2",
                    credits: 3,
                    regularScore1: 8.5,
                    regularScore2: 8.5,
                    midtermScore: 8.0,
                    finalScore: 8.5,
                    totalScore10: 8.3,
                    totalScore4: 3.5,
                    letterGrade: "B+",
                    status: "PASS"
                }
            ]
        },
        {
            summary: {
                semesterId: 2,
                semesterCode: "HK2_2024_2025",
                academicYear: "2024-2025",
                semesterNumber: 2,
                totalRegisteredCredits: 16,
                totalEarnedCredits: 16,
                semesterGpa10: 8.4,
                semesterGpa4: 3.5,
                cumulativeGpa4: 3.45,
                academicStatus: "NORMAL"
            },
            subjects: [
                {
                    courseCode: "SWE201",
                    courseName: "Cấu trúc dữ liệu & Giải thuật",
                    credits: 4,
                    regularScore1: 8.5,
                    regularScore2: 9.0,
                    midtermScore: 8.5,
                    finalScore: 9.0,
                    totalScore10: 8.8,
                    totalScore4: 4.0,
                    letterGrade: "A",
                    status: "PASS"
                },
                {
                    courseCode: "SWE202",
                    courseName: "Lập trình hướng đối tượng (OOP)",
                    credits: 4,
                    regularScore1: 9.0,
                    regularScore2: 8.5,
                    midtermScore: 8.0,
                    finalScore: 8.5,
                    totalScore10: 8.4,
                    totalScore4: 3.5,
                    letterGrade: "B+",
                    status: "PASS"
                }
            ]
        },
        {
            summary: {
                semesterId: 1,
                semesterCode: "HK1_2024_2025",
                academicYear: "2024-2025",
                semesterNumber: 1,
                totalRegisteredCredits: 18,
                totalEarnedCredits: 18,
                semesterGpa10: 8.3,
                semesterGpa4: 3.4,
                cumulativeGpa4: 3.4,
                academicStatus: "NORMAL"
            },
            subjects: [
                {
                    courseCode: "SWE101",
                    courseName: "Nhập môn Kỹ thuật phần mềm",
                    credits: 3,
                    regularScore1: 8.0,
                    regularScore2: 8.5,
                    midtermScore: 8.0,
                    finalScore: 8.5,
                    totalScore10: 8.3,
                    totalScore4: 3.5,
                    letterGrade: "B+",
                    status: "PASS"
                },
                {
                    courseCode: "MATH101",
                    courseName: "Toán cao cấp 1",
                    credits: 3,
                    regularScore1: 7.0,
                    regularScore2: 7.5,
                    midtermScore: 8.0,
                    finalScore: 7.0,
                    totalScore10: 7.3,
                    totalScore4: 3.0,
                    letterGrade: "B",
                    status: "PASS"
                }
            ]
        }
    ]
};