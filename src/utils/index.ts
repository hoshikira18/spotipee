import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: string[]) {
    return twMerge(clsx(inputs));
}

type Image = {
    url: string;
    height: number;
    width: number;
};

export const getImage = (size: number, images?: Image[]) => {
    return images?.find((img) => img.height === size)?.url;
};
