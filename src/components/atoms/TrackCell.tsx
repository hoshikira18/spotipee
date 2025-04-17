import { Link } from "react-router-dom"
import type { SpotifyTrack } from "../../types"

interface TrackCellProps {
    track: SpotifyTrack
}

function TrackCell({ track }: TrackCellProps) {
    return (
        <div className="flex items-center space-x-3">
            <img
                src={track.album.images[0].url}
                alt="song-img"
                className="w-11 h-11 rounded-md"
            />
            <Link to={`/track/${track.id}`} className="hover:underline">{track.name}</Link>
        </div>
    )
}

export default TrackCell
