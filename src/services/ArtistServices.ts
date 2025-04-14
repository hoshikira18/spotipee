import { instance } from "../lib/axios";
import type { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "../types";
import UserServices from "./UserServices";

const ArtistServices = {
    async getOne(artistId: string): Promise<SpotifyArtist> {
        const data = await instance.get(`/artists/${artistId}`).then(({ data }) => data);
        return data;
    },
    async getTopTracks(artistId: string): Promise<SpotifyTrack[]> {
        const tracks = await instance
            .get(`/artists/${artistId}/top-tracks`)
            .then(({ data }) => data.tracks) as SpotifyTrack[];

        const data = await UserServices.checkUserSavedTracks(tracks.map(({ id }) => id))
            .then((savedTracks) => {
                console.log(savedTracks)
                return tracks.map((track, index) => ({
                    ...track,
                    isSaved: savedTracks[index],
                }));
            });
        return data;
    },
    async getAlbums(artistId: string, limit = 4): Promise<SpotifyAlbum[]> {
        const data = await instance
            .get(`/artists/${artistId}/albums?limit=${limit}`)
            .then(({ data }) => data.items);
        return data;
    },
};

export default ArtistServices;
