import { instance } from "../lib/axios";
import type { SpotifyArtist, User } from "../types";

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
};

export default UserServices;
