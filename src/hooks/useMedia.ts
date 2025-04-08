import { useQuery } from "@tanstack/react-query";
import MediaServices from "../services/MediaService";

export const useRecentlyPlayed = () => {
    return useQuery({
        queryKey: ["recently-played"],
        queryFn: () => MediaServices.getRecentlyPlayed(),
    });
};
