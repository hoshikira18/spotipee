import { instance } from "../lib/axios";
import type { SpotifyPlaylist, SpotifyTrack } from "../types";

const PlaylistServices = {
    async getCurrentUserPlaylist(): Promise<SpotifyPlaylist[]> {
        const data = await instance.get("/me/playlists").then(({ data }) => data.items);
        return data;
    },
    async createPlaylist(name: string, tracks: SpotifyTrack[]) {
        const playlist: SpotifyPlaylist = await instance
            .post("/me/playlists", {
                name,
                public: true,
            })
            .then(({ data }) => data);
        await this.addTracksToPlaylist(playlist.id, tracks);
        return playlist;
    },
    async addTracksToPlaylist(playlistId: string, tracks: SpotifyTrack[]) {
        const data = await instance.post(`/playlists/${playlistId}/tracks`, {
            uris: tracks.map((track) => track.uri),
        });
        console.log(data);
    },
};

export default PlaylistServices;
