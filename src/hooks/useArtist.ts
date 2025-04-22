import { useQuery } from "@tanstack/react-query";
import ArtistServices from "../services/ArtistServices";

export const useArtist = (id: string) => {
    return useQuery({
        queryKey: ["artist", id],
        queryFn: () => ArtistServices.getOne(id),
        keepPreviousData: true,
    });
};

export const useArtistTopTracks = (id: string) => {
    return useQuery({
        queryKey: ["artistTopTracks", id],
        queryFn: () => ArtistServices.getTopTracks(id),
    });
};

export const useArtistAlbums = (id: string, limit = 4) => {
    return useQuery({
        queryKey: ["artistAlbums", id],
        queryFn: () => ArtistServices.getAlbums(id, limit),
    });
};

export const useTopArtists = (limit = 10) => {
    return useQuery({
        queryKey: ["topArtists", limit],
        queryFn: () => ArtistServices.getTopArtists(limit),
    });
};
