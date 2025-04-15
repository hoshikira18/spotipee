import { create } from "zustand";

type RightSidebarState = "current-track" | "devices" | "queue" | "off";

interface RightSidebarStore {
    state: RightSidebarState;
    setState: (newState: RightSidebarState) => void;
}

export const useRightSidebarStore = create<RightSidebarStore>((set) => ({
    state: "off",
    setState: (newState) =>
        set((state) => ({
            state: state.state !== "off" && state.state === newState ? "off" : newState,
        })),
}));
