import { useQuery } from "@tanstack/react-query";
import PlaylistServices from "../services/PlaylistServices";

export const useCurrentUserPlaylist = () => {
    return useQuery({
        queryKey: ["currentUserPlaylist"],
        queryFn: () => PlaylistServices.getCurrentUserPlaylist(),
    });
};

export const usePlaylist = (playlistId: string, withGenres: boolean) => {
    return useQuery({
        queryKey: ["playlist", playlistId, withGenres],
        queryFn: () => PlaylistServices.getPlaylist({ playlistId, withGenres }),
    });
};

export const usePlaylistTracks = (playlistId: string, withGenres: boolean) => {
    return useQuery({
        queryKey: ["playlistTracks", playlistId, withGenres],
        queryFn: () => PlaylistServices.getPlaylistTracks(playlistId, withGenres),
    });
};
