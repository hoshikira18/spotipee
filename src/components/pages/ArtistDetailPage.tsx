import { useParams } from "react-router-dom";
import { useArtist, useArtistAlbums, useArtistTopTracks } from "../../hooks/useArtist";
import { Play } from "../atoms/icons";
import type { SpotifyTrack } from "../../types";
import { convertMillisecondsToMinutes } from "../../utils";
import { useEffect, useState } from "react";
import TrackServices from "../../services/TrackServices";
import MediaCard from "../molecules/MediaCard";
import { AddCircle, TickCircle } from "iconsax-react";
import UserServices from "../../services/UserServices";
import { nprogress } from "@mantine/nprogress";
import { useQueryClient } from "@tanstack/react-query";

function ArtistDetailPage() {
    const { artistId } = useParams();
    const { data: artist } = useArtist(artistId as string);
    const { data: topTracks } = useArtistTopTracks(artistId as string);
    const [isShowMore, setIsShowMore] = useState(false);

    return (
        <div className="bg-zinc-900 h-full rounded-md font-spotify overflow-y-scroll">
            <div className="relative h-1/2 overflow-hidden">
                <div className="absolute inset-0 py-4 rounded-t-md flex flex-col justify-end bg-gradient-to-t from-zinc-900/80 to-transparent space-y-4">
                    <h1 className="text-6xl font-bold text-white px-4">{artist?.name}</h1>
                    <p className="px-4">1,692,463 monthly listeners</p>
                </div>
                <img
                    src={artist?.images[0].url}
                    alt={artist?.name}
                    className="w-full h-full object-cover rounded-t-md"
                />
            </div>
            <div className="flex items-center space-x-3 p-5">
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
                <button type="button" className="border-1 border-zinc-400 rounded-full px-4 py-1">
                    <span className="text-sm font-[700] font-spotify text-white">Following</span>
                </button>
            </div>
            <div className="px-5 mt-8">
                <span className="text-2xl font-bold">Popular</span>
                <div>
                    {topTracks?.slice(0, isShowMore ? 10 : 5).map((track, index) => (
                        <ArtistSongCard key={track.id} track={track} no={index} />
                    ))}
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
        </div>
    );
}

export default ArtistDetailPage;

const ArtistSongCard = ({ track, no }: { track: SpotifyTrack; no: number }) => {
    const queryClient = useQueryClient();
    const [isTrackSaved, setIsTrackSaved] = useState<boolean>(false);


    const handlePlayTrack = async () => {
        await TrackServices.play([track.uri] as string[]);
    };

    const handleSaveTrack = async (track: SpotifyTrack) => {
        try {
            nprogress.start();
            console.log(track)
            if (track.isSaved) {
                await UserServices.removeTracks([track.id]).then(() => {
                    setIsTrackSaved(false);
                    queryClient.invalidateQueries(["artistTopTracks"]);
                })
                return
            }
            await UserServices.saveTracks([track.id as string])
                .then(() => {
                    setIsTrackSaved(false);
                })
                .finally(() => {
                    nprogress.complete();
                    queryClient.invalidateQueries(["artistTopTracks"]);
                });
        } catch (error) {
            console.error("Error saving track:", error);
        } finally {
            nprogress.complete();
        }
    };

    return (
        <div className="flex items-center justify-between space-x-3 px-3 py-2 hover:bg-zinc-700/60 rounded-md group">
            <div className="flex items-center space-x-3">
                <span className="block w-5 text-center text-base text-zinc-200 group-hover:hidden">
                    {no + 1}
                </span>
                <button
                    type="button"
                    className="w-5 text-center text-base text-zinc-200 hidden group-hover:block"
                    onClick={handlePlayTrack}
                >
                    <Play />
                </button>
                <img
                    src={track.album.images[0].url}
                    alt="song-img"
                    className="w-11 h-11 rounded-md"
                />
                <p className="">{track.name}</p>
            </div>
            <div className="flex items-center space-x-3">
                <button
                    type="button"
                    className={`${!track.isSaved ? "text-green-500" : "invisible group-hover:visible text-zinc-400 hover:text-zinc-200 hover:scale-105 "}`}
                    onClick={() => handleSaveTrack(track)}
                >
                    {track.isSaved ? (
                        <AddCircle size={18} />
                    ) : (
                        <TickCircle variant="Bold" size={18} />
                    )}
                </button>
                <p className="text-sm text-zinc-400 w-10">
                    {convertMillisecondsToMinutes(track.duration_ms)}
                </p>
            </div>
        </div>
    );
};

const ArtistAlbums = () => {
    const { artistId } = useParams();
    const { data: albums } = useArtistAlbums(artistId as string);
    console.log(albums);

    return (
        <div className="px-5 my-10">
            <span className="text-2xl font-bold">Albums</span>
            <div className="flex overflow-x-scroll pb-5">
                {albums?.map((album) => (
                    <MediaCard key={album.id} title={album.name} imageSrc={album.images[1].url} />
                ))}
            </div>
        </div>
    );
};
