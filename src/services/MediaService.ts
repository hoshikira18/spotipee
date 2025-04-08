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
};

export default MediaServices;
