import { createContext, useContext, type RefObject } from "react";
import type { Side } from "./types";

interface MenuContextProps {
    isOpen: boolean
    toggleMenu: () => void
    setPosition: (position: Side) => void
    triggerRef: RefObject<HTMLButtonElement>
    dropdownRef: RefObject<HTMLUListElement>
    position: Side
    offset: number
}

export const MenuContext = createContext<MenuContextProps>(null as any);

export const useMenuContext = () => {
    return useContext(MenuContext)
}