import { createContext, useEffect, useState } from "react";
import type { SpotifyArtist, SpotifyPlaybackState } from "../types";
import CommonServices from "../services/CommonServices";
import PlaylistServices from "../services/PlaylistServices";
import AlbumServices from "../services/AlbumServices";
import ArtistServices from "../services/ArtistServices";
import TrackServices from "../services/TrackServices";
import { useRightSidebarStore } from "../store/rightSidebarStore";

type NowPlayingContextType = {
    type: string;
    data: SpotifyPlaybackState | null;
    name: string | null;
    id: string | null;
    albumImage: string | null;
    artists: SpotifyArtist[];
    track: any | null;
};

interface NowPlayingProviderProps {
    children: React.ReactNode;
}

export const NowPlayingContext = createContext<NowPlayingContextType | null>(null);

function NowPlayingProvider({ children }: NowPlayingProviderProps) {
    const [data, setData] = useState<SpotifyPlaybackState | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [type, setType] = useState<string>("track");
    const [id, setId] = useState<string | null>(null);
    const [albumImage, setAlbumImage] = useState<string | null>(null);
    const [artists, setArtists] = useState<SpotifyArtist[]>([]);
    const [track, setTrack] = useState<any | null>(null);

    const { key } = useRightSidebarStore();

    useEffect(() => {
        const fetchNowPlaying = async () => {
            console.log("fetching now playing");
            try {
                const data = await CommonServices.getNowPlaying();
                if (!data) return;

                setArtists(data?.item?.artists as SpotifyArtist[]);
                setTrack(data?.item);

                if (data?.context === null) {
                    setType("track");
                    setId(data?.item?.id as string);
                    const track = await TrackServices.getTrackById(data?.item?.id as string);
                    setName(track.name);
                    setAlbumImage(track.album.images[0].url);
                } else {
                    setType(data.context?.type as string);
                    setAlbumImage(data?.item?.album?.images[0]?.url as string);
                    if (data?.context?.type === "playlist") {
                        const playlist = await PlaylistServices.getPlaylist(
                            data?.context?.uri.split(":")[2],
                        );
                        setName(playlist.name);
                        setId(playlist.id);
                    } else if (data?.context?.type === "album") {
                        const album = await AlbumServices.getAlbumById(
                            data?.context?.uri.split(":")[2],
                        );
                        setName(album.name);
                        setId(album.id);
                    } else if (data?.context?.type === "artist") {
                        const artist = await ArtistServices.getOne(
                            data?.context?.uri.split(":")[2],
                        );
                        setName(artist.name);
                        setId(artist.id);
                    }
                }
                setData(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchNowPlaying();
    }, [key]);

    const contextValues: NowPlayingContextType = {
        type,
        data,
        name,
        id,
        albumImage,
        artists,
        track,
    };

    return (
        <NowPlayingContext.Provider value={contextValues}>{children}</NowPlayingContext.Provider>
    );
}

export default NowPlayingProvider;
