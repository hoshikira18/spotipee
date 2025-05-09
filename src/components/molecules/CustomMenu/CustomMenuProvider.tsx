import { useEffect, useReducer, useState, type ReactNode } from "react";
import { CustomMenuContext, type MenuSettings } from "./context";
import { customMenuReducer } from "./reducer";
import { randomId } from "../../../utils";
import CustomMenu from "./components/CustomMenu";

function CustomMenuProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(customMenuReducer, {
        menus: [],
    });

    const [rect, setRect] = useState({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    });

    console.log(state);

    const openMenu = (id: string, settings: MenuSettings) => {
        dispatch({
            type: "OPEN",
            payload: {
                ...settings,
                id,
            },
        });
    };

    const changeMenuPosition = (id: string, detailPosition: { x: number; y: number }) => {
        dispatch({
            type: "CHANGE_POSITION",
            payload: {
                id,
                detailPosition,
            },
        });
    };

    const closeMenu = (id: string) => {
        dispatch({
            type: "CLOSE",
            payload: {
                id,
            },
        });
    };

    open = openMenu;
    changePosition = changeMenuPosition;
    close = closeMenu;

    // useEffect(() => {
    //     setRect({
    //         top: Math.max(
    //             ...state.menus.map((menu) => menu.detailPosition.y),
    //             ...state.menus.map((menu) => menu.detailPosition.y + menu.height),
    //         ),
    //         left: Math.min(
    //             ...state.menus.map((menu) => menu.detailPosition.x),
    //             ...state.menus.map((menu) => menu.detailPosition.x + menu.width),
    //         ),
    //         right: Math.max(
    //             ...state.menus.map((menu) => menu.detailPosition.x),
    //             ...state.menus.map((menu) => menu.detailPosition.x + menu.width),
    //         ),
    //         bottom: Math.max(
    //             ...state.menus.map((menu) => menu.detailPosition.y),
    //             ...state.menus.map((menu) => menu.detailPosition.y + menu.height),
    //         ),
    //     });
    // }, [state.menus]);

    // console.log(rect);

    return (
        <CustomMenuContext.Provider
            value={{
                menus: state.menus,
            }}
        >
            <div
                style={{
                    position: "fixed",
                }}
            >
                {state.menus.map((menu) => (
                    <CustomMenu key={menu.id} menu={menu} />
                ))}
            </div>
            {children}
        </CustomMenuContext.Provider>
    );
}

let open: ((id: string, settings: MenuSettings) => void) | null = null;
let close: ((id: string) => void) | null = null;
let changePosition: ((id: string, position: { x: number; y: number }) => void) | null = null;

export const customMenus = {
    openMenu: (settings: MenuSettings) => {
        const menuId = settings.id || randomId("custom-menu-");
        if (open) {
            open(menuId, settings);
        }
        return menuId;
    },
    changePosition: (id: string, detailPostion: { x: number; y: number }) => {
        if (changePosition) {
            changePosition(id, detailPostion);
        }
    },
    closeMenu: (id: string) => {
        if (close) {
            close(id);
        }
    },
};

export default CustomMenuProvider;
