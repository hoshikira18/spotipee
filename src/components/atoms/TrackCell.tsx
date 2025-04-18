import { Link } from "react-router-dom";
import type { SpotifyTrack } from "../../types";

interface TrackCellProps {
    track: SpotifyTrack;
    displayArtist?: boolean;
}

function TrackCell({ track, displayArtist = false }: TrackCellProps) {
    return (
        <div className="flex items-center space-x-3">
            <img src={track.album.images[0].url} alt="song-img" className="w-11 h-11 rounded-md" />
            <div className="flex flex-col">
                <Link to={`/track/${track.id}`} className="hover:underline text-base">
                    {track.name}
                </Link>
                {displayArtist && (
                    <p className="text-sm text-gray-300">
                        {track.artists
                            .map((artist) => (
                                <Link
                                    key={artist.id}
                                    to={`/artist/${artist.id}`}
                                    className="hover:underline"
                                >
                                    {artist.name}
                                </Link>
                            ))
                            .reduce((prev, curr) => (
                                <span key={curr.key}>
                                    {prev}
                                    {", "}
                                    {curr}
                                </span>
                            ))}
                    </p>
                )}
            </div>
        </div>
    );
}

export default TrackCell;
