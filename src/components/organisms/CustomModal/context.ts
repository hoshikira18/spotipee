import { createContext } from "react";
import type { CustomModalProps } from "./CustomModal";

export type ModalSettings = Partial<CustomModalProps & { modalId: string }>;

export type ModalState = {
    id: string;
    props: ModalSettings;
};

export type ModalsState = {
    modals: ModalState[];
    current: ModalState | null;
};

export interface CustomModalContextType {
    modals: ModalState[];
}

export const CustomModalContext = createContext<CustomModalContextType>(null as any);
