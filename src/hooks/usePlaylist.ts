import { useQuery } from "@tanstack/react-query";
import PlaylistServices from "../services/PlaylistServices";

export const useCurrentUserPlaylist = () => {
    return useQuery({
        queryKey: ["currentUserPlaylist"],
        queryFn: () => PlaylistServices.getCurrentUserPlaylist(),
    });
};
