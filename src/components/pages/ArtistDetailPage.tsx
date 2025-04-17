import { Link, useParams } from "react-router-dom";
import { useArtist, useArtistAlbums, useArtistTopTracks } from "../../hooks/useArtist";
import { Pause, Play } from "../atoms/icons";
import type { SpotifyArtist, SpotifyTrack } from "../../types";
import { cn, convertMillisecondsToMinutes } from "../../utils";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import TrackServices from "../../services/TrackServices";
import MediaCard from "../molecules/MediaCard";
import { AddCircle, TickCircle } from "iconsax-react";
import UserServices from "../../services/UserServices";
import { nprogress } from "@mantine/nprogress";
import { useElementScroll } from "../../hooks/useElementScroll";
import AuthWrapper from "../templates/AuthWrapper";
import { TrackContext } from "../../contexts/TrackContext";
import { notifications } from "@mantine/notifications";
import VerifiedBadgeIcon from "../atoms/icons/VerifyBadgeIcon";
import FollowArtistButton from "../atoms/FollowArtistButton";
import { useFollowedArtists } from "../../hooks/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "@mantine/hooks";
import ArtistOptions from "../atoms/ArtistOptionsButton";
import CustomTable from "../organisms/CustomTable";
import TrackCell from "../atoms/TrackCell";
import { PlayerContext } from "../../contexts/PlayerContext";
import TrackOptions from "../atoms/TrackOptionsButton";
import { Button } from "@mantine/core";
import MediaServices from "../../services/MediaService";
import SeeAllButton from "../atoms/SeeAllButton";
import DetailPageTemplate from "../templates/DetailPageTemplate";

export const ArtistDetailContext = createContext<{
    artistId: string | undefined;
    isFollowing: boolean;
    setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>;
    handleChangeStatus: () => void;
    mapSavedTracks: SpotifyTrack[] | undefined;
    isShowMore: boolean;
} | null>(null);

function ArtistDetailPage() {
    const { artistId } = useParams();
    const { data: artist } = useArtist(artistId as string);
    const { data: topTracks } = useArtistTopTracks(artistId as string);
    const { data: followedArtists } = useFollowedArtists();
    const [isFollowing, setIsFollowing] = useState(false);
    const [isShowMore, setIsShowMore] = useState(false);

    const playButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const isArtistFollowed = followedArtists?.some(
            (artist: { id: string }) => artist.id === artistId,
        );
        setIsFollowing(isArtistFollowed || false);
    }, [followedArtists]);

    const queryClient = useQueryClient();
    const handleChangeStatus = useDebouncedCallback(async () => {
        if (!artistId) return;
        if (isFollowing) {
            // Unfollow the artist
            await UserServices.unfollowArtist(artistId, "artist")
                .then(() => {
                    setIsFollowing(false);
                    queryClient.invalidateQueries(["followed-artists"]);
                })
                .catch((error) => {
                    console.error("Error unfollowing artist:", error);
                });
        } else {
            // Follow the artist
            await UserServices.followArtist(artistId, "artist")
                .then(() => {
                    setIsFollowing(true);
                    queryClient.invalidateQueries(["followed-artists"]);
                })
                .catch((error) => {
                    console.error("Error following artist:", error);
                });
        }
    }, 200);

    const trackContext = useContext(TrackContext);
    if (!trackContext) throw new Error("TrackContext is not available");
    const { savedTracks } = trackContext;

    const mapSavedTracks = topTracks?.map((track) => {
        const isSaved = savedTracks.some((savedTrack) => savedTrack.id === track.id);
        return {
            ...track,
            isSaved,
        };
    });

    return (
        <ArtistDetailContext.Provider
            value={{
                artistId,
                isFollowing,
                setIsFollowing,
                handleChangeStatus,
                mapSavedTracks,
                isShowMore,
            }}
        >
            <DetailPageTemplate
                playButtonRef={playButtonRef}
                uris={topTracks?.map((track) => track.uri || "")}
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
                            src={artist?.images[0].url}
                            alt={artist?.name}
                            className="w-full h-full object-cover rounded-t-md"
                        />
                    </div>
                    <div className="flex items-center space-x-5 p-5" ref={playButtonRef}>
                        <button
                            type="button"
                            className="min-w-14 h-14 flex items-center justify-center transition-all duration-150 bg-green-500 rounded-full hover:bg-green-400 hover:scale-105 text-black"
                            onClick={() => {
                                if (topTracks?.length) {
                                    TrackServices.play(topTracks.map((track) => track.uri || ""));
                                }
                            }}
                        >
                            <Play />
                        </button>

                        <FollowArtistButton />
                        <ArtistOptions />
                    </div>

                    {/* Top Tracks table */}
                    <div className="mt-8 px-5">
                        <span className="text-2xl font-bold">Popular</span>
                        <div className="mt-5">
                            <TopTracksTable />
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

const TopTracksTable = () => {
    const { mapSavedTracks, isShowMore } = useContext(ArtistDetailContext) || {};

    const handlePlayTrack = async (track: SpotifyTrack) => {
        playbackState.isPaused && currentTrack?.id === track.id
            ? togglePlay()
            : await TrackServices.play([track.uri] as string[]);
    };

    const trackContext = useContext(TrackContext);
    const playerContext = useContext(PlayerContext);
    if (!trackContext || !playerContext) {
        throw new Error("TrackContext or PlayerContext is not available");
    }
    const { setSavedTracks, savedTracks } = trackContext;
    const { currentTrack, togglePlay, playbackState } = playerContext;

    const handleSaveTrack = async (track: SpotifyTrack) => {
        try {
            nprogress.start();
            if (track.isSaved) {
                await UserServices.removeTracks([track.id])
                    .then(() => {
                        const updatedTracks = savedTracks.filter(
                            (savedTrack) => savedTrack.id !== track.id,
                        );
                        setSavedTracks(updatedTracks);
                    })
                    .catch(() => {
                        notifications.show({
                            message: "Failed to remove track from saved tracks",
                            color: "red",
                        });
                    });
                return;
            }
            await UserServices.saveTracks([track.id as string])
                .then(() => {
                    const updatedTracks = [...savedTracks, track];
                    setSavedTracks(updatedTracks);
                })
                .catch(() => {
                    notifications.show({
                        message: "Failed to save track",
                        color: "red",
                    });
                })
                .finally(() => {
                    nprogress.complete();
                });
        } catch (error) {
            console.error("Error saving track:", error);
        } finally {
            nprogress.complete();
        }
    };

    const isPlaying = (track: SpotifyTrack) => {
        if (!currentTrack) return false;
        return currentTrack.id === track.id;
    };
    return (
        <CustomTable>
            <CustomTable.Body>
                {mapSavedTracks?.slice(0, isShowMore ? 10 : 5).map((track, index) => (
                    <CustomTable.Row key={track.id} className="group">
                        <CustomTable.Cell width={20}>
                            <div className="flex items-center space-x-3">
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
                                            isPlaying(track) ? "text-green-400" : "text-zinc-200"
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
                        <CustomTable.Cell className={`${isPlaying(track) ? "text-green-400" : ""}`}>
                            <TrackCell track={track} />
                        </CustomTable.Cell>
                        <CustomTable.Cell align="right">
                            <div className="flex items-center justify-end space-x-3">
                                <button
                                    type="button"
                                    className={`${track.isSaved ? "text-green-500" : "invisible group-hover:visible text-zinc-400 hover:text-zinc-200 hover:scale-105 "}`}
                                    onClick={() => handleSaveTrack(track)}
                                >
                                    {!track.isSaved ? (
                                        <AddCircle size={18} />
                                    ) : (
                                        <TickCircle variant="Bold" size={18} />
                                    )}
                                </button>
                                <span className="text-[#b3b3b3]">
                                    {convertMillisecondsToMinutes(track.duration_ms)}
                                </span>
                                <TrackOptions track={track} />
                            </div>
                        </CustomTable.Cell>
                    </CustomTable.Row>
                ))}
            </CustomTable.Body>
        </CustomTable>
    );
};

const ArtistAlbums = () => {
    const { artistId } = useParams();
    const { data: topTracks } = useArtistTopTracks(artistId as string);

    const [filter, setFilter] = useState<"single" | "album" | "all">("all");
    const handleFilterChange = (newFilter: "single" | "album" | "all") => {
        setFilter(newFilter);
    };

    const filteredData = topTracks?.filter(
        (track) => filter === "all" || track.album.album_type === filter,
    );

    return (
        <div className="px-5 my-10">
            <span className="text-2xl font-bold">Discography</span>
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
                        key={item.id}
                        title={item.name}
                        imageSrc={item.album.images[1].url}
                    />
                ))}
            </div>
        </div>
    );
};

const RelatedArtists = () => {
    const { artistId } = useParams();
    const { data: artist } = useArtist(artistId as string);
    const [relatedArtist, setRelatedArtist] = useState<SpotifyArtist[]>([]);

    const ARTIST_PER_PAGE = 10;
    useEffect(() => {
        const fetchRelatedArtists = async () => {
            const data = await MediaServices.search({
                q: artist?.genres.join(","),
                type: "artist",
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
                        type="singer"
                        key={artist.id}
                        title={artist.name}
                        imageSrc={artist.images[1].url}
                    />
                ))}
            </div>
        </div>
    );
};
