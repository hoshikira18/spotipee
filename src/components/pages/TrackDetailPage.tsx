import { useMemo, useRef, useState } from "react";
import DetailPageTemplate from "../templates/DetailPageTemplate";
import { Link, useParams } from "react-router-dom";
import { calDurationTime } from "../../utils";
import { useArtistTopTracks } from "../../hooks/useArtist";
import { useTrack } from "../../hooks/useTrack";
import SaveTrackButton from "../atoms/SaveTrackButton";
import DetailSection from "../organisms/DetailSection";
import TopTracksTable from "../organisms/TopTrackTable";
import PlayButton from "../atoms/PlayButton";
import TrackImage from "../atoms/AvtImage";

function TrackDetailPage() {
    const { trackId } = useParams();
    const { data: track } = useTrack(trackId as string);

    const playButtonRef = useRef<HTMLDivElement>(null);

    if (!track) return null;
    return (
        <DetailPageTemplate playButtonRef={playButtonRef} tracks={[track]} title="Playlist Detail">
            <div className="h-full absolute inset-0 rounded-md">
                <div className="relative h-1/3 overflow-hidden p-5 bg-gradient-to-b from-[#b24242] to-[#602020] flex items-end space-x-5 pt-12 xl:pt-8">
                    <TrackImage imageUrl={track?.album.images[0].url} alt="playlist-image" />
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
                                {track?.artists.map((artist) => (
                                    <div key={artist.id} className="flex items-center space-x-1">
                                        <img
                                            src={artist.images[0].url}
                                            alt="owner-image"
                                            className="w-7 aspect-square object-cover rounded-full"
                                        />
                                        <Link
                                            to={`/artist/${artist.id}`}
                                            className="font-bold hover:underline"
                                        >
                                            {artist.name}
                                        </Link>
                                    </div>
                                ))}
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
                    <PlayButton tracks={[track]} />
                    <SaveTrackButton trackId={track.id} className="visible" size="lg" />
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
    const { data } = useArtistTopTracks(artistId as string);

    const albums = useMemo(
        () => data?.filter((track) => track.album.album_type === "album"),
        [data],
    );

    if (!albums) return null;

    return (
        <DetailSection
            title={`Popular Albums by ${artistName}`}
            seeAllLink={`/artist/${artistId}/discography/album`}
            type="album"
            data={albums}
        />
    );
};

const ArtistSingles = ({ artistId, artistName }: DetailSectionProps) => {
    const { data: topTracks } = useArtistTopTracks(artistId as string);

    const singles = useMemo(
        () => topTracks?.filter((track) => track.album.album_type === "single"),
        [topTracks],
    );

    if (!singles) return null;

    return (
        <DetailSection
            title={`Popular Singles by ${artistName}`}
            seeAllLink={`/artist/${artistId}/discography/single`}
            data={singles}
            type="album"
        />
    );
};
