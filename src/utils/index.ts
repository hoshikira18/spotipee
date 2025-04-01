import type { User } from "../types";

export const getImage = (size: number, user: User) => {
    return user?.images.find((img) => img.height === size)?.url;
};
