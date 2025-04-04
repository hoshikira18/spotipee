import { Play } from "iconsax-react";
import { Link } from "react-router-dom";
import { getImage } from "../../utils";

import type { SpotifyArtist } from "../../types";

interface ArtistCardProps {
    artist: SpotifyArtist;
    sidebarOpened?: boolean;
}

function ArtistCard({ artist, sidebarOpened = true }: ArtistCardProps) {
    return (
        <Link
            to={"/"}
            className="inline-flex items-center space-x-2 p-2 hover:bg-zinc-700/80 w-full rounded-md"
        >
            <button
                type="button"
                className="group min-w-12 h-12 flex items-center justify-center hover:text-green-600 transition-all duration-150"
            >
                <img
                    src={getImage(160, artist.images)}
                    alt={artist.name}
                    className="w-12 aspect-square rounded-full object-cover"
                />
                <span className="absolute invisible group-hover:visible text-green-600">
                    <Play variant="Bold" />
                </span>
            </button>
            <div
                className={`min-w-40 origin-left transition-all duration-300 ${!sidebarOpened && "scale-0 invisible"}`}
            >
                <div className={"text-base font-spotify"}>{artist.name}</div>
                <span className={"text-sm font-spotify"}>
                    {artist.type === "artist" ? "Artist" : "Others"}
                </span>
            </div>
        </Link>
    );
}

export default ArtistCard;
