import { useCallback, useContext, useMemo } from "react";
import { PlayerContext } from "../../contexts/PlayerContext";
import type { SpotifyTrack } from "../../types";
import { Pause, Play } from "./icons";
import TrackServices from "../../services/TrackServices";
import { NowPlayingContext } from "../../contexts/NowPlayingContext";
import { useRightSidebarStore } from "../../store/rightSidebarStore";

interface PlayButtonCellProps {
    context_uri?: string;
    track: SpotifyTrack;
    index: number;
}

function PlayButtonCell({ track, index }: PlayButtonCellProps) {
    const playerContext = useContext(PlayerContext);
    const nowPlayingContext = useContext(NowPlayingContext);
    if (!playerContext || !nowPlayingContext) {
        throw new Error("PlayerContext | NowPlayingContext is not available");
    }
    const { currentTrack, togglePlay, playbackState } = playerContext;
    const { refreshData, state, setState } = useRightSidebarStore();

    const isTrackPlaying = useMemo(() => {
        if (!currentTrack) return false;
        return currentTrack.id === track.id;
    }, [currentTrack, track.id]);

    const handlePlayTrack = useCallback(
        async (track: SpotifyTrack) => {
            if (playbackState.isPaused && currentTrack?.id === track.id) {
                togglePlay();
            } else {
                await TrackServices.play([track.uri] as string[]);
            }
            // Trigger a state update to refresh the NowPlayingContext
            refreshData();
            // open the right sidebar
            if (state === "off") {
                setState("current-track");
            }
        },
        [playbackState.isPaused, currentTrack, track.uri, togglePlay],
    );

    return (
        <div className="flex items-center justify-end">
            {isTrackPlaying && !playbackState.isPaused ? (
                <div className="group">
                    <img
                        width="14"
                        height="14"
                        alt=""
                        src="https://open.spotifycdn.com/cdn/images/equaliser-green.f8937a92.svg"
                        className="group-hover:hidden"
                    />
                    <button onClick={togglePlay} type="button" className="hidden group-hover:block">
                        <Pause />
                    </button>
                </div>
            ) : (
                <div className={isTrackPlaying ? "text-green-400" : "text-zinc-200"}>
                    <span className="block w-5 text-center text-base group-hover:hidden">
                        {index + 1}
                    </span>
                    <button
                        type="button"
                        className="w-5 text-center text-base hidden group-hover:block"
                        onClick={() => handlePlayTrack(track)}
                    >
                        <Play />
                    </button>
                </div>
            )}
        </div>
    );
}

export default PlayButtonCell;
