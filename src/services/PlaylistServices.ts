import { instance } from "../lib/axios";
import type { SpotifyPlaylist } from "../types";

const PlaylistServices = {
    async getCurrentUserPlaylist(): Promise<SpotifyPlaylist[]> {
        const data = await instance.get("/me/playlists").then(({ data }) => data.items);
        return data;
    },
};

export default PlaylistServices;
