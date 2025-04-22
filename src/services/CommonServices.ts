import { instance } from "../lib/axios";
import type { SpotifyAlbum, SpotifyPlaybackState } from "../types";

type PlayPrams =
    | {
          context_uri?: string;
          uris?: never;
      }
    | {
          context_uri?: never;
          uris?: string[];
      };

const CommonServices = {
    async getRecentlyPlayed(limit = 10, offset = 0) {
        const data = await instance
            .get("/me/player/recently-played", {
                params: {
                    limit,
                    offset,
                },
            })
            .then(({ data }) => data);
        return data;
    },
    async search({
        q = "",
        type = "artist",
        limit = 20,
        offset = 0,
    }: {
        q?: string;
        type: "album" | "artist" | "playlist" | "track" | "show" | "episode" | "audiobook";
        limit?: number;
        offset?: number;
    }) {
        const data = await instance
            .get("/search", {
                params: {
                    q,
                    type,
                    limit,
                    offset,
                },
            })
            .then(({ data }) => data);
        return data;
    },
    async getNowPlaying(): Promise<SpotifyPlaybackState> {
        const data = await instance.get("/me/player").then(({ data }) => data);
        return data;
    },
    async play({ context_uri, uris }: PlayPrams): Promise<void> {
        if (context_uri) {
            await instance.put("/me/player/play", {
                context_uri,
            });
            return;
        }
        await instance.put("/me/player/play", {
            uris,
        });
    },
    async getQueue() {
        const data = await instance.get("/me/player/queue").then(({ data }) => data);
        return data;
    },
};

export default CommonServices;
