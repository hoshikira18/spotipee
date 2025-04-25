import { useCallback } from "react";
import CommonServices from "../../services/CommonServices";
import type { SpotifyArtist, SpotifyTrack } from "../../types";
import CurrentTrackTitle from "../molecules/CurrentTrackTitle";
import { CloseIcon, Play } from "./icons";
import { useRightSidebarStore } from "../../store/rightSidebarStore";
import { useSearchBarStore } from "../../store/searchBarStore";

interface QueueCardProps {
    isPlaying?: boolean;
    name: string;
    image?: string;
    id: string;
    artists: SpotifyArtist[];
    type: "track" | "album" | "playlist" | "artist";
    uri?: string;
    displayDeleteButton?: boolean;
}

function QueueCard({
    isPlaying = false,
    name,
    image,
    id,
    artists,
    uri,
    type,
    displayDeleteButton = false,
}: QueueCardProps) {
    const { refreshData } = useRightSidebarStore();
    const searchbarStore = useSearchBarStore();

    const handlePlay = useCallback(async () => {
        const relatedTracks = await CommonServices.search({
            q: `artist:${artists[0]?.name || name}`,
            type: ["track"],
            limit: 10,
        });

        const trackUris = relatedTracks.tracks.items.map((item: SpotifyTrack) => item.uri);
        if (type === "track") {
            await CommonServices.play({
                uris: [uri, ...trackUris],
            });
        } else {
            await CommonServices.play({
                context_uri: uri,
            });
        }

        // Update the now playing context
        refreshData();
    }, [name, uri, artists, refreshData]);

    const handleRemoveRecentlySearch = (id: string) => {
        // Handle remove action
        const recentlyPlayed = localStorage.getItem("recentlySearched");
        if (!recentlyPlayed) return;
        const parsedRecentlyPlayed = JSON.parse(recentlyPlayed);
        const newRecentlyPlayed = parsedRecentlyPlayed.filter((item: any) => item.id !== id);
        localStorage.setItem("recentlySearched", JSON.stringify(newRecentlyPlayed));
        searchbarStore.refreshData();
    };

    return (
        <div className="group flex items-center space-x-3 hover:bg-zinc-700/80 p-2.5 rounded-md group/card">
            <div className="relative">
                <img
                    src={
                        image ||
                        "https://storage.googleapis.com/pr-newsroom-wp/1/2022/03/Spotify_Logo_RGB_White-1.png"
                    }
                    alt={name}
                    className="min-w-14 w-14 h-14 object-cover rounded-md"
                />
                <button
                    type="button"
                    onClick={handlePlay}
                    className="absolute inset-0 flex items-center justify-center invisible group-hover/card:visible bg-zinc-700/40"
                >
                    <Play />
                </button>
            </div>
            <div className="w-full">
                <CurrentTrackTitle
                    id={id}
                    name={name}
                    type={type}
                    artists={artists}
                    size="sm"
                    isPlaying={isPlaying}
                />
            </div>
            {displayDeleteButton && (
                <button
                    type="button"
                    className="invisible group-hover/card:visible"
                    onClick={() => handleRemoveRecentlySearch(id)}
                >
                    <CloseIcon />
                </button>
            )}
        </div>
    );
}

export default QueueCard;
