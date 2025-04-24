import { createContext } from "react";
import { usePlayer } from "../hooks/usePlayer";
import Cookies from "js-cookie";
import type { SpotifyTrack } from "../types";

interface PlayerProviderProps {
    children: React.ReactNode;
}

export const PlayerContext = createContext<{
    progress: {
        currentTime: number;
        duration: number;
    };
    playbackState: {
        isPaused: boolean;
        isShuffle: boolean;
        currentTime: number;
        duration: number;
        repeatMode: number;
        volume: number;
    };
    currentTrack: SpotifyTrack;
    nextTrack: SpotifyTrack[] | null;
    togglePlay: () => void;
    seek: (position: number) => void;
    skipToNext: () => void;
    skipToPrevious: () => void;
    handleToggleShuffle: () => void;
    handleToggleRepeat: () => void;
    handleVolumeChange: (volume: number) => void;
} | null>(null);

function PlayerProvider({ children }: PlayerProviderProps) {
    const token = Cookies.get("access_token");

    if (!token) {
        return children;
    }

    const {
        playbackState,
        currentTrack,
        nextTrack,
        togglePlay,
        seek,
        skipToNext,
        skipToPrevious,
        handleToggleShuffle,
        handleToggleRepeat,
        handleVolumeChange,
        progress,
    } = usePlayer(token);

    const contextValues = {
        playbackState,
        currentTrack,
        nextTrack,
        togglePlay,
        seek,
        skipToNext,
        skipToPrevious,
        handleToggleShuffle,
        handleToggleRepeat,
        handleVolumeChange,
        progress,
    };

    return <PlayerContext.Provider value={contextValues}>{children}</PlayerContext.Provider>;
}

export default PlayerProvider;
