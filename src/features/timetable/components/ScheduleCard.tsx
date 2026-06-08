import React from "react";
import clsx from "clsx";
import { type ScheduleItem, type TimetableRole } from "../types";

interface ScheduleCardProps {
    item: ScheduleItem;
    role: TimetableRole;
    onClick?: (item: ScheduleItem) => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ item, role, onClick }) => {
    return (
        <div
            onClick={() => onClick?.(item)}
            className={clsx(
                "h-full w-full p-3 rounded-xl border flex flex-col transition-all duration-200",
                "bg-blue-50/40 border-blue-100 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm",
                onClick ? "cursor-pointer" : "cursor-default"
            )}
        >
            <h4 
                className="text-xs font-bold text-gray-900 line-clamp-2" 
                title={item.courseName}
            >
                {item.courseName}
            </h4>

            <div className="flex flex-col gap-1 mt-3 text-[11px] text-gray-600">
                <div className="truncate" title={item.classCode}>
                    <span className="text-gray-500">Mã lớp: </span>
                    <span className="font-semibold text-gray-800">{item.classCode}</span>
                </div>

                <div className="truncate" title={item.roomName}>
                    <span className="text-gray-500">Phòng: </span>
                    <span className="font-semibold text-gray-800">{item.roomName}</span>
                </div>

                <div className="truncate" title={`${item.startTime} - ${item.endTime}`}>
                    <span className="text-gray-500">Giờ học: </span>
                    <span className="font-semibold text-gray-800">
                        {item.startTime.slice(0, 5)} - {item.endTime.slice(0, 5)}
                    </span>
                </div>

                {role === "STUDENT" && item.lecturerName && (
                    <div className="truncate" title={item.lecturerName}>
                        <span className="text-gray-500">GV: </span>
                        <span className="font-semibold text-gray-800">{item.lecturerName}</span>
                    </div>
                )}
            </div>
        </div>
    );
};