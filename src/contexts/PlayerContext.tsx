import { createContext } from "react";
import { usePlayer } from "../hooks/usePlayer";

interface PlayerContextProps {
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

function PlayerProvider({ children }: PlayerContextProps) {
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
    } = usePlayer();

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

    return <PlayerContext.Provider value={contextValues}>{children}</PlayerContext.Provider>;
}

export default PlayerProvider;
