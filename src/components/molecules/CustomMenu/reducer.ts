import type { MenusState } from "./context";

interface OpenAction {
    type: "OPEN";
    payload: {
        id: string | null;
        opened: boolean;
        position: "left" | "right" | "top" | "bottom";
        detailPosition: {
            x: number;
            y: number;
        };
    };
}

interface CloseAction {
    type: "CLOSE";
    payload: {
        id: string;
    };
}

interface ChangePositionAction {
    type: "CHANGE_POSITION";
    payload: {
        id: string;
        detailPosition: {
            x: number;
            y: number;
        };
    };
}

export const customMenuReducer = (
    state: MenusState,
    action: OpenAction | CloseAction | ChangePositionAction,
) => {
    switch (action.type) {
        case "OPEN": {
            const isMenuExist = state.menus.some((menu) => menu.id === action.payload.id);
            return {
                ...state,
                menus: !isMenuExist
                    ? [
                          ...state.menus,
                          {
                              ...action.payload,
                              id: action.payload.id,
                          },
                      ]
                    : state.menus.map((menu) =>
                          menu.id === action.payload.id ? { ...menu, opened: true } : menu,
                      ),
            };
        }
        case "CLOSE":
            return {
                ...state,
                menus: state.menus.filter((menu) => menu.id !== action.payload.id),
            };
        case "CHANGE_POSITION":
            return {
                ...state,
                menus: state.menus.map((menu: any) =>
                    menu.id === action.payload.id
                        ? { ...menu, detailPosition: action.payload.detailPosition }
                        : menu,
                ),
            };
        default:
            return state;
    }
};
