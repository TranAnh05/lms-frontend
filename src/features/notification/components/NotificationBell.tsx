/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from "react";
import { Bell, Inbox } from "lucide-react";
import { notificationService, type NotificationResponse } from "../services/notification.service";

export const NotificationBell: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hasNew, setHasNew] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getMyNotifications();
            const sortedData = data.sort((a, b) => b.id - a.id);
            setNotifications(sortedData);

            const savedCount = localStorage.getItem("lms_notification_count");
            const previousCount = savedCount ? parseInt(savedCount, 10) : 0;

            if (sortedData.length > previousCount) {
                setHasNew(true);
            }
        } catch (error) {
            console.error("Lỗi khi tải thông báo:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(() => {
            fetchNotifications();
        }, 120000); // 2 phút

        return () => clearInterval(interval);
    }, []);

    const handleToggleBell = () => {
        setIsOpen(!isOpen);
        if (!isOpen && hasNew) {
            localStorage.setItem("lms_notification_count", notifications.length.toString());
            setHasNew(false);
        }
    };

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

    return (
        <div className="relative flex items-center justify-center mr-4" ref={menuRef}>
            <button
                onClick={handleToggleBell}
                className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
            >
                <Bell className="w-5 h-5" />
                {hasNew && (
                    <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-800">Thông báo</h3>
                        <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            {notifications.length} tin
                        </span>
                    </div>

                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                <Inbox className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-sm">Bạn chưa có thông báo nào</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className="p-4 hover:bg-blue-50/30 transition-colors cursor-default"
                                    >
                                        <h4 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
                                            {notif.title}
                                        </h4>
                                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-2">
                                            {notif.message}
                                        </p>
                                        <span className="text-[10px] font-medium text-gray-400">
                                            {formatTime(notif.createdAt)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};