import { Link } from "react-router-dom";
import type { SpotifyArtist } from "../../types";
import { cn } from "../../utils";

interface CurrentTrackTitleProps {
    size?: "sm" | "md" | "lg";
    id: string;
    name: string;
    artists: SpotifyArtist[];
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

function CurrentTrackTitle({ size = "sm", id, name, artists }: CurrentTrackTitleProps) {
    return (
        <div>
            <Link
                to={`/track/${id}`}
                className={cn("line-clamp-1 hover:underline", variants[size].track)}
            >
                {name}
            </Link>
            <p className={cn("text-zinc-400 line-clamp-1", variants[size].artist)}>
                {artists.map((artist, index) => (
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
        </div>
    );
}

export default CurrentTrackTitle;
