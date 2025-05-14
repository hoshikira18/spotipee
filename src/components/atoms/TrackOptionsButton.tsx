import { Input } from "@mantine/core";
import { SearchNormal } from "iconsax-react";
import { MoreIcon } from "./icons";
import { useCurrentUserPlaylist } from "../../hooks/usePlaylist";
import PlaylistServices from "../../services/PlaylistServices";
import type { SpotifyTrack } from "../../types";
import { useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import Menu from "../molecules/Menu/Menu";

interface TrackOptionsProps {
    track: SpotifyTrack;
}

const TrackOptions = ({ track }: TrackOptionsProps) => {
    return (
        <Menu position="left">
            <Menu.Trigger>
                <button type="button" className="text-zinc-400">
                    <MoreIcon size={24} />
                </button>
            </Menu.Trigger>
            <Menu.Dropdown>
                <AddToPlaylistOption track={track} />
                <Menu.Item>Go to artist radio</Menu.Item>
                <Menu.Item
                // component="a"
                // href="https://support.spotify.com/vn-vi/content-policy-reporting/plain/?uri=spotify%3Aartist%3A3Wj34lTDJnPp70u4YCl4jz&platform=desktop-web"
                // target="_blank"
                // rel="noreferrer"
                // leftSection={<Augur size={16} />}
                // rightSection={<ExportSquare size={16} />}
                >
                    Report
                </Menu.Item>
                <Menu.Item
                // component="a"
                // href="spotify://"
                // leftSection={<Spotify size={16} variant="Bold" />}
                >
                    Open in Desktop app
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
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
        <Menu position="left">
            <Menu.Trigger>
                <Menu.Item>
                    Add to playlist
                </Menu.Item>
            </Menu.Trigger>
            <Menu.Dropdown>
                <Menu.Item>
                    <Input leftSection={<SearchNormal size={16} />} placeholder="Find a playlist" />
                </Menu.Item>
                <Menu.Item
                // leftSection={<Add size={20} />}
                // component="button"
                // onClick={handleCreatePlaylist}
                >
                    New playlist
                </Menu.Item>
                {playlists.map((playlist) => (
                    <Menu.Item
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
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu >
    );
};
