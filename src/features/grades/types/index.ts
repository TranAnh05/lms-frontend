export type AcademicStatus = 'NORMAL' | 'WARNING' | 'SUSPENDED';
export type SubjectGradeStatus = 'PASS' | 'FAIL' | 'PENDING';

export interface SubjectGrade {
    courseCode: string;
    courseName: string;
    credits: number;
    regularScore1: number | null;
    regularScore2: number | null;
    midtermScore: number | null;
    finalScore: number | null;
    totalScore10: number | null; 
    totalScore4: number | null;  
    letterGrade: string;        
    status: SubjectGradeStatus;
}

export interface SemesterSummary {
    semesterId: number;
    semesterCode: string;
    academicYear: string;
    semesterNumber: number;
    totalRegisteredCredits: number;
    totalEarnedCredits: number;
    semesterGpa10: number;
    semesterGpa4: number;
    cumulativeGpa4: number;
    academicStatus: AcademicStatus;
}

export interface SemesterTranscript {
    summary: SemesterSummary;
    subjects: SubjectGrade[];
}

export interface AcademicOverview {
    totalEarnedCredits: number;
    cumulativeGpa10: number;
    cumulativeGpa4: number;
    currentAcademicStatus: AcademicStatus;
}

export interface StudentAcademicTranscript {
    overview: AcademicOverview;
    semesters: SemesterTranscript[];
}