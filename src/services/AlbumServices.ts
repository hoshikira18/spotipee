import { instance } from "../lib/axios";
import type { SpotifyAlbum } from "../types";

const AlbumServices = {
    async getAlbumById(id: string): Promise<SpotifyAlbum> {
        const data = await instance.get(`/albums/${id}`).then(async ({ data }) => {
            const owner = await instance
                .get(`/artists/${data.artists[0].id}`)
                .then(({ data }) => data);
            return {
                ...data,
                artists: [
                    {
                        ...data.artists[0],
                        images: owner.images,
                    },
                ],
            };
        });
        return data;
    },
};

export default AlbumServices;
