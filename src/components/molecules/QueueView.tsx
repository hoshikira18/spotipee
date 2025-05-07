import { useEffect, useState } from "react";
import type { SpotifyTrack } from "../../types";
import CommonServices from "../../services/CommonServices";
import CloseIcon from "../atoms/icons/CloseIcon";
import { useRightSidebarStore } from "../../store/rightSidebarStore";
import QueueCard from "../atoms/QueueCard";

function QueueView() {
    const { key, setState: setRightSidebarContentState } = useRightSidebarStore();

    const [queue, setQueue] = useState<{
        currently_playing: SpotifyTrack;
        queue: SpotifyTrack[];
    } | null>(null);

    useEffect(() => {
        const fetchQueue = async () => {
            const data = await CommonServices.getQueue();
            setQueue(data);
        };

        fetchQueue();
    }, [key]);

    if (!queue) return null;

    const { currently_playing, queue: queueItems } = queue;

    return (
        <div className="px-3 overflow-y-scroll h-full">
            <div className="flex items-center justify-between px-2 pt-4 pb-3 sticky top-0 z-10 bg-zinc-900">
                <div className="flex space-x-3">
                    <h2 className="font-semibold">Queue</h2>
                </div>
                <button
                    type="button"
                    className="p-2 hover:bg-zinc-700/40 rounded-full"
                    onClick={() => setRightSidebarContentState("off")}
                >
                    <CloseIcon size={20} />
                </button>
            </div>
            <div className="px-2 mt-6">
                <h4 className="font-semibold mb-2">Now playing</h4>
                <QueueCard
                    type="track"
                    id={currently_playing?.id}
                    name={currently_playing?.name}
                    image={currently_playing?.album?.images[0]?.url}
                    artists={currently_playing?.artists}
                    uri={currently_playing?.uri || ""}
                    isPlaying={true}
                />
            </div>
            <div className="px-2 mt-6">
                <h4 className="font-semibold mb-2">Next in Queue</h4>
                {queueItems.map((item: SpotifyTrack, index: number) => (
                    <QueueCard
                        key={item.id + index}
                        type="track"
                        id={item.id}
                        name={item.name}
                        image={item.album?.images[0]?.url}
                        artists={item.artists}
                        uri={item.uri || ""}
                        isPlaying={false}
                    />
                ))}
            </div>
        </div>
    );
}

export default QueueView;
