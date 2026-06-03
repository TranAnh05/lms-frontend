import {
    Users,
    BookOpen,
    Bookmark,
    Layers,
    UserCircle,
    Calendar,
    Clapperboard,
    ClipboardCheck,
    FolderKanban,
    FileText,
    ShieldAlert,
    CheckSquare,
    type LucideIcon,
} from "lucide-react";

export interface MenuItem {
    title: string;
    path: string;
    icon: LucideIcon;
}

export const ROLES = {
    ADMIN: "ADMIN",
    PRINCIPAL: "PRINCIPAL",
    HR: "HR",
    TRAINING_DEPT: "TRAINING_DEPT",
    HEAD_OF_DEPT: "HEAD_OF_DEPT",
    INSTRUCTOR: "INSTRUCTOR",
    STUDENT: "STUDENT",
} as const;

// DANH SÁCH TẤT CẢ MENU TRONG HỆ THỐNG
const ALL_MENUS = {
    USER_MGMT: {
        title: "Quản lý người dùng",
        path: "/dashboard/users",
        icon: Users,
    },
    PERMISSION_MGMT: {
        title: "Phân quyền",
        path: "/dashboard/permissions",
        icon: ShieldAlert,
    },
    MAJOR_MGMT: {
        title: "Quản lý ngành học",
        path: "/dashboard/majors",
        icon: BookOpen,
    },
    SUBJECT_MGMT: {
        title: "Quản lý môn học",
        path: "/dashboard/subjects",
        icon: Bookmark,
    },
    COURSE_MGMT: {
        title: "Quản lý học phần",
        path: "/dashboard/courses",
        icon: Layers,
    },
    COURSE_APPROVAL: {
        title: "Duyệt môn học",
        path: "/dashboard/course-approvals",
        icon: CheckSquare,
    },
    COURSE_APPROVAL_MGMT: {
        title: "Đề xuất môn học",
        path: "/dashboard/course-suggest",
        icon: CheckSquare,
    },
    // STUDENT_MGMT:    { title: 'Quản lý sinh viên', path: '/dashboard/students', icon: GraduationCap },
    // TEACHER_MGMT:    { title: 'Quản lý giảng viên', path: '/dashboard/teachers', icon: Users },
    TIMETABLE: {
        title: "Thời khóa biểu",
        path: "/dashboard/timetable",
        icon: Calendar,
    },
    CLASS_MGMT: {
        title: "Quản lý lớp học",
        path: "/dashboard/classes",
        icon: FolderKanban,
    },
    LESSON_MGMT: {
        title: "Quản lý bài học",
        path: "/dashboard/lessons",
        icon: Clapperboard,
    },
    EXAM_MGMT: {
        title: "Quản lý bài kiểm tra",
        path: "/dashboard/exams",
        icon: ClipboardCheck,
    },

    STUDENT_CLASSES: {
        title: "Danh sách lớp học",
        path: "/dashboard/my-classes",
        icon: FolderKanban,
    },
    REGISTRATION: {
        title: "Học phần mở đăng ký",
        path: "/dashboard/registration",
        icon: Layers,
    },
    RESULTS: {
        title: "Kết quả học tập",
        path: "/dashboard/results",
        icon: FileText,
    },

    PROFILE: {
        title: "Hồ sơ cá nhân",
        path: "/dashboard/profile",
        icon: UserCircle,
    },
} satisfies Record<string, MenuItem>;

// ÁNH XẠ MENU THEO VAI TRÒ
export const ROLE_MENU_MAP: Record<string, MenuItem[]> = {
    [ROLES.ADMIN]: [
        ALL_MENUS.USER_MGMT,
        ALL_MENUS.PERMISSION_MGMT,
        ALL_MENUS.MAJOR_MGMT,
        ALL_MENUS.SUBJECT_MGMT,
        ALL_MENUS.COURSE_MGMT,
        ALL_MENUS.PROFILE,
    ],

    [ROLES.PRINCIPAL]: [
        ALL_MENUS.USER_MGMT,
        ALL_MENUS.PERMISSION_MGMT,
        ALL_MENUS.MAJOR_MGMT,
        ALL_MENUS.SUBJECT_MGMT,
        ALL_MENUS.COURSE_APPROVAL,
        ALL_MENUS.COURSE_MGMT,
        ALL_MENUS.PROFILE,
    ],

    [ROLES.HR]: [ALL_MENUS.USER_MGMT, ALL_MENUS.PROFILE],

    [ROLES.TRAINING_DEPT]: [
        ALL_MENUS.USER_MGMT,
        ALL_MENUS.MAJOR_MGMT,
        ALL_MENUS.SUBJECT_MGMT,
        ALL_MENUS.COURSE_APPROVAL_MGMT,
        ALL_MENUS.COURSE_MGMT,
        // ALL_MENUS.STUDENT_MGMT,
        // ALL_MENUS.TEACHER_MGMT,
        ALL_MENUS.PROFILE,
    ],

    [ROLES.HEAD_OF_DEPT]: [
        ALL_MENUS.SUBJECT_MGMT,
        ALL_MENUS.COURSE_MGMT,
        // ALL_MENUS.STUDENT_MGMT,
        // ALL_MENUS.TEACHER_MGMT,
        ALL_MENUS.PROFILE,
    ],

    [ROLES.INSTRUCTOR]: [
        ALL_MENUS.TIMETABLE,
        ALL_MENUS.CLASS_MGMT,
        ALL_MENUS.LESSON_MGMT,
        ALL_MENUS.EXAM_MGMT,
        ALL_MENUS.PROFILE,
    ],

    [ROLES.STUDENT]: [
        ALL_MENUS.TIMETABLE,
        ALL_MENUS.STUDENT_CLASSES,
        ALL_MENUS.REGISTRATION,
        ALL_MENUS.RESULTS,
        ALL_MENUS.PROFILE,
    ],
};

// ĐƯỜNG DẪN ĐIỀU HƯỚNG MẶC ĐỊNH
export const ROLE_DEFAULT_PATHS: Record<string, string> = {
    [ROLES.ADMIN]: "/dashboard/users",
    [ROLES.PRINCIPAL]: "/dashboard/users",
    [ROLES.HR]: "/dashboard/users",
    [ROLES.TRAINING_DEPT]: "/dashboard/majors",
    [ROLES.HEAD_OF_DEPT]: "/dashboard/subjects",
    [ROLES.INSTRUCTOR]: "/dashboard/timetable",
    [ROLES.STUDENT]: "/dashboard/timetable",
};

// Lấy danh sách menu duy nhất khi người dùng sở hữu nhiều vai trò cùng lúc
export const getMenusByRoles = (roles: string[] | undefined): MenuItem[] => {
    if (!roles || roles.length === 0) return [];

    const seenPaths = new Set<string>();
    const combinedMenus: MenuItem[] = [];

    const normalizedRoles = roles.map((role) => role.toUpperCase());

    for (const role of normalizedRoles) {
        const roleMenus = ROLE_MENU_MAP[role];
        if (!roleMenus) continue;

        for (const menu of roleMenus) {
            if (!seenPaths.has(menu.path)) {
                seenPaths.add(menu.path);
                combinedMenus.push(menu);
            }
        }
    }

    return combinedMenus;
};

// Lấy đường dẫn mặc định dựa vào vai trò ưu tiên đầu tiên của mảng
export const getDefaultPathByRole = (roles: string[] | undefined): string => {
    if (!roles || roles.length === 0) return "/login";

    const primaryRole = roles[0].toUpperCase();
    return ROLE_DEFAULT_PATHS[primaryRole] || "/dashboard/profile";
};
