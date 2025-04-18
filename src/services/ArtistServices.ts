import { instance } from "../lib/axios";
import type { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "../types";

const ArtistServices = {
    async getOne(artistId: string): Promise<SpotifyArtist> {
        const data = await instance.get(`/artists/${artistId}`).then(({ data }) => data);
        return data;
    },
    async getTopTracks(artistId: string): Promise<SpotifyTrack[]> {
        const tracks = await instance
            .get(`/artists/${artistId}/top-tracks`)
            .then(({ data }) => data.tracks);

        return tracks;
    },
    async getAlbums(artistId: string, limit = 10): Promise<SpotifyAlbum[]> {
        const data = await instance
            .get(`/artists/${artistId}/albums?limit=${limit}`)
            .then(({ data }) => data.items);
        return data;
    },
};

export default ArtistServices;
