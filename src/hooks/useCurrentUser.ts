import { useQuery } from "@tanstack/react-query";
import UserServices from "../services/UserServices";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: () => UserServices.getCurrentUser(),
    });
};

export const useFollowedArtists = () => {
    return useQuery({
        queryKey: ["followed-artists"],
        queryFn: () => UserServices.getFollowedArtists(),
    });
};
