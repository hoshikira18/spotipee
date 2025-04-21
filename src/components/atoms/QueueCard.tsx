import type { SpotifyTrack } from "../../types";
import CurrentTrackTitle from "../molecules/CurrentTrackTitle";
import { Play } from "./icons";

interface QueueCardProps {
    track: SpotifyTrack;
}
function QueueCard({ track }: QueueCardProps) {
    return (
        <div className="group flex items-center space-x-3 hover:bg-zinc-700/80 p-2.5 rounded-md">
            <div className="relative">
                <img
                    src={track.album.images[0].url}
                    alt={track.name}
                    className="min-w-14 w-14 rounded-md"
                />
                <button
                    type="button"
                    className="absolute inset-0 flex items-center justify-center invisible bg-zinc-700/40"
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
                />
            </div>
        </div>
    );
}

export default QueueCard;
