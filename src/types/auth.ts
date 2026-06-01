export type PermissionCode =
  // USER_MGT
  | 'USER_VIEW' | 'USER_CREATE' | 'USER_ASSIGN_ROLE' | 'USER_UPDATE' | 'USER_LOCK' | 'USER_UNLOCK'
  // MAJOR_MGT
  | 'MAJOR_VIEW' | 'MAJOR_CREATE' | 'MAJOR_UPDATE' | 'MAJOR_DELETE'
  // COURSE_MGT
  | 'COURSE_VIEW' | 'COURSE_PROPOSE' | 'COURSE_APPROVE_LIST' | 'COURSE_APPROVE' | 'COURSE_UPDATE' | 'COURSE_DELETE'
  // CLASS_MGT
  | 'CLASS_ASSIGN_TEACHER' | 'CLASS_VIEW' | 'CLASS_PROPOSE' | 'CLASS_PROPOSE_VIEW' | 'CLASS_APPROVE' | 'CLASS_REJECT' | 'CLASS_CREATE' | 'CLASS_UPDATE' | 'CLASS_OPEN_REG' | 'CLASS_CLOSE_REG'
  // PROFILE_MGT
  | 'PROFILE_VIEW' | 'PROFILE_UPDATE'
  // PUBLIC_VIEW
  | 'COURSE_CLASS_VIEW'
  // ENROLLMENT_MGT
  | 'ENROLLMENT_REGISTER' | 'ENROLLMENT_VIEW' | 'ENROLLMENT_CANCEL'
  // SCHEDULE_MGT
  | 'SCHEDULE_VIEW'
  // LESSON_MGT
  | 'LESSON_VIEW' | 'LESSON_CREATE' | 'LESSON_UPDATE' | 'LESSON_DELETE'
  // EXAM_MGT
  | 'EXAM_VIEW' | 'EXAM_CREATE' | 'EXAM_UPDATE' | 'EXAM_OPEN' | 'EXAM_CLOSE'
  // EXAM_TAKE
  | 'EXAM_TAKE_VIEW' | 'EXAM_TAKE_SUBMIT'
  // GRADE_VIEW & GRADE_MGT
  | 'GRADE_VIEW_SUBJECT' | 'GRADE_VIEW_FINAL' | 'GRADE_LOCK'
  // SEMESTER_MGT
  | 'SEMESTER_VIEW' | 'SEMESTER_CREATE' | 'SEMESTER_UPDATE' | 'SEMESTER_DELETE' | 'SEMESTER_FINISH';

export interface Role {
  code: string;
  name: string;
}

export interface UserProfile {
  id: string; 
  email: string;
  fullName: string;
  avatar: string;
  role: Role; 
  permissions: PermissionCode[]; 
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    tokens: AuthTokens;
    user: UserProfile;
  };
}