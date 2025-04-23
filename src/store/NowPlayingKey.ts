import { create } from "zustand";

interface NowPlayingKeyStore {
    state: boolean;
    setState: (newState: boolean) => void;
}

export const useNowPlayingKey = create<NowPlayingKeyStore>((set) => ({
    state: false,
    setState: (newState) =>
        set(() => ({
            state: newState,
        })),
}));
