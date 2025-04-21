import { useContext } from "react";
import type { SpotifyTrack } from "../../types";
import { PlayerContext } from "../../contexts/PlayerContext";
import TrackServices from "../../services/TrackServices";
import { Play } from "./icons";

interface PlayButtonProps {
    tracks: SpotifyTrack[];
    className?: string;
}

const PlayButton = ({
    tracks,
    className = "min-w-14 h-14 flex items-center justify-center transition-all duration-150 bg-green-500 rounded-full hover:bg-green-400 hover:scale-105 text-black",
}: PlayButtonProps) => {
    const playerContext = useContext(PlayerContext);
    if (!playerContext) {
        throw new Error("PlayerContext is not available");
    }
    const { currentTrack, togglePlay, playbackState } = playerContext;

    const handlePlayTrack = async () => {
        playbackState.isPaused && tracks.some((t) => t.id === currentTrack?.id)
            ? togglePlay()
            : await TrackServices.play(tracks.map((t) => t.uri as string));
    };

    return (
        <>
            <button type="button" onClick={handlePlayTrack} className={className}>
                <Play />
            </button>
        </>
    );
};

export default PlayButton;
