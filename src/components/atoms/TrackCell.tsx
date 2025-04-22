import type { SpotifyTrack } from "../../types";
import { useContext, useMemo } from "react";
import { PlayerContext } from "../../contexts/PlayerContext";
import { cn } from "../../utils";
import CurrentTrackTitle from "../molecules/CurrentTrackTitle";

interface TrackCellProps {
    track: SpotifyTrack;
    displayArtist?: boolean;
    displayImage?: boolean;
}

function TrackCell({ track, displayArtist = false, displayImage = true }: TrackCellProps) {
    const playerContext = useContext(PlayerContext);
    if (!playerContext) {
        throw new Error("PlayerContext is not available");
    }
    const { currentTrack } = playerContext;

    const isPlaying = useMemo(() => {
        if (!track) return false;
        return track?.id === currentTrack?.id;
    }, [track, currentTrack]);

    return (
        <div className={cn("flex items-center space-x-3", isPlaying && "text-green-400")}>
            {displayImage && (
                <img
                    src={track.album.images[0].url}
                    alt="song-img"
                    className="w-11 h-11 rounded-md"
                />
            )}
            {displayArtist ? (
                <CurrentTrackTitle
                    size="md"
                    id={track?.id}
                    name={track?.name}
                    artists={track?.artists}
                />
            ) : (
                <CurrentTrackTitle size="md" id={track?.id} name={track?.name} />
            )}
        </div>
    );
}

export default TrackCell;
