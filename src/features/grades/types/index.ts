export type SubjectGradeStatus = 'PASS' | 'FAIL' | 'PENDING' | (string & {});

export interface SubjectGradeDto {
    readonly classId: number;
    readonly classCode: string;
    readonly courseCode: string;
    readonly courseName: string;
    readonly credits: number;
    readonly regularScore1: number | null;
    readonly regularScore2: number | null;
    readonly midtermScore: number | null;
    readonly finalScore: number | null;
    readonly totalScore: number | null;     
    readonly grade4: number | null;         
    readonly letterGrade: string | null;     
    readonly status: SubjectGradeStatus;
}

export interface SemesterTranscriptDto {
    readonly semesterId: number;
    readonly semesterCode: string;
    readonly academicYear: string;
    readonly semesterNumber: number;
    readonly gpaThisSemester: number;
    readonly gpaThisSemester4: number;
    readonly creditsThisSemester: number;
    readonly creditsEarnedThisSemester: number;
    readonly subjects: readonly SubjectGradeDto[];
}

export interface TranscriptResponseDto {
    readonly gpaOverall: number;
    readonly gpaOverall4: number;
    readonly totalCreditsEarned: number;
    readonly totalSubjects: number;
    readonly semesters: readonly SemesterTranscriptDto[];
}