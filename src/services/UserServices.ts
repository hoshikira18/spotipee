import { instance } from "../lib/axios";
import type { SpotifyArtist, SpotifyTrack, User } from "../types";

const UserServices = {
    async getCurrentUser(): Promise<User> {
        try {
            const data = instance.get("/me").then(({ data }) => data);
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
    async getSavedTracks(): Promise<string[]> {
        const data = await instance
            .get("/me/tracks", {
                params: {
                    limit: 50,
                },
            })
            .then(({ data: { items } }) => {
                const ids = items.map(({ track }: { track: SpotifyTrack }) => track.id);
                return ids;
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
};

export default UserServices;
