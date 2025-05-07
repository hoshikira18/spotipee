import type { ModalsState, ModalState } from "./context";

interface OpenAction {
    type: "OPEN";
    modal: ModalState;
}

interface CloseAllAction {
    type: "CLOSE_ALL";
}

interface CloseAction {
    type: "CLOSE";
    id: string;
}

export const modalsReducer = (
    state: ModalsState,
    action: OpenAction | CloseAllAction | CloseAction,
) => {
    switch (action.type) {
        case "OPEN": {
            return {
                ...state,
                modals: [...state.modals, action.modal],
                current: action.modal,
            };
        }
        case "CLOSE": {
            const modals = state.modals.filter((modal) => modal.id !== action.id);
            return {
                ...state,
                current: modals[modals.length - 1] || null,
                modals,
            };
        }
        case "CLOSE_ALL": {
            return {
                ...state,
                current: null,
                modals: [],
            };
        }
        default:
            return state;
    }
};
