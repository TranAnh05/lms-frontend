export const getStartOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const addWeeks = (date: Date, weeks: number): Date => {
    const d = new Date(date);
    d.setDate(d.getDate() + weeks * 7);
    return d;
};

export const formatShortDate = (date: Date): string => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${d}/${m}`;
};

export const getWeekRangeString = (date: Date): string => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `Tuần ${formatShortDate(start)} - ${formatShortDate(end)}`;
};

export const getDatesOfWeek = (baseDate: Date): Date[] => {
    const start = getStartOfWeek(baseDate);
    return Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
    });
};