import dayjs from "dayjs";

export const formatDateToMin = (date: string | null): string => {
    if (!date) {
        return "-";
    }
    const result = dayjs(date).format("YYYY-MM-DD HH:mm");
    return result !== "Invalid Date" ? result : "-";
};