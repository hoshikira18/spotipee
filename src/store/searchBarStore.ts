import { create } from "zustand";

interface SearchBarStore {
    key: boolean;
    refreshData: () => void;
}

export const useSearchBarStore = create<SearchBarStore>((set) => ({
    key: false,
    refreshData: () => set((state) => ({ ...state, key: !state.key })),
}));
