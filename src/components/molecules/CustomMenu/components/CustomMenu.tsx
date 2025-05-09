import Trigger from "./Trigger";
import Dropdown from "./Dropdown";
import Item from "./Item";
import type { MenuSettings } from "../context";
import { useEffect, useRef, useState } from "react";
import { customMenus } from "../CustomMenuProvider";

export interface CustomMenuProps {
    menu: MenuSettings;
}

function CustomMenu({ menu }: CustomMenuProps) {
    const [mounted, setMounted] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        console.log(mounted);
        if (ref.current && !ref.current.contains(event.target as Node)) {
            if (mounted) {
                // Close the menu if clicked outside
                if (menu?.id) customMenus.closeMenu(menu?.id);
            }
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [mounted]);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div ref={ref}>
            <Dropdown menu={menu} />
        </div>
    );
}

CustomMenu.Trigger = Trigger;
CustomMenu.Dropdown = Dropdown;
CustomMenu.Item = Item;

export default CustomMenu;
