import { useParams } from "react-router-dom";
import { useArtist, useArtistTopTracks } from "../../hooks/useArtist";
import type { SpotifyArtist } from "../../types";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import MediaCard from "../molecules/MediaCard";
import { TrackContext } from "../../contexts/TrackContext";
import VerifiedBadgeIcon from "../atoms/icons/VerifyBadgeIcon";
import FollowArtistButton from "../atoms/FollowArtistButton";
import { Button } from "@mantine/core";
import CommonServices from "../../services/CommonServices";
import SeeAllButton from "../atoms/SeeAllButton";
import DetailPageTemplate from "../templates/DetailPageTemplate";
import TopTracksTable from "../organisms/TopTrackTable";
import PlayButton from "../atoms/PlayButton";
import { useRecentlyPlayed } from "../../hooks/useMedia";

export const ArtistDetailContext = createContext<{
    artistId: string | undefined;
    isShowMore: boolean;
} | null>(null);

function ArtistDetailPage() {
    const { artistId } = useParams();
    const { data: artist } = useArtist(artistId as string);
    const { data: topTracks } = useArtistTopTracks(artistId as string);
    const [isShowMore, setIsShowMore] = useState(false);

    const playButtonRef = useRef<HTMLDivElement>(null);

    const trackContext = useContext(TrackContext);
    const {
        data: { items: recentlyPlayed } = { recentlyPlayed: [] },
    } = useRecentlyPlayed();

    if (!recentlyPlayed) return null;

    if (!trackContext) throw new Error("TrackContext is not available");
    if (!artist) return null;

    console.log("render artist detail page");

    return (
        <ArtistDetailContext.Provider
            value={{
                artistId,
                isShowMore,
            }}
        >
            <DetailPageTemplate
                playButtonRef={playButtonRef}
                context_uri={artist?.uri}
                title={artist?.name}
            >
                <div className="h-full absolute inset-0">
                    <div className="relative h-1/2 overflow-hidden">
                        <div className="absolute inset-0 py-4 rounded-t-md flex flex-col justify-end bg-gradient-to-t from-zinc-900/80 to-transparent space-y-4 ">
                            <span className="px-4 flex items-center space-x-2">
                                <VerifiedBadgeIcon color="#55aaff" />
                                <span data-encore-id="text">Verified Artist</span>
                            </span>
                            <h1 className="text-6xl font-bold text-white px-4">{artist?.name}</h1>
                            <p className="px-4">1,692,463 monthly listeners</p>
                        </div>
                        <img
                            src={
                                artist?.images[0]?.url ||
                                "https://i.pcmag.com/imagery/articles/041L4VORmgsmWfphGUK5Lr9-1.fit_lim.size_1600x900.v1733326163.jpg"
                            }
                            alt={artist?.name}
                            className="w-full h-full object-cover rounded-t-md"
                        />
                    </div>
                    <div className="flex items-center space-x-5 p-5" ref={playButtonRef}>
                        <PlayButton context_uri={artist?.uri} />
                        <FollowArtistButton artist={artist} />
                    </div>

                    {/* Top Tracks table */}
                    <div className="mt-8 px-5">
                        <span className="text-2xl font-bold">Popular</span>
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
                    <ArtistAlbums />
                    <RelatedArtists />
                </div>
            </DetailPageTemplate>
        </ArtistDetailContext.Provider>
    );
}

export default ArtistDetailPage;

const ArtistAlbums = () => {
    const { artistId } = useParams();
    const { data: topTracks } = useArtistTopTracks(artistId as string);

    const [filter, setFilter] = useState<"single" | "album" | "all">("all");
    const handleFilterChange = (newFilter: "single" | "album" | "all") => {
        setFilter(newFilter);
    };

    const filteredData = useMemo(
        () => topTracks?.filter((track) => filter === "all" || track.album.album_type === filter),
        [topTracks, filter],
    );

    if (!topTracks) return null;

    return (
        <div className="px-5 my-10">
            <h2 className="text-2xl font-bold">Discography</h2>
            <div>
                <div className="flex items-center justify-between">
                    <div className="flex space-x-3 my-5">
                        <Button
                            variant={filter === "all" ? "filter-active" : "filter"}
                            onClick={() => handleFilterChange("all")}
                        >
                            Popular release
                        </Button>
                        <Button
                            variant={filter === "album" ? "filter-active" : "filter"}
                            onClick={() => handleFilterChange("album")}
                        >
                            Albums
                        </Button>

                        <Button
                            variant={filter === "single" ? "filter-active" : "filter"}
                            onClick={() => handleFilterChange("single")}
                        >
                            Singles and EPs
                        </Button>
                    </div>
                    <SeeAllButton link={`/artist/${artistId}/discography`} />
                </div>
            </div>
            <div className="flex overflow-x-scroll pb-5">
                {filteredData?.map((item) => (
                    <MediaCard
                        type="album"
                        id={item.album.id}
                        uri={item.album.uri}
                        key={item.id}
                        title={item.album.name}
                        imageSrc={item.album?.images[0]?.url}
                    />
                ))}
            </div>
        </div>
    );
};

const RelatedArtists = () => {
    const { artistId } = useParams();
    const { data: artist } = useArtist(artistId as string);
    const [relatedArtist, setRelatedArtist] = useState<SpotifyArtist[] | null>(null);

    const ARTIST_PER_PAGE = 10;
    useEffect(() => {
        const fetchRelatedArtists = async () => {
            const data = await CommonServices.search({
                q: artist?.genres.join(","),
                type: ["artist"],
                limit: ARTIST_PER_PAGE,
            }).then((res) => res.artists.items);
            setRelatedArtist(data);
        };
        fetchRelatedArtists();
    }, [artist]);

    if (!relatedArtist) return null;

    return (
        <div className="px-5 my-10">
            <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">Fans also like</span>
                <SeeAllButton link={`/artist/${artistId}/related`} />
            </div>
            <div className="flex overflow-x-scroll pb-5 mt-5">
                {relatedArtist?.map((artist) => (
                    <MediaCard
                        type="artist"
                        id={artist.id}
                        uri={artist.uri}
                        key={artist.id}
                        title={artist.name}
                        imageSrc={artist.images[0]?.url}
                    />
                ))}
            </div>
        </div>
    );
};
