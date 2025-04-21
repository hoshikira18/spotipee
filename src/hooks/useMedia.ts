import { useQuery } from "@tanstack/react-query";
import CommonServices from "../services/CommonServices";

export const useRecentlyPlayed = () => {
    return useQuery({
        queryKey: ["recently-played"],
        queryFn: () => CommonServices.getRecentlyPlayed(),
    });
};
