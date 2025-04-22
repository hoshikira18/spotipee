import { useQuery } from "@tanstack/react-query";
import TrackServices from "../services/TrackServices";
import UserServices from "../services/UserServices";

export const useTrack = (trackId: string) => {
    return useQuery({
        queryKey: ["track", trackId],
        queryFn: () => TrackServices.getTrackById(trackId),
    });
};

export const useTopTracks = (limit = 10) => {
    return useQuery({
        queryKey: ["topTracks", limit],
        queryFn: () => TrackServices.getTopTracks(limit),
    });
};

export const useMadeForYou = () => {
    return useQuery({
        queryKey: ["madeForYou"],
        queryFn: () => UserServices.getMadeForYouPlaylists(),
    });
};
