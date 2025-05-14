import { createContext, useContext, useEffect, useRef, useState } from "react";
import { cn } from "../../../utils";

type Position = "left" | "right" | "top" | "bottom";

interface CustomMenuProps {
    children: React.ReactNode;
    position?: Position;
}

interface CustomMenuContextProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    position: Position;
}

const CustomMenuContext = createContext<CustomMenuContextProps>(null as any);

function CustomMenu({ children, position = "left" }: CustomMenuProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    return (
        <CustomMenuContext.Provider
            value={{
                isOpen,
                setIsOpen,
                position,
            }}
        >
            <div ref={ref} className={cn("relative")}>
                {children}
            </div>
        </CustomMenuContext.Provider>
    );
}

CustomMenu.Trigger = Trigger;
CustomMenu.Dropdown = Dropdown;
CustomMenu.Item = Item;

export default CustomMenu;

function Trigger({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const { isOpen, setIsOpen } = useContext(CustomMenuContext);

    return (
        <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn("w-full", className)}
        >
            {children}
        </button>
    );
}

function Dropdown({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const { isOpen, position } = useContext(CustomMenuContext);

    if (!isOpen) return null;
    return (
        <div className={cn("fixed inset-0 bg-zinc-800/80 z-30")}>
            <ul className="bg-zinc-800 w-40 rounded-md relative z-30">{children}</ul>
        </div>
    );
}

function Item({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <li
            className={cn(
                "px-3 py-2 hover:bg-zinc-700 rounded text-sm cursor-pointer text-left",
                className,
            )}
        >
            {children}
        </li>
    );
}
