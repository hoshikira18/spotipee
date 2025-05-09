import type { MenuSettings } from "../context";

export interface DropdownProps {
    menu: MenuSettings;
}

function Dropdown({ menu }: DropdownProps) {
    if (!menu?.opened) {
        return;
    }
    return (
        <ul
            className="fixed p-0.5 bg-zinc-800 z-50 border border-zinc-700 shadow rounded-md"
            style={{
                left: menu.detailPosition.x + 20,
                top: menu.detailPosition.y + 20,
            }}
        >
            {menu?.children}
        </ul>
    );
}

export default Dropdown;
