import { instance } from "../lib/axios";
import type { SpotifyArtist, SpotifyTrack, User } from "../types";
import CommonServices from "./CommonServices";

const UserServices = {
    async getCurrentUser(): Promise<User> {
        try {
            const data = instance.get("/me").then(({ data }) => data);
            return data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
    async getUser(userId: string): Promise<User> {
        try {
            const data = instance.get(`/users/${userId}`).then(({ data }) => data);
            return data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    },

    async getFollowedArtists(): Promise<SpotifyArtist[]> {
        try {
            const data = instance
                .get("me/following", {
                    params: {
                        type: "artist",
                    },
                })
                .then(
                    ({
                        data: {
                            artists: { items },
                        },
                    }) => items,
                );
            return data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
    async saveTracks(ids: string[]): Promise<void> {
        await instance.put("/me/tracks", {
            ids,
        });
    },
    async getSavedTracks(): Promise<SpotifyTrack[]> {
        const data = await instance
            .get("/me/tracks", {
                params: {
                    limit: 50,
                },
            })
            .then(({ data: { items } }) => {
                const tracks = items.map(({ track }: { track: SpotifyTrack }) => track);
                return tracks;
            });
        return data;
    },
    async checkUserSavedTracks(ids: string[]): Promise<boolean[]> {
        const data = await instance
            .get("/me/tracks/contains", {
                params: {
                    ids: ids.join(","),
                },
            })
            .then(({ data }) => data);
        return data;
    },
    async removeTracks(ids: string[]): Promise<void> {
        await instance.delete("/me/tracks", {
            data: {
                ids,
            },
        });
    },
    async followArtist(artistId: string, type: "artist" | "user"): Promise<void> {
        await instance.put(`/me/following?ids=${artistId}&type=${type}`, {
            ids: [artistId],
            type,
        });
    },
    async unfollowArtist(artistId: string, type: "artist" | "user"): Promise<void> {
        await instance.delete(`/me/following?ids=${artistId}&type=${type}`);
    },
    async getMadeForYouPlaylists(): Promise<SpotifyTrack[]> {
        const data = CommonServices.search({
            q: "vietnamese music",
            type: "track",
            limit: 10,
        }).then((item) => item.tracks.items);
        return data;
    },
};

export default UserServices;
