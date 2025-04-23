import { createContext, useEffect, useState } from "react";
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
                    <p className="font-semibold">Queue</p>
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
                <p className="font-semibold mb-2">Now playing</p>
                <QueueCard track={currently_playing} isPlaying={true} />
            </div>
            <div className="px-2 mt-6">
                <p className="font-semibold mb-2">Next in Queue</p>
                {queueItems.map((item: SpotifyTrack, index: number) => (
                    <QueueCard key={item.id + index} track={item} />
                ))}
            </div>
        </div>
    );
}

export default QueueView;
