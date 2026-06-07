import { type ScheduleItem, type ShiftBasic } from "../types";

export const SHIFTS: ShiftBasic[] = [
    { id: 1, name: "Ca 1 (Sáng)", startTime: "07:00", endTime: "09:15" },
    { id: 2, name: "Ca 2 (Sáng)", startTime: "09:30", endTime: "11:45" },
    { id: 3, name: "Ca 3 (Chiều)", startTime: "13:00", endTime: "15:15" },
    { id: 4, name: "Ca 4 (Chiều)", startTime: "15:30", endTime: "17:45" },
];

export const mockScheduleItems: ScheduleItem[] = [
    {
        id: 1,
        classId: 101,
        courseName: "Phát triển Web Frontend Nâng cao",
        classCode: "SWE301-01",
        roomName: "A1.101",
        dayOfWeek: 2, 
        shiftId: 1, 
        lecturerName: "TS. Nguyễn Văn Cường",
        currentStudents: 40,
        maxStudents: 40,
    },
    {
        id: 2,
        classId: 102,
        courseName: "Kiến trúc Backend và Microservices",
        classCode: "SWE302-01",
        roomName: "LB.102",
        dayOfWeek: 3, 
        shiftId: 3, 
        lecturerName: "TS. Đỗ Chí Thành",
        currentStudents: 35,
        maxStudents: 40,
    },
    {
        id: 3,
        classId: 103,
        courseName: "Quản trị cơ sở dữ liệu",
        classCode: "SWE303-02",
        roomName: "A2.205",
        dayOfWeek: 5, 
        shiftId: 2, 
        lecturerName: "ThS. Lê Hoàng Em",
        currentStudents: 38,
        maxStudents: 40,
    },
    {
        id: 4,
        classId: 104,
        courseName: "Điện toán Đám mây",
        classCode: "CLC101-01",
        roomName: "LA.305",
        dayOfWeek: 6, 
        shiftId: 4, 
        lecturerName: "TS. Trần Lê",
        currentStudents: 20,
        maxStudents: 35,
    }
];