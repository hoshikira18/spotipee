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
