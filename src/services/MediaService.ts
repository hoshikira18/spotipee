import { instance } from "../lib/axios";

const MediaServices = {
    async getRecentlyPlayed(limit = 10, offset = 0) {
        const data = await instance
            .get("/me/player/recently-played", {
                params: {
                    limit,
                    offset,
                },
            })
            .then(({ data }) => data);
        return data;
    },
    async search({
        q = "",
        type = "artist",
        limit = 20,
        offset = 0,
    }: {
        q?: string;
        type: "album" | "artist" | "playlist" | "track" | "show" | "episode" | "audiobook";
        limit?: number;
        offset?: number;
    }) {
        const data = await instance
            .get("/search", {
                params: {
                    q,
                    type,
                    limit,
                    offset,
                },
            })
            .then(({ data }) => data);
        return data;
    },
};

export default MediaServices;
