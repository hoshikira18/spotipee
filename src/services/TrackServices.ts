import { instance } from "../lib/axios";
import type { SpotifyTrack } from "../types";

const TrackServices = {
    async play(trackIds: string[]): Promise<void> {
        await instance.put("/me/player/play", {
            uris: trackIds,
        });
    },
    async getTrackById(trackId: string): Promise<SpotifyTrack> {
        const response = await instance.get(`/tracks/${trackId}`).then(async ({ data }) => {
            const owner = await instance
                .get(`/artists/${data.artists[0].id}`)
                .then(({ data }) => data);
            return {
                ...data,
                artists: [
                    {
                        ...data.artists[0],
                        images: owner.images,
                    },
                ],
            };
        });
        return response;
    },
};

export default TrackServices;
