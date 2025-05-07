import { useCallback, useReducer } from "react";
import { CustomModalContext } from "./context";
import type { ModalSettings } from "./context";
import { modalsReducer } from "./reducer";
import CustomModal from "./CustomModal";
import { randomId } from "../../../utils";

interface CustomModalProviderProps {
    children?: React.ReactNode;
}

function CustomModalProvider({ children }: CustomModalProviderProps) {
    const [state, dispatch] = useReducer(modalsReducer, { modals: [], current: null });

    const openModal = useCallback(({ modalId, ...props }: ModalSettings) => {
        const id = modalId || randomId("custom-modal-");
        dispatch({
            type: "OPEN",
            modal: {
                id,
                props: props,
            },
        });
    }, []);

    const closeAllModals = useCallback(() => {
        dispatch({
            type: "CLOSE_ALL",
        });
    }, []);

    const closeModal = useCallback((id: string) => {
        dispatch({
            type: "CLOSE",
            id,
        });
    }, []);

    // Assign the openModal function to the global reference
    open = openModal;
    closeAll = closeAllModals;
    close = closeModal;

    console.log(state);

    return (
        <CustomModalContext.Provider
            value={{
                modals: state.modals,
            }}
        >
            {state.current && <CustomModal {...state.current.props} modalId={state.current.id} />}
            {children}
        </CustomModalContext.Provider>
    );
}

export default CustomModalProvider;

// Global reference to the openModal function
let open: ((settings: ModalSettings) => void) | null = null;
let closeAll: (() => void) | null = null;
let close: ((id: string) => void) | null = null;

export const customModals = {
    open(props: ModalSettings) {
        if (open) {
            open(props);
        } else {
            console.error("CustomModalProvider is not mounted yet.");
        }
    },
    closeAll() {
        if (closeAll) {
            closeAll();
        } else {
            console.error("CustomModalProvider is not mounted yet.");
        }
    },
    close(id: string) {
        if (close) {
            close(id);
        } else {
            console.error("CustomModalProvider is not mounted yet.");
        }
    },
};
