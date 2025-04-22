import { useContext } from "react";
import CommonServices from "../../services/CommonServices";
import type { SpotifyTrack } from "../../types";
import CurrentTrackTitle from "../molecules/CurrentTrackTitle";
import { Play } from "./icons";
import { QueueContext } from "../molecules/QueueView";

interface QueueCardProps {
    track: SpotifyTrack;
    isPlaying?: boolean;
}

function QueueCard({ track, isPlaying = false }: QueueCardProps) {
    const queueContext = useContext(QueueContext);
    if (!queueContext) {
        console.log("no queue context");
    }
    const handlePlay = async () => {
        const relatedTracks = await CommonServices.search({
            q: `artist:${track.artists[0].name}`,
            type: "track",
            limit: 10,
        });

        const trackUris = relatedTracks.tracks.items.map((item: SpotifyTrack) => item.uri);
        await CommonServices.play({
            uris: [track.uri, ...trackUris],
        });
        if (queueContext) {
            queueContext.setKey((prev) => !prev);
        }
    };

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
