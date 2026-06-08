export type TimetableRole = "STUDENT" | "INSTRUCTOR";

export interface ShiftBasic {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
}

export interface ScheduleItem {
    courseName: string;
    classCode: string;
    roomName: string;
    dayOfWeek: number;    
    shiftName: string;    
    startTime: string;     
    endTime: string;       
    lecturerName?: string | null; 
    totalWeeks: number;
    startDate: string;
}

export const SHIFTS: ShiftBasic[] = [
    { id: 1, name: "Ca 1", startTime: "07:00", endTime: "09:15" },
    { id: 2, name: "Ca 2", startTime: "09:30", endTime: "11:45" },
    { id: 3, name: "Ca 3", startTime: "13:00", endTime: "15:15" },
    { id: 4, name: "Ca 4", startTime: "15:30", endTime: "17:45" },
];