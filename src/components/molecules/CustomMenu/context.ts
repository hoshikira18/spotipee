import { createContext } from "react";

export type MenuSettings = {
    id: string | null;
    opened: boolean;
    position: "left" | "right" | "top" | "bottom";
    detailPosition: {
        x: number;
        y: number;
    };
    children?: React.ReactNode;
};

export type MenuState = {
    id: string;
} & MenuSettings;

export type MenusState = {
    menus: MenuState[];
};

export type CustomMenuContextType = {
    menus: MenuSettings[];
};

export const CustomMenuContext = createContext<CustomMenuContextType | null>(null);
