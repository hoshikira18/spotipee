import { createContext, useContext, useEffect, useRef, useState } from "react";
import DetailPageTemplate from "../templates/DetailPageTemplate";
import { Pause, Play } from "../atoms/icons";
import { Link, useParams } from "react-router-dom";
import { usePlaylist } from "../../hooks/usePlaylist";
import CustomTable from "../organisms/CustomTable";
import type { SpotifyTrack } from "../../types";
import { PlayerContext } from "../../contexts/PlayerContext";
import TrackServices from "../../services/TrackServices";
import TrackCell from "../atoms/TrackCell";
import { calAddedTime, convertMillisecondsToMinutes } from "../../utils";
import { Clock } from "iconsax-react";
import UserImage from "../atoms/UserImage";
import EditPlaylistModal from "../organisms/EditPlaylistModal";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export const PlaylistDetailContext = createContext<{
    playlistId: string;
    name: string;
    description: string;
    setName: (name: string) => void;
    setDescription: (description: string) => void;
} | null>(null);

function PLaylistDetailPage() {
    const { playlistId } = useParams();
    const { data: playlist } = usePlaylist(playlistId as string);
    const [name, setName] = useState(playlist?.name || "");
    const [description, setDescription] = useState(playlist?.description || "");

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

    useEffect(() => {
        if (playlist) {
            setName(playlist.name);
            setDescription(playlist.description);
        }
    }, [playlist]);

    const [opened, { open, close }] = useDisclosure(false);

    if (!playlist) return null;
    return (
        <PlaylistDetailContext.Provider
            value={{
                playlistId: playlist.id,
                name: playlist.name,
                description: playlist.description,
                setName,
                setDescription,
            }}
        >
            <Modal opened={opened} onClose={close} centered size={"lg"}>
                <EditPlaylistModal playlist={playlist} />
            </Modal>
            <DetailPageTemplate
                playButtonRef={playButtonRef}
                uris={["spotify:playlist:37i9dQZF1DXcBWIGoYBM5M"]}
                title="Playlist Detail"
            >
                <div className="h-full absolute inset-0 rounded-md">
                    <div className="relative h-1/3 overflow-hidden p-5 bg-gradient-to-b from-[#b24242] to-[#602020] flex items-end space-x-5 pt-12 xl:pt-8">
                        <UserImage
                            imageUrl={playlist?.images[0].url}
                            alt="playlist-image"
                            onClick={open}
                        />
                        <div>
                            <p className="font-semibold text-sm">
                                {playlist?.public ? "Public" : "Private"} Playlist
                            </p>
                            <p
                                className={`font-extrabold line-clamp-1 ${
                                    name.length > 20
                                        ? "text-4xl"
                                        : name.length > 10
                                          ? "text-6xl"
                                          : "text-8xl"
                                }`}
                            >
                                {name}
                            </p>
                            <p className="text-sm mb-2">{description}</p>
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
                                        {
                                            track,
                                            added_at,
                                        }: { track: SpotifyTrack; added_at: string },
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
                                                                onClick={() =>
                                                                    handlePlayTrack(track)
                                                                }
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
                                                    {convertMillisecondsToMinutes(
                                                        track.duration_ms,
                                                    )}
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
        </PlaylistDetailContext.Provider>
    );
}

export default PLaylistDetailPage;
