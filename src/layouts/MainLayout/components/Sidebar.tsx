import React from "react";
import { NavLink } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";
import clsx from "clsx";
import { type MenuItem } from "@/config/menu.config";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
    menus: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ menus }) => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <aside className="w-64 bg-blue-900 text-white min-h-screen flex flex-col shadow-xl transition-all duration-300 z-20 relative">
            <div className="h-16 flex items-center gap-3 px-6 bg-blue-950/50 border-b border-blue-800/50">
                <div className="p-1.5 bg-blue-600 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold tracking-wider text-white">
                    LMS.EDU
                </span>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-thin scrollbar-thumb-blue-800 scrollbar-track-transparent">
                {menus.length === 0 ? (
                    <div className="text-center text-sm text-blue-400 mt-10">
                        Không có chức năng nào
                    </div>
                ) : (
                    menus.map((menu, index) => {
                        const IconComponent = menu.icon;
                        return (
                            <NavLink
                                key={index}
                                to={menu.path}
                                className={({ isActive }) =>
                                    clsx(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" // Trạng thái đang chọn
                                            : "text-blue-100 hover:bg-blue-800/50 hover:text-white", // Trạng thái bình thường
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-md" />
                                        )}
                                        <IconComponent
                                            className={clsx(
                                                "h-5 w-5 transition-transform duration-200",
                                                isActive
                                                    ? "scale-110"
                                                    : "group-hover:scale-110 opacity-70 group-hover:opacity-100",
                                            )}
                                        />
                                        <span className="tracking-wide">
                                            {menu.title}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })
                )}
            </nav>

            <div className="p-4 border-t border-blue-800/50 mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-800 hover:bg-blue-700 rounded-xl text-sm font-medium text-white shadow-sm transition-all duration-200 focus:outline-none border border-blue-700/50"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="tracking-wide">Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
};
