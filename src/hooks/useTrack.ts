import { useQuery } from "@tanstack/react-query";
import TrackServices from "../services/TrackServices";

export const useTrack = (trackId: string) => {
    return useQuery({
        queryKey: ["track", trackId],
        queryFn: () => TrackServices.getTrackById(trackId),
    });
};
