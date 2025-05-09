import { useEffect, useRef, useState } from "react";
import { customMenus } from "../CustomMenuProvider";

interface TriggerProps {
    children: React.ReactNode;
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    position?: "left" | "right" | "top" | "bottom";
    menuItems?: React.ReactNode;
}

function Trigger({
    children,
    position = "left",
    top = 0,
    bottom = 0,
    left = 0,
    right = 0,
    menuItems,
}: TriggerProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [menuId, setMenuId] = useState<string | null>(null);

    const getPostion = () => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            switch (position) {
                case "left":
                    return {
                        x: rect.left + window.scrollX - left,
                        y: rect.top + window.scrollY + top,
                    };
                case "right":
                    return {
                        x: rect.right + window.scrollX + right,
                        y: rect.top + window.scrollY + top,
                    };
                case "top":
                    return {
                        x: rect.left + window.scrollX + left,
                        y: rect.top + window.scrollY - top,
                    };
                case "bottom":
                    return {
                        x: rect.left + window.scrollX + left,
                        y: rect.bottom + window.scrollY + bottom,
                    };
                default:
                    return {
                        x: rect.left + window.scrollX,
                        y: rect.top + window.scrollY,
                    };
            }
        }
    };

    const updatePosition = () => {
        const pos = getPostion();
        console.log(menuId);
        if (menuId)
            customMenus.changePosition(menuId, {
                x: pos ? pos.x : 0,
                y: pos ? pos.y : 0,
            });
    };

    useEffect(() => {
        let currentEl = ref.current?.parentElement;
        const scrollableParents: HTMLElement[] = [];

        // Walk up to find all scrollable ancestors
        while (currentEl) {
            const overflowY = window.getComputedStyle(currentEl).overflowY;
            if (overflowY === "auto" || overflowY === "scroll") {
                scrollableParents.push(currentEl);
            }
            currentEl = currentEl.parentElement;
        }

        // Attach scroll listeners
        scrollableParents.forEach((parent) => {
            parent.addEventListener("scroll", updatePosition, true);
        });

        return () => {
            scrollableParents.forEach((parent) => {
                parent.removeEventListener("scroll", updatePosition, true);
            });
        };
    }, [menuId]);

    const handleOpenMenu = () => {
        const pos = getPostion();

        const id = customMenus.openMenu({
            id: menuId,
            opened: true,
            position: "top",
            detailPosition: {
                x: pos ? pos.x : 0,
                y: pos ? pos.y : 0,
            },
            children: menuItems,
        });
        setMenuId(id);
    };

    return (
        <button ref={ref} type="button" onClick={handleOpenMenu}>
            {children}
        </button>
    );
}

export default Trigger;
