import { useCallback, useContext } from "react";
import type { SpotifyTrack } from "../../types";
import { PlayerContext } from "../../contexts/PlayerContext";
import { Play } from "./icons";
import CommonServices from "../../services/CommonServices";
import { NowPlayingContext } from "../../contexts/NowPlayingContext";

type PlayButtonProps =
    | {
          tracks?: SpotifyTrack[];
          context_uri?: never;
          className?: string;
      }
    | {
          tracks?: never;
          context_uri?: string;
          className?: string;
      };

const PlayButton = ({
    tracks,
    context_uri,
    className = "min-w-14 h-14 flex items-center justify-center transition-all duration-150 bg-green-500 rounded-full hover:bg-green-400 hover:scale-105 text-black",
}: PlayButtonProps) => {
    const playerContext = useContext(PlayerContext);
    const nowPlayingContext = useContext(NowPlayingContext);
    if (!playerContext || !nowPlayingContext) {
        throw new Error("PlayerContext | NowPlayingContext is not available");
    }
    const { currentTrack, togglePlay, playbackState } = playerContext;
    const { setKey } = nowPlayingContext;

    const handlePlayTrack = useCallback(async () => {
        try {
            if (tracks) {
                playbackState.isPaused && tracks.some((t) => t.id === currentTrack?.id)
                    ? togglePlay()
                    : await CommonServices.play({
                          uris: tracks.map((t) => t.uri as string),
                      });

                return;
            }
            await CommonServices.play({
                context_uri,
            });
            setKey((prev) => !prev);
        } catch (error) {
            console.error("Error playing track:", error);
        }
    }, [context_uri, currentTrack, playbackState.isPaused, tracks, togglePlay, setKey]);

    return (
        <button type="button" onClick={handlePlayTrack} className={className}>
            <Play />
        </button>
    );
};

export default PlayButton;
