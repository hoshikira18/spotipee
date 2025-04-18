import { useContext, useRef, useState } from "react";
import DetailPageTemplate from "../templates/DetailPageTemplate";
import { Play } from "../atoms/icons";
import { Link, useParams } from "react-router-dom";
import type { SpotifyTrack } from "../../types";
import { PlayerContext } from "../../contexts/PlayerContext";
import TrackServices from "../../services/TrackServices";
import UserImage from "../atoms/UserImage";
import { calDurationTime } from "../../utils";
import { useArtistTopTracks } from "../../hooks/useArtist";
import { useTrack } from "../../hooks/useTrack";
import SaveTrackButton from "../atoms/SaveTrackButton";
import DetailSection from "../organisms/DetailSection";
import TopTracksTable from "../organisms/TopTrackTable";

function TrackDetailPage() {
    const { trackId } = useParams();
    const { data: track } = useTrack(trackId as string);

    const playButtonRef = useRef<HTMLDivElement>(null);

    const playerContext = useContext(PlayerContext);
    if (!playerContext) {
        throw new Error("PlayerContext is not available");
    }
    const { currentTrack, togglePlay, playbackState } = playerContext;

    const handlePlayTrack = async (track: SpotifyTrack) => {
        playbackState.isPaused && currentTrack?.id === track.id
            ? togglePlay()
            : await TrackServices.play([track.uri] as string[]);
    };

    if (!track) return null;
    return (
        <DetailPageTemplate
            playButtonRef={playButtonRef}
            uris={[track?.uri]}
            title="Playlist Detail"
        >
            <div className="h-full absolute inset-0 rounded-md">
                <div className="relative h-1/3 overflow-hidden p-5 bg-gradient-to-b from-[#b24242] to-[#602020] flex items-end space-x-5 pt-12 xl:pt-8">
                    <UserImage imageUrl={track?.album.images[0].url} alt="playlist-image" />
                    <div className="space-y-4">
                        <span className="text-sm">Song</span>
                        <p
                            className={`font-extrabold line-clamp-1 ${
                                track.name.length > 20
                                    ? "text-4xl"
                                    : track.name.length > 10
                                      ? "text-6xl"
                                      : "text-8xl"
                            }`}
                        >
                            {track.name}
                        </p>
                        <div>
                            <div className="flex items-center space-x-1 text-sm text-zinc-200">
                                <div className="flex items-center space-x-1">
                                    <img
                                        src={track.artists[0].images[0].url}
                                        alt="owner-image"
                                        className="w-7 aspect-square object-cover rounded-full"
                                    />
                                    <Link
                                        to={`/artist/${track?.artists[0].id}`}
                                        className="font-bold hover:underline"
                                    >
                                        {track?.artists[0].name}
                                    </Link>
                                </div>
                                <span>•</span>
                                <Link to={`/album/${track.album.id}`} className="hover:underline">
                                    {track.album.name}
                                </Link>
                                <span>•</span>
                                <span>{new Date(track?.album.release_date).getFullYear()}</span>
                                <span>•</span>
                                <span>{calDurationTime(track?.duration_ms / 1000)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-5 p-5" ref={playButtonRef}>
                    <button
                        type="button"
                        onClick={() => handlePlayTrack(track)}
                        className="min-w-14 h-14 flex items-center justify-center transition-all duration-150 bg-green-500 rounded-full hover:bg-green-400 hover:scale-105 text-black"
                    >
                        <Play />
                    </button>
                    <SaveTrackButton track={track} className="visible" size="lg" />
                </div>
                <div className="px-5 mb-10">
                    {track?.artists.map((artist) => (
                        <Link
                            to={`/artist/${artist.id}`}
                            key={artist.id}
                            className="group flex items-center space-x-5 p-2 mb-10 hover:bg-zinc-800 rounded-md"
                        >
                            <img
                                src={artist.images[2].url}
                                alt={artist.name}
                                className="w-20 aspect-square object-cover rounded-full"
                            />
                            <div>
                                <p className="font-bold hover:underline text-sm">Artist</p>
                                <p className="group-hover:underline font-bold hover:underline mt-1">
                                    {artist.name}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
                <PopularTracks artistId={track.artists[0].id} artistName={track.artists[0].name} />
                <ArtistAlbums artistId={track.artists[0].id} artistName={track.artists[0].name} />
                <ArtistSingles artistId={track.artists[0].id} artistName={track.artists[0].name} />
            </div>
        </DetailPageTemplate>
    );
}

export default TrackDetailPage;

interface DetailSectionProps {
    artistId: string;
    artistName: string;
}

const PopularTracks = ({ artistId, artistName }: DetailSectionProps) => {
    const { data: topTracks } = useArtistTopTracks(artistId as string);
    const [isShowMore, setIsShowMore] = useState(false);

    return (
        <div className="my-8 px-5">
            <p className="text-sm text-zinc-400">Popular Tracks by </p>
            <span className="text-2xl font-bold">{artistName}</span>
            <div className="mt-5">
                <TopTracksTable tracks={topTracks} isShowMore={isShowMore} />
            </div>

            <div className="text-zinc-400 text-sm my-2">
                {isShowMore ? (
                    <button
                        type="button"
                        className="text-sm font-spotify text-zinc-400"
                        onClick={() => setIsShowMore(false)}
                    >
                        Show less
                    </button>
                ) : (
                    <button
                        type="button"
                        className="text-sm font-spotify text-zinc-400"
                        onClick={() => setIsShowMore(true)}
                    >
                        Show more
                    </button>
                )}
            </div>
        </div>
    );
};

const ArtistAlbums = ({ artistId, artistName }: DetailSectionProps) => {
    const { data: albums } = useArtistTopTracks(artistId as string);

    return (
        <DetailSection
            title={`Popular Albums by ${artistName}`}
            seeAllLink={`/artist/${artistId}/discography/album`}
            data={albums
                ?.filter((item) => item.album.album_type === "album")
                .map((album) => ({
                    ...album,
                    images: album.album.images,
                }))}
        />
    );
};

const ArtistSingles = ({ artistId, artistName }: DetailSectionProps) => {
    const { data: topTracks } = useArtistTopTracks(artistId as string);
    const singles = topTracks
        ?.filter((track) => track.album.album_type === "single")
        .map((track) => ({
            ...track,
            images: track.album.images,
        }));

    return (
        <DetailSection
            title={`Popular Singles by ${artistName}`}
            seeAllLink={`/artist/${artistId}/discography/single`}
            data={singles}
        />
    );
};
