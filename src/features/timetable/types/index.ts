export type TimetableRole = "STUDENT" | "INSTRUCTOR";

export interface ShiftBasic {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
}

export interface ScheduleItem {
    id: number;           // class_schedules.id
    classId: number;      // classes.id
    courseName: string;   // courses.name
    classCode: string;    // classes.code
    roomName: string;     // rooms.name
    dayOfWeek: number;    // 2 (Thứ 2) -> 8 (Chủ Nhật)
    shiftId: number;      // 1 -> 4
    
    // Dành cho Sinh viên
    lecturerName?: string; 
    
    // Dành cho Giảng viên
    currentStudents?: number; 
    maxStudents?: number;     
}

export interface WeeklyScheduleParams {
    startDate: string;
    endDate: string;
}