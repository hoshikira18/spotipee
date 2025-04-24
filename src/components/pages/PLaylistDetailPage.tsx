import { createContext, useEffect, useRef, useState } from "react";
import DetailPageTemplate from "../templates/DetailPageTemplate";
import { Link, useParams } from "react-router-dom";
import { usePlaylist } from "../../hooks/usePlaylist";
import CustomTable from "../organisms/CustomTable";
import type { SpotifyTrack } from "../../types";
import TrackCell from "../atoms/TrackCell";
import { calAddedTime, convertMillisecondsToMinutes } from "../../utils";
import { Clock } from "iconsax-react";
import EditPlaylistModal from "../organisms/EditPlaylistModal";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import PlayButton from "../atoms/PlayButton";
import PlayButtonCell from "../atoms/PlayButtonCell";
import AvtImage from "../atoms/AvtImage";

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
                context_uri={playlist?.uri}
                title="Playlist Detail"
            >
                <div className="h-full absolute inset-0 rounded-md">
                    <div className="relative h-1/3 overflow-hidden p-5 bg-gradient-to-b from-[#b24242] to-[#602020] flex items-end space-x-5 pt-12 xl:pt-8">
                        <AvtImage
                            showEditOverlay={true}
                            imageUrl={playlist?.images[0]?.url}
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
                                            src={playlist?.owner.images[0]?.url}
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
                        <PlayButton context_uri={playlist.uri} />
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
                                                <PlayButtonCell index={index} track={track} />
                                            </CustomTable.Cell>
                                            <CustomTable.Cell>
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
