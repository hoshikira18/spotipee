import { instance } from "../lib/axios";
import type { SpotifyPlaylist, SpotifyTrack } from "../types";
import UserServices from "./UserServices";

const PlaylistServices = {
    async getPlaylist(playlistId: string): Promise<SpotifyPlaylist> {
        const data = await instance.get(`/playlists/${playlistId}`).then(async ({ data }) => {
            const ownerImages = await UserServices.getUser(data.owner.id).then(
                ({ images }) => images,
            );

            return {
                ...data,
                owner: {
                    ...data.owner,
                    images: ownerImages,
                },
            };
        });

        return data;
    },
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
    async changePlaylistInfo(id: string, name?: string, description?: string) {
        const data = await instance.put(`/playlists/${id}`, {
            name,
            description,
        });
        return data;
    },
};

export default PlaylistServices;
