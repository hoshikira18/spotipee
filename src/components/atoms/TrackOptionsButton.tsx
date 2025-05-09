import { Input } from "@mantine/core";
import { SearchNormal } from "iconsax-react";
import { MoreIcon } from "./icons";
import { useCurrentUserPlaylist } from "../../hooks/usePlaylist";
import PlaylistServices from "../../services/PlaylistServices";
import type { SpotifyTrack } from "../../types";
import { useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import CustomMenu from "../molecules/CustomMenu/components/CustomMenu";

interface TrackOptionsProps {
    track: SpotifyTrack;
}

const TrackOptions = ({ track }: TrackOptionsProps) => {
    return (
        <CustomMenu position="top">
            <CustomMenu.Trigger>
                <button type="button" className="text-zinc-400">
                    <MoreIcon size={24} />
                </button>
            </CustomMenu.Trigger>
            <CustomMenu.Dropdown>
                <AddToPlaylistOption track={track} />
                <CustomMenu.Item>Go to artist radio</CustomMenu.Item>
                <CustomMenu.Item
                // component="a"
                // href="https://support.spotify.com/vn-vi/content-policy-reporting/plain/?uri=spotify%3Aartist%3A3Wj34lTDJnPp70u4YCl4jz&platform=desktop-web"
                // target="_blank"
                // rel="noreferrer"
                // leftSection={<Augur size={16} />}
                // rightSection={<ExportSquare size={16} />}
                >
                    Report
                </CustomMenu.Item>
                <CustomMenu.Item
                // component="a"
                // href="spotify://"
                // leftSection={<Spotify size={16} variant="Bold" />}
                >
                    Open in Desktop app
                </CustomMenu.Item>
            </CustomMenu.Dropdown>
        </CustomMenu>
    );
};

export default TrackOptions;

interface AddToPlaylistOptionProps {
    track: SpotifyTrack;
}

const AddToPlaylistOption = ({ track }: AddToPlaylistOptionProps) => {
    const { data: playlists } = useCurrentUserPlaylist();
    const queryClient = useQueryClient();

    const handleCreatePlaylist = async () => {
        await PlaylistServices.createPlaylist(track.name, [track]).then(() => {
            queryClient.invalidateQueries(["currentUserPlaylist"]);
            notifications.show({
                message: "Playlist created successfully",
                color: "green",
            });
        });
    };

    const handleAddToPlaylist = async (playlistId: string) => {
        await PlaylistServices.addTracksToPlaylist(playlistId, [track])
            .then(() => {
                queryClient.invalidateQueries(["currentUserPlaylist"]);
                notifications.show({
                    message: "Track added to playlist successfully",
                    color: "green",
                });
            })
            .catch(() => {
                notifications.show({
                    message: "Failed to add track to playlist",
                    color: "red",
                });
            });
    };

    if (!playlists) return null;
    return (
        <CustomMenu>
            <CustomMenu.Trigger>
                <CustomMenu.Item
                // leftSection={<Add size={20} />}
                // rightSection={<ArrowRight2 size={20} />}
                >
                    Add to playlist
                </CustomMenu.Item>
            </CustomMenu.Trigger>
            <CustomMenu.Dropdown>
                <CustomMenu.Item>
                    <Input leftSection={<SearchNormal size={16} />} placeholder="Find a playlist" />
                </CustomMenu.Item>
                <CustomMenu.Item
                // leftSection={<Add size={20} />}
                // component="button"
                // onClick={handleCreatePlaylist}
                >
                    New playlist
                </CustomMenu.Item>
                {playlists.map((playlist) => (
                    <CustomMenu.Item
                        key={playlist.id}
                        // component="a"
                        // href={`spotify:playlist:${playlist.id}`}
                        // target="_blank"
                        // rel="noreferrer"
                        // onClick={(e) => {
                        //     e.preventDefault();
                        //     handleAddToPlaylist(playlist.id);
                        // }}
                    >
                        {playlist.name}
                    </CustomMenu.Item>
                ))}
            </CustomMenu.Dropdown>
        </CustomMenu>
    );
};
