import { useQuery } from "@tanstack/react-query";
import AlbumServices from "../services/AlbumServices";

export const useAlbum = (albumId: string) => {
    return useQuery({
        queryKey: ["album", albumId],
        queryFn: () => AlbumServices.getAlbumById(albumId),
    });
};
