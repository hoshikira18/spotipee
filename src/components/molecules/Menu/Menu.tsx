import { type ReactNode, useEffect, useRef, useState } from "react"
import Dropdown from "./Dropdown"
import Item from "./Item"
import Trigger from "./Trigger"
import type { Side } from "./types"
import { MenuContext } from "./context"

interface MenuProps {
    children: ReactNode
    position?: Side
    offset?: number
}

function Menu({ children, position = "bottom", offset = 5 }: MenuProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const dropdownRef = useRef<HTMLUListElement | null>(null)

    const toggleMenu = () => {
        setIsOpen((prev) => !prev)
    }

    const setPosition = (newPosition: Side) => {
        position = newPosition
    }

    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        if (dropdownRef.current && !dropdownRef.current.contains(target) && triggerRef.current && !triggerRef.current.contains(target)) {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("click", handleClickOutside)
        }
        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [isOpen])

    return (
        <MenuContext.Provider value={{
            isOpen,
            toggleMenu,
            triggerRef,
            dropdownRef,
            position,
            setPosition,
            offset,
        }}>
            <div className="menu relative">
                {children}
            </div>
        </MenuContext.Provider>
    )
}

Menu.Dropdown = Dropdown
Menu.Trigger = Trigger
Menu.Item = Item

export default Menu