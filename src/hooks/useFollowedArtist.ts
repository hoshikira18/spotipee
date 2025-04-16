import { useQuery } from "@tanstack/react-query";
import UserServices from "../services/UserServices";

export const useFollowedArtists = () => {
    return useQuery({
        queryKey: ["followedArtists"],
        queryFn: () => UserServices.getFollowedArtists(),
    });
};
