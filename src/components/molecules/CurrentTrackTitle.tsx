import { Link } from "react-router-dom";
import type { SpotifyArtist } from "../../types";
import { cn } from "../../utils";

interface CurrentTrackTitleProps {
    size?: "sm" | "md" | "lg";
    id: string;
    name: string;
    artists?: SpotifyArtist[];
    type: "track" | "album" | "playlist" | "artist";
    isPlaying?: boolean;
}

const variants = {
    sm: {
        track: "text-sm",
        artist: "text-xs",
    },
    md: {
        track: "text-base",
        artist: "text-sm",
    },
    lg: {
        track: "text-2xl font-semibold",
        artist: "text-base",
    },
};

function CurrentTrackTitle({
    size = "sm",
    id,
    name,
    artists,
    type,
    isPlaying = false,
}: CurrentTrackTitleProps) {
    return (
        <div>
            <Link
                to={`/${type}/${id}`}
                className={cn(
                    "line-clamp-1 hover:underline",
                    isPlaying ? "text-green-500" : "",
                    variants[size].track,
                )}
            >
                {name}
            </Link>
            {type !== "track" && (
                <span className={cn("text-zinc-400 line-clamp-1", variants[size].artist)}>
                    {type === "playlist"
                        ? "Playlist"
                        : type === "album"
                          ? "Album"
                          : type === "artist"
                            ? "Artist"
                            : ""}
                </span>
            )}
            {type === "track" && (
                <p className={cn("text-zinc-400 line-clamp-1", variants[size].artist)}>
                    {artists?.map((artist, index) => (
                        <span key={artist.id}>
                            <Link
                                to={`/artist/${artist.uri.split(":")[2]}`}
                                className="hover:underline"
                            >
                                {artist.name}
                            </Link>
                            {index < artists.length - 1 && ", "}
                        </span>
                    ))}
                </p>
            )}
        </div>
    );
}

export default CurrentTrackTitle;
