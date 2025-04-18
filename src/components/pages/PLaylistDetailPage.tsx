import { useContext, useRef } from "react";
import DetailPageTemplate from "../templates/DetailPageTemplate";
import { Pause, Play } from "../atoms/icons";
import { Link, useParams } from "react-router-dom";
import { usePlaylist } from "../../hooks/usePlaylist";
import CustomTable from "../organisms/CustomTable";
import type { SpotifyTrack } from "../../types";
import { PlayerContext } from "../../contexts/PlayerContext";
import TrackServices from "../../services/TrackServices";
import TrackCell from "../atoms/TrackCell";
import { convertMillisecondsToMinutes } from "../../utils";
import { Clock } from "iconsax-react";

function PLaylistDetailPage() {
    const { playlistId } = useParams();
    const { data: playlist } = usePlaylist(playlistId as string);

    console.log(playlist);

    const playButtonRef = useRef<HTMLDivElement>(null);

    const playerContext = useContext(PlayerContext);
    if (!playerContext) {
        throw new Error("PlayerContext is not available");
    }
    const { currentTrack, togglePlay, playbackState } = playerContext;

    const isPlaying = (track: SpotifyTrack) => {
        if (!currentTrack) return false;
        return currentTrack.id === track.id;
    };
    const handlePlayTrack = async (track: SpotifyTrack) => {
        playbackState.isPaused && currentTrack?.id === track.id
            ? togglePlay()
            : await TrackServices.play([track.uri] as string[]);
    };

    const calAddedTime = (added_at: string) => {
        const date = new Date(added_at);
        const currentDate = new Date();
        const diff = currentDate.getTime() - date.getTime();
        const diffInSeconds = Math.floor(diff / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInMonths / 12);
        if (diffInYears > 0) return `${diffInYears} years ago`;
        if (diffInMonths > 0) return `${diffInMonths} months ago`;
        if (diffInDays > 0) return `${diffInDays} days ago`;
        if (diffInHours > 0) return `${diffInHours} hours ago`;
        if (diffInMinutes > 0) return `${diffInMinutes} minutes ago`;
        return `${diffInSeconds} seconds ago`;
    };

    if (!playlist) return null;
    return (
        <DetailPageTemplate
            playButtonRef={playButtonRef}
            uris={["spotify:playlist:37i9dQZF1DXcBWIGoYBM5M"]}
            title="Playlist Detail"
        >
            <div className="h-full absolute inset-0 rounded-md">
                <div className="relative h-1/3 overflow-hidden p-5 bg-gradient-to-b from-[#b24242] to-[#602020] flex items-end space-x-5 pt-12 xl:pt-8">
                    <img
                        src={playlist?.images[0].url}
                        alt={playlist?.name}
                        className="h-full aspect-square object-cover rounded-md shadow-lg"
                    />
                    <div>
                        <p className="font-semibold text-sm">
                            {playlist?.public ? "Public" : "Private"} Playlist
                        </p>
                        <p className="font-extrabold text-8xl">{playlist?.name}</p>
                        <div>
                            <div className="flex items-center space-x-3 text-sm text-zinc-200">
                                <div className="flex items-center space-x-1">
                                    <img
                                        src={playlist?.owner.images[0].url}
                                        alt="owner-image"
                                        className="w-7 rounded-full"
                                    />
                                    <Link
                                        to={`/user/${playlist?.owner.id}`}
                                        className="font-bold hover:underline"
                                    >
                                        {playlist?.owner.display_name}
                                    </Link>
                                </div>
                                <span>•</span>
                                <span>{playlist?.tracks.total} Songs</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-5 p-5" ref={playButtonRef}>
                    <button
                        type="button"
                        className="min-w-14 h-14 flex items-center justify-center transition-all duration-150 bg-green-500 rounded-full hover:bg-green-400 hover:scale-105 text-black"
                    >
                        <Play />
                    </button>
                </div>
                <div className="pb-20">
                    <CustomTable stickyHeader stickyHeaderOffset={64}>
                        <CustomTable.Head
                            style={{
                                background: "#27272a",
                            }}
                        >
                            <CustomTable.Row className="text-zinc-400">
                                <CustomTable.HeaderCell className="w-16 flex items-center justify-end">
                                    #
                                </CustomTable.HeaderCell>
                                <CustomTable.HeaderCell>Title</CustomTable.HeaderCell>
                                <CustomTable.HeaderCell>Album</CustomTable.HeaderCell>
                                <CustomTable.HeaderCell>Added At</CustomTable.HeaderCell>
                                <CustomTable.HeaderCell>
                                    <Clock size={20} />
                                </CustomTable.HeaderCell>
                            </CustomTable.Row>
                        </CustomTable.Head>
                        <CustomTable.Body>
                            {playlist?.tracks.items.map(
                                (
                                    { track, added_at }: { track: SpotifyTrack; added_at: string },
                                    index: number,
                                ) => (
                                    <CustomTable.Row
                                        key={index}
                                        className="group"
                                        style={{
                                            padding: "0 20px",
                                        }}
                                    >
                                        <CustomTable.Cell width={20}>
                                            <div className="flex items-center justify-end">
                                                {isPlaying(track) && !playbackState.isPaused ? (
                                                    <div className="group">
                                                        <img
                                                            width="14"
                                                            height="14"
                                                            alt=""
                                                            src="https://open.spotifycdn.com/cdn/images/equaliser-green.f8937a92.svg"
                                                            className="group-hover:hidden"
                                                        />
                                                        <button
                                                            onClick={togglePlay}
                                                            type="button"
                                                            className="hidden group-hover:block"
                                                        >
                                                            <Pause />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className={
                                                            isPlaying(track)
                                                                ? "text-green-400"
                                                                : "text-zinc-200"
                                                        }
                                                    >
                                                        <span className="block w-5 text-center text-base group-hover:hidden">
                                                            {index + 1}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="w-5 text-center text-base hidden group-hover:block"
                                                            onClick={() => handlePlayTrack(track)}
                                                        >
                                                            <Play />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </CustomTable.Cell>
                                        <CustomTable.Cell
                                            className={`${isPlaying(track) ? "text-green-400" : ""}`}
                                        >
                                            <TrackCell track={track} displayArtist />
                                        </CustomTable.Cell>
                                        <CustomTable.Cell>
                                            <Link
                                                to={`/album/${track.album.id}`}
                                                className="text-[#b3b3b3] hover:underline"
                                            >
                                                {track.album.name}
                                            </Link>
                                        </CustomTable.Cell>
                                        <CustomTable.Cell>
                                            <span className="text-[#b3b3b3]">
                                                {calAddedTime(added_at)}
                                            </span>
                                        </CustomTable.Cell>

                                        <CustomTable.Cell>
                                            <span className="text-[#b3b3b3]">
                                                {convertMillisecondsToMinutes(track.duration_ms)}
                                            </span>
                                        </CustomTable.Cell>
                                    </CustomTable.Row>
                                ),
                            )}
                        </CustomTable.Body>
                    </CustomTable>
                </div>
            </div>
        </DetailPageTemplate>
    );
}

export default PLaylistDetailPage;
