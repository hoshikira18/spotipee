import { Burger, Menu } from "@mantine/core";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface MenuBurgerProps {
    children: React.ReactNode;
    width?: number;
    className?: string;
}

function MenuBurger({ children, width = 200, className = "" }: MenuBurgerProps) {
    const [opened, setOpened] = useState(false);
    return (
        <div className={twMerge(className)}>
            <Menu opened={opened} onChange={setOpened} width={width}>
                <Menu.Target>
                    <Burger opened={opened} size={"sm"} />
                </Menu.Target>
                <Menu.Dropdown mt={10}>{children}</Menu.Dropdown>
            </Menu>
        </div>
    );
}

export default MenuBurger;
