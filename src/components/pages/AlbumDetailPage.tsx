import { useContext, useRef } from "react";
import DetailPageTemplate from "../templates/DetailPageTemplate";
import { Pause, Play } from "../atoms/icons";
import { Link, useParams } from "react-router-dom";
import CustomTable from "../organisms/CustomTable";
import type { SpotifyTrack } from "../../types";
import { PlayerContext } from "../../contexts/PlayerContext";
import TrackServices from "../../services/TrackServices";
import { Clock } from "iconsax-react";
import UserImage from "../atoms/UserImage";
import { useAlbum } from "../../hooks/useAlbum";
import { calDurationTime, convertMillisecondsToMinutes, getUSDate } from "../../utils";
import TrackCell from "../atoms/TrackCell";
import { useArtistTopTracks } from "../../hooks/useArtist";
import SeeAllButton from "../atoms/SeeAllButton";
import MediaCard from "../molecules/MediaCard";

function AlbumDetailPage() {
    const { albumId } = useParams();
    const { data: album } = useAlbum(albumId as string);

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

    if (!album) return null;
    return (
        <DetailPageTemplate
            playButtonRef={playButtonRef}
            uris={album.tracks.items.map((track) => track.uri)}
            title="Playlist Detail"
        >
            <div className="h-full absolute inset-0 rounded-md">
                <div className="relative h-1/3 overflow-hidden p-5 bg-gradient-to-b from-[#b24242] to-[#602020] flex items-end space-x-5 pt-12 xl:pt-8">
                    <UserImage imageUrl={album?.images[0].url} alt="playlist-image" />
                    <div className="space-y-4">
                        <span className="text-sm">Album</span>
                        <p
                            className={`font-extrabold line-clamp-1 ${
                                album.name.length > 20
                                    ? "text-4xl"
                                    : album.name.length > 10
                                      ? "text-6xl"
                                      : "text-8xl"
                            }`}
                        >
                            {album.name}
                        </p>
                        <div>
                            <div className="flex items-center space-x-1 text-sm text-zinc-200">
                                <div className="flex items-center space-x-1">
                                    <img
                                        src={album.artists[0].images[0].url}
                                        alt="owner-image"
                                        className="w-7 rounded-full"
                                    />
                                    <Link
                                        to={`/artist/${album?.artists[0].id}`}
                                        className="font-bold hover:underline"
                                    >
                                        {album?.artists[0].name}
                                    </Link>
                                </div>
                                <span>•</span>
                                <span>{album?.total_tracks} Songs</span>
                                <span>•</span>
                                <span>
                                    {calDurationTime(
                                        album?.tracks.items.reduce(
                                            (acc: number, track: SpotifyTrack) =>
                                                acc + track.duration_ms,
                                            0,
                                        ) / 1000,
                                    )}
                                </span>
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

                {/* Album tracks table */}
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
                                <CustomTable.HeaderCell className="flex items-center justify-end">
                                    <Clock size={20} />
                                </CustomTable.HeaderCell>
                            </CustomTable.Row>
                        </CustomTable.Head>
                        <CustomTable.Body>
                            {album?.tracks.items.map((track: SpotifyTrack, index: number) => (
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
                                        <TrackCell
                                            track={track}
                                            displayArtist
                                            displayImage={false}
                                        />
                                    </CustomTable.Cell>

                                    <CustomTable.Cell align="right">
                                        <span className="text-[#b3b3b3]">
                                            {convertMillisecondsToMinutes(track.duration_ms)}
                                        </span>
                                    </CustomTable.Cell>
                                </CustomTable.Row>
                            ))}
                        </CustomTable.Body>
                    </CustomTable>
                    <div className="px-7 mt-8 text-zinc-400 text-[12px]">
                        <p className="text-sm">{getUSDate(album.release_date)}</p>
                        {album.copyrights.map((copy, index) => (
                            <p key={index}>{copy.text}</p>
                        ))}
                    </div>
                </div>
                <ArtistAlbums artistId={album.artists[0].id} artistName={album.artists[0].name} />
            </div>
        </DetailPageTemplate>
    );
}

export default AlbumDetailPage;

interface ArtistAlbumsProps {
    artistId: string;
    artistName: string;
}

const ArtistAlbums = ({ artistId, artistName }: ArtistAlbumsProps) => {
    const { data: topTracks } = useArtistTopTracks(artistId as string);

    return (
        <div className="px-5 mb-10">
            <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">More by {artistName}</span>
                <SeeAllButton link={`/artist/${artistId}/discography`} title="See discography" />
            </div>
            <div className="flex overflow-x-scroll pb-5 mt-5">
                {topTracks?.map((item) => (
                    <MediaCard
                        key={item.id}
                        title={item.name}
                        imageSrc={item.album.images[1].url}
                    />
                ))}
            </div>
        </div>
    );
};
