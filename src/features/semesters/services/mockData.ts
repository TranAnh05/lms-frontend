import { type SemesterClassResponse } from "../types";

export const MOCK_SEMESTER_CLASSES: SemesterClassResponse[] = [
    {
        id: 1,
        code: "SE102-HK1_2526-L01",
        courseName: "Nhập môn Công nghệ phần mềm",
        lecturerName: "Nguyễn Văn A",
        status: "COMPLETED",
    },
    {
        id: 2,
        code: "CS201-HK1_2526-L02",
        courseName: "Cấu trúc dữ liệu và giải thuật",
        lecturerName: "Trần Thị B",
        status: "COMPLETED", 
    }
];