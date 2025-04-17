import { useQuery } from "@tanstack/react-query";
import PlaylistServices from "../services/PlaylistServices";

export const useCurrentUserPlaylist = () => {
    return useQuery({
        queryKey: ["currentUserPlaylist"],
        queryFn: () => PlaylistServices.getCurrentUserPlaylist(),
    });
};

export const usePlaylist = (playlistId: string) => {
    return useQuery({
        queryKey: ["playlist", playlistId],
        queryFn: () => PlaylistServices.getPlaylist(playlistId),
    });
};
