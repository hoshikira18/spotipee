import { create } from "zustand";

type RightSidebarState = "current-track" | "devices" | "queue" | "off";

interface RightSidebarStore {
    key: boolean;
    state: RightSidebarState;
    setState: (newState: RightSidebarState) => void;
    refreshData: () => void;
}

export const useRightSidebarStore = create<RightSidebarStore>((set) => ({
    key: false,
    state: "off",
    setState: (newState) =>
        set((state) => ({
            ...state,
            state: state.state !== "off" && state.state === newState ? "off" : newState,
        })),
    refreshData: () => set((state) => ({ ...state, key: !state.key })),
}));
