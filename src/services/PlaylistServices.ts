import { instance } from "../lib/axios";
import type { SpotifyArtist, SpotifyPlaylist, SpotifyTrack } from "../types";
import UserServices from "./UserServices";

const PlaylistServices = {
    async getPlaylist({
        playlistId,
        withGenres = false,
    }: {
        playlistId: string;
        withGenres?: boolean;
    }): Promise<SpotifyPlaylist> {
        console.log("withGenres", withGenres);
        const data = await instance.get(`/playlists/${playlistId}`).then(async ({ data }) => {
            const ownerImages = await UserServices.getUser(data.owner.id).then(
                ({ images }) => images,
            );

            if (!withGenres) {
                console.log(withGenres);
                return {
                    ...data,
                    owner: {
                        ...data.owner,
                        images: ownerImages,
                    },
                };
            }

            // get all the artist ids from the tracks
            const artistIds: string[] = [];
            for (const item of data.tracks.items) {
                for (const artist of item.track.artists) {
                    if (!artistIds.includes(artist.id)) {
                        artistIds.push(artist.id);
                    }
                }
            }
            // get all the artists data
            const artists: SpotifyArtist[] = await instance
                .get("/artists", {
                    params: {
                        ids: artistIds.join(","),
                    },
                })
                .then(({ data }) => data.artists);
            const genres = artists.flatMap((artist) => [...artist.genres]);
            const genresCount: { [key: string]: number } = {};
            genres.forEach((genre) => {
                if (genresCount[genre]) {
                    genresCount[genre] += 1;
                } else {
                    genresCount[genre] = 1;
                }
            });

            return {
                ...data,
                genres: genresCount,
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
        return data;
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
