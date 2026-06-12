export type SubjectGradeStatus = 'PASS' | 'FAIL' | 'PENDING' | string;

export interface SubjectGradeDto {
    classId: number;
    classCode: string;
    courseCode: string;
    courseName: string;
    credits: number;
    regularScore1: number | null;
    regularScore2: number | null;
    midtermScore: number | null;
    finalScore: number | null;
    totalScore: number | null;     
    grade4: number | null;         
    letterGrade: string | null;     
    status: SubjectGradeStatus;
}

export interface SemesterTranscriptDto {
    semesterId: number;
    semesterCode: string;
    academicYear: string;
    semesterNumber: number;
    gpaThisSemester: number;
    gpaThisSemester4: number;
    creditsThisSemester: number;
    creditsEarnedThisSemester: number;
    subjects: SubjectGradeDto[];
}

export interface TranscriptResponseDto {
    gpaOverall: number;
    gpaOverall4: number;
    totalCreditsEarned: number;
    totalSubjects: number;
    semesters: SemesterTranscriptDto[];
}