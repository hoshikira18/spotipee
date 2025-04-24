import { useQuery } from "@tanstack/react-query";
import CommonServices from "../services/CommonServices";

type SearchParams = {
    q: string;
    type: Array<"album" | "artist" | "playlist" | "track" | "show" | "episode" | "audiobook">;
    limit?: number;
    offset?: number;
};
export const useSearch = ({ q, type, limit = 20, offset = 0 }: SearchParams) => {
    return useQuery({
        queryKey: ["search", q, type, limit, offset],
        queryFn: async () =>
            CommonServices.search({
                q,
                type,
                limit,
                offset,
            }),
    });
};
