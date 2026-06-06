import { type CourseWithClassesDTO, type RegisteredClassDTO } from "../types";

export const mockCoursesWithClasses: CourseWithClassesDTO[] = [
    {
        course: {
            id: 1,
            code: "SWE301",
            name: "Phát triển Web Frontend Nâng cao",
            credits: 3,
        },
        classes: [
            {
                id: 101,
                code: "SWE301-01",
                maxStudents: 40,
                currentStudents: 40,
                status: "REGISTRATION",
                lecturer: { id: 1, fullName: "TS. Nguyễn Văn Cường", employeeCode: "GV001" },
                schedules: [
                    {
                        id: 1,
                        dayOfWeek: 2,
                        shift: { id: 1, name: "Ca 1", startTime: "07:00", endTime: "09:30" },
                        room: { id: 1, name: "A1.101", type: "THEORY" },
                    },
                ],
            },
            {
                id: 102,
                code: "SWE301-02",
                maxStudents: 40,
                currentStudents: 15,
                status: "REGISTRATION",
                lecturer: { id: 2, fullName: "ThS. Lê Hoàng Em", employeeCode: "GV002" },
                schedules: [
                    {
                        id: 2,
                        dayOfWeek: 4,
                        shift: { id: 2, name: "Ca 2", startTime: "09:30", endTime: "12:00" },
                        room: { id: 2, name: "LA.201", type: "LAB" },
                    },
                ],
            },
        ],
    },
    {
        course: {
            id: 2,
            code: "SWE302",
            name: "Kiến trúc Backend và Microservices",
            credits: 4,
        },
        classes: [
            {
                id: 103,
                code: "SWE302-01",
                maxStudents: 40,
                currentStudents: 28,
                status: "REGISTRATION",
                lecturer: { id: 3, fullName: "TS. Đỗ Chí Thành", employeeCode: "GV003" },
                schedules: [
                    {
                        id: 3,
                        dayOfWeek: 3,
                        shift: { id: 3, name: "Ca 3", startTime: "13:00", endTime: "15:30" },
                        room: { id: 1, name: "A1.101", type: "THEORY" },
                    },
                    {
                        id: 4,
                        dayOfWeek: 5,
                        shift: { id: 1, name: "Ca 1", startTime: "07:00", endTime: "09:30" },
                        room: { id: 3, name: "LB.102", type: "LAB" },
                    },
                ],
            },
        ],
    },
    {
        course: {
            id: 3,
            code: "CLC101",
            name: "Điện toán Đám mây (Cloud Computing)",
            credits: 3,
        },
        classes: [
            {
                id: 104,
                code: "CLC101-01",
                maxStudents: 35,
                currentStudents: 10,
                status: "REGISTRATION",
                lecturer: null,
                schedules: [
                    {
                        id: 5,
                        dayOfWeek: 6,
                        shift: { id: 2, name: "Ca 2", startTime: "09:30", endTime: "12:00" },
                        room: { id: 4, name: "LA.305", type: "LAB" },
                    },
                ],
            },
        ],
    },
];

export const mockRegisteredClasses: RegisteredClassDTO[] = [
    {
        enrollmentId: 1,
        status: "REGISTERED",
        enrolledAt: new Date().toISOString(),
        classId: 105,
        classCode: "ENG202-03",
        courseId: 4,
        courseName: "Tiếng Anh chuyên ngành CNTT",
        courseCode: "ENG202",
        credits: 3,
        schedules: [
            {
                id: 6,
                dayOfWeek: 7,
                shift: { id: 1, name: "Ca 1", startTime: "07:00", endTime: "09:30" },
                room: { id: 5, name: "B2.204", type: "THEORY" },
            },
        ],
    },
];