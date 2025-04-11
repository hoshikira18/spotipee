import { instance } from "../lib/axios";

const TrackServices = {
    async play(trackIds: string[]): Promise<void> {
        await instance.put("/me/player/play", {
            uris: trackIds,
        });
    },
};

export default TrackServices;
