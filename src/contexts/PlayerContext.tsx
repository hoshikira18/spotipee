import { createContext } from "react";
import { usePlayer } from "../hooks/usePlayer";
import Cookies from "js-cookie";

interface PlayerProviderProps {
    children: React.ReactNode;
}

export const PlayerContext = createContext<{
    playbackState: {
        isPaused: boolean;
        isShuffle: boolean;
        currentTime: number;
        duration: number;
        repeatMode: number;
        volume: number;
    };
    currentTrack: any;
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
        togglePlay,
        seek,
        skipToNext,
        skipToPrevious,
        handleToggleShuffle,
        handleToggleRepeat,
        handleVolumeChange,
    } = usePlayer(token);

    const contextValues = {
        playbackState,
        currentTrack,
        togglePlay,
        seek,
        skipToNext,
        skipToPrevious,
        handleToggleShuffle,
        handleToggleRepeat,
        handleVolumeChange,
    };

    console.log(currentTrack)

    return <PlayerContext.Provider value={contextValues}>{children}</PlayerContext.Provider>;
}

export default PlayerProvider;
