import type { PlaylistTrack } from "spotify-types";
import { instance } from "../lib/axios";
import type { PlaylistTracks, SpotifyArtist, SpotifyPlaylist, SpotifyTrack } from "../types";
import UserServices from "./UserServices";

type GetPlaylistParams = {
    playlistId: string;
    withGenres?: boolean;
};
const PlaylistServices = {
    async getPlaylist({
        playlistId,
        withGenres = false,
    }: GetPlaylistParams): Promise<SpotifyPlaylist> {
        const data = await instance.get(`/playlists/${playlistId}`).then(async ({ data }) => {
            const ownerImages = await UserServices.getUser(data.owner.id).then(
                ({ images }) => images,
            );

            if (!withGenres) {
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
                        if (artistIds.length >= 50) break;
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
    async getPlaylistTracks(playlistId: string, withGenres: boolean): Promise<any> {
        let total = 0;
        const tracks: PlaylistTrack[] = [];
        let offset = 0;
        const limit = 100;

        // get all the tracks from the playlist
        do {
            const response = await instance.get(`/playlists/${playlistId}/tracks`, {
                params: { offset, limit },
            });
            const data = response.data;

            total = data.total;
            tracks.push(...data.items.map((item: any) => item));
            offset += limit;
        } while (tracks.length < total);

        // if request dont require genres, return without genres
        if (!withGenres) {
            return { total, href: "", items: tracks };
        }

        // get all the artist ids from the tracks (unique)
        const artistIds = Array.from(
            new Set(
                tracks.flatMap(
                    (item) =>
                        item.track?.artists
                            ?.map((artist: SpotifyArtist) => artist.id)
                            .filter((item: string) => item !== null) ?? [],
                ),
            ),
        );

        // helper to split array into chunks of 50
        function chunkArray<T>(array: T[], size: number): T[][] {
            const result: T[][] = [];
            for (let i = 0; i < array.length; i += size) {
                result.push(array.slice(i, i + size));
            }
            return result;
        }

        // fetch artists in batches of 50 (parallel requests)
        const artistChunks = chunkArray(artistIds, 50);
        const artistResponses = await Promise.all(
            artistChunks.map((chunk) =>
                instance.get("/artists", { params: { ids: chunk.join(",") } }),
            ),
        );
        const artists: SpotifyArtist[] = artistResponses.flatMap((res) => res.data.artists);

        // count genres
        const genres = artists.flatMap((artist) => artist.genres);
        const genresCount: { [key: string]: number } = {};
        genres.forEach((genre) => {
            genresCount[genre] = (genresCount[genre] || 0) + 1;
        });

        return {
            total,
            href: "",
            items: tracks,
            genres: genresCount,
        };
    },
};

export default PlaylistServices;
