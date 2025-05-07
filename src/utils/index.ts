import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Image } from "../types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getImage = (size: number, images?: Image[]) => {
    return images?.find((img) => img.height === size)?.url;
};

export const convertMillisecondsToMinutes = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const convertMillisecondsToHours = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    return `${hours}h:${minutes < 10 ? "0" : ""}${minutes}m`;
};

export const calAddedTime = (added_at: string) => {
    const date = new Date(added_at);
    const currentDate = new Date();
    const diff = currentDate.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diff / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);
    if (diffInYears > 0) return `${diffInYears} years ago`;
    if (diffInMonths > 0) return `${diffInMonths} months ago`;
    if (diffInDays > 0) return `${diffInDays} days ago`;
    if (diffInHours > 0) return `${diffInHours} hours ago`;
    if (diffInMinutes > 0) return `${diffInMinutes} minutes ago`;
    return `${diffInSeconds} seconds ago`;
};

export const calDurationTime = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes} min, ${seconds < 10 ? "0" : ""}${seconds} sec`;
};

export const getUSDate = (date: string) => {
    const d = new Date(date);

    const formattedDate = d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return formattedDate;
};

export function countBins(arr: number[], step: number, maxValue: number, minValue: number) {
    if (!arr || arr.length === 0) return [];
    const binCount = Math.ceil((maxValue - minValue) / step);
    const result = new Array(binCount).fill(0);

    arr.forEach((value) => {
        if (value >= minValue && value <= maxValue) {
            const index = Math.min(Math.floor((value - minValue) / step), binCount - 1);
            result[index]++;
        }
    });

    return result;
}

export function randomId(prefix = "rand-"): string {
    return `${prefix}${Math.random().toString(36).slice(2, 11)}`;
}
