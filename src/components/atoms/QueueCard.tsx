import { useCallback, useContext } from "react";
import CommonServices from "../../services/CommonServices";
import type { SpotifyTrack } from "../../types";
import CurrentTrackTitle from "../molecules/CurrentTrackTitle";
import { Play } from "./icons";
import { useRightSidebarStore } from "../../store/rightSidebarStore";

interface QueueCardProps {
    track: SpotifyTrack;
    isPlaying?: boolean;
}

function QueueCard({ track, isPlaying = false }: QueueCardProps) {
    const { refreshData } = useRightSidebarStore();

    const handlePlay = useCallback(async () => {
        const relatedTracks = await CommonServices.search({
            q: `artist:${track.artists[0].name}`,
            type: "track",
            limit: 10,
        });

        const trackUris = relatedTracks.tracks.items.map((item: SpotifyTrack) => item.uri);
        await CommonServices.play({
            uris: [track.uri, ...trackUris],
        });

        // Update the now playing context
        refreshData();
    }, [track]);

    if (!track) {
        return null;
    }

    return (
        <div className="group flex items-center space-x-3 hover:bg-zinc-700/80 p-2.5 rounded-md group/card">
            <div className="relative">
                <img
                    src={track.album.images[0].url}
                    alt={track.name}
                    className="min-w-14 w-14 rounded-md"
                />
                <button
                    type="button"
                    onClick={handlePlay}
                    className="absolute inset-0 flex items-center justify-center invisible group-hover/card:visible bg-zinc-700/40"
                >
                    <Play />
                </button>
            </div>
            <div>
                <CurrentTrackTitle
                    id={track.id}
                    name={track.name}
                    artists={track.artists}
                    size="md"
                    isPlaying={isPlaying}
                />
            </div>
        </div>
    );
}

export default QueueCard;
