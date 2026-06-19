import React, { useState, useEffect, useRef } from "react";
import { Bell, Inbox } from "lucide-react";
import {
    notificationService,
    type NotificationResponse,
} from "../services/notification.service";

const STORAGE_KEY = "lms_notification_count";

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const NotificationBell: React.FC = React.memo(() => {
    const [notifications, setNotifications] = useState<NotificationResponse[]>(
        [],
    );
    const [isOpen, setIsOpen] = useState(false);
    const [hasNew, setHasNew] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        let isMounted = true;

        const fetchNotifications = async () => {
            try {
                const data = await notificationService.getMyNotifications();
                if (!isMounted) return;
                const sortedData = [...data].sort((a, b) => b.id - a.id);
                setNotifications(sortedData);

                const savedCount = localStorage.getItem(STORAGE_KEY);
                const previousCount = savedCount ? parseInt(savedCount, 10) : 0;

                if (sortedData.length > previousCount) {
                    setHasNew(true);
                }
            } catch (error) {
                console.error("Loi khi tai thong bao:", error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 120000); // 2 phut

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    const handleToggleBell = () => {
        if (!isOpen && hasNew) {
            localStorage.setItem(STORAGE_KEY, notifications.length.toString());
            setHasNew(false);
        }
        setIsOpen((prev) => !prev);
    };

    return (
        <div
            className="relative flex items-center justify-center mr-4"
            ref={menuRef}
        >
            <button
                type="button"
                onClick={handleToggleBell}
                className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                aria-label="Thong bao"
            >
                <Bell className="w-5 h-5" />
                {hasNew && (
                    <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-[400px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-800">
                            Thông báo
                        </h3>
                        <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            {notifications.length} tin
                        </span>
                    </div>

                    <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                <Inbox className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-sm">
                                    Bạn chưa có thông báo nào
                                </p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-50 m-0 p-0 list-none">
                                {notifications.map((notif) => (
                                    <li
                                        key={notif.id}
                                        className="p-4 hover:bg-blue-50/30 transition-colors cursor-default"
                                    >
                                        <h4 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
                                            {notif.title}
                                        </h4>
                                        <p className="text-xs text-gray-600 line-clamp-5 leading-relaxed mb-2">
                                            {notif.message}
                                        </p>
                                        <span className="text-[10px] font-medium text-gray-400">
                                            {formatTime(notif.createdAt)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

NotificationBell.displayName = "NotificationBell";
