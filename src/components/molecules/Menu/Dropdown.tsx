import { useEffect, useState, type ReactNode } from "react"
import { useMenuContext } from "./context"
import { calculateCoordsFromPlacement } from "./helper";

function Dropdown({ children }: { children: ReactNode }) {
    const { triggerRef, dropdownRef, isOpen, position, offset } = useMenuContext()
    let p = position
    const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

    useEffect(() => {
        updatePosition()
    }, [isOpen])

    const updatePosition = () => {
        if (!isOpen) return
        const reference = triggerRef.current?.getBoundingClientRect()
        const floating = dropdownRef.current?.getBoundingClientRect()
        if (!reference || !floating) return

        if (floating.y < offset) {
            p = "bottom"
        }
        if (floating.x < offset) {
            p = "right"
        }

        if (floating.x + floating.width > window.innerWidth - offset) {
            p = "left"
        }
        if (floating.y + floating.height > window.innerHeight - offset) {
            p = "top"
        }

        const { x, y } = calculateCoordsFromPlacement({ reference, floating }, p, offset)
        setCoords({ x, y })
    }

    useEffect(() => {
        let currentEl = dropdownRef.current?.parentElement;
        const scrollableParents: HTMLElement[] = [];

        // Walk up to find all scrollable ancestors
        while (currentEl) {
            const overflowY = window.getComputedStyle(currentEl).overflowY;
            if (overflowY === "auto" || overflowY === "scroll") {
                scrollableParents.push(currentEl);
            }
            currentEl = currentEl.parentElement;
        }
        window.addEventListener("resize", updatePosition, true);
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            scrollableParents.forEach((parent) => {
                parent.removeEventListener("scroll", updatePosition, true);
            });
            window.removeEventListener("resize", updatePosition, true);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [triggerRef, dropdownRef, isOpen]);

    if (!isOpen) return null
    return (
        <ul
            key={JSON.stringify(coords)}
            style={{
                width: "max-content",
                position: "absolute",
                top: coords.y,
                left: coords.x,
            }}
            ref={dropdownRef}
            className="p-0.5 bg-black/80 backdrop-blur-xs border border-gray-800 rounded-md shadow z-40"
        >
            {children}
        </ul>
    )
}

export default Dropdown