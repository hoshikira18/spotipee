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
