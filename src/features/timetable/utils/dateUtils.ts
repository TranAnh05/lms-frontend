/**
 * Lay ngay dau tuan (Thu 2) cua mot ngay bat ky, thiet lap gio ve 00:00:00
 */
export const getStartOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    // Chuyen doi Chu Nhat (0) thanh luong thu tu cua Thu 2 dau tuan
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

/**
 * Cong them so tuan vao ngay chi dinh
 */
export const addWeeks = (date: Date, weeks: number): Date => {
    const d = new Date(date);
    d.setDate(d.getDate() + weeks * 7);
    return d;
};

/**
 * Dinh dang ngay thang dang chuoi rut gon DD/MM
 */
export const formatShortDate = (date: Date): string => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${d}/${m}`;
};

/**
 * Tra ve chuoi bieu dien pham vi tu dau tuan den cuoi tuan (Tuan DD/MM - DD/MM)
 */
export const getWeekRangeString = (date: Date): string => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `Tuần ${formatShortDate(start)} - ${formatShortDate(end)}`;
};

/**
 * Tao mang chua tat ca 7 ngay trong tuan tinh tu Thu 2
 */
export const getDatesOfWeek = (baseDate: Date): Date[] => {
    const start = getStartOfWeek(baseDate);
    const startDay = start.getDate();

    // Gộp tham so map vao Array.from de khoi tao va tra ve mang luon trong 1 lan duyet duy nhat
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(startDay + i);
        return d;
    });
};
