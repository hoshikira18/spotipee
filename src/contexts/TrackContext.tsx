import { createContext, useEffect, useState } from "react";
import type { SpotifyTrack } from "../types";
import UserServices from "../services/UserServices";

export const TrackContext = createContext<{
    currentPlayingTrack: SpotifyTrack | null;
    setCurrentPlayingTrack: (track: SpotifyTrack | null) => void;
    savedTracks: string[];
    savedTracksCount: number;
    setSavedTracks: (tracks: string[]) => void;
    setSavedTracksCount: (count: number) => void;
} | null>(null);

interface TrackProviderProps {
    children: React.ReactNode;
}

function TrackProvider({ children }: TrackProviderProps) {
    const [currentPlayingTrack, setCurrentPlayingTrack] = useState<SpotifyTrack | null>(null);
    const [savedTracks, setSavedTracks] = useState<string[]>([]);
    const [savedTracksCount, setSavedTracksCount] = useState(0);

    useEffect(() => {
        const fetchSavedTracks = async () => {
            try {
                const tracks = await UserServices.getSavedTracks();
                setSavedTracks(tracks.map((track) => track.id));
                setSavedTracksCount(tracks.length);
            } catch (error) {
                console.error("Error fetching saved tracks:", error);
            }
        };

        fetchSavedTracks();
    }, []);

    const contextValues = {
        savedTracks,
        savedTracksCount,
        setSavedTracks,
        setSavedTracksCount,
        currentPlayingTrack,
        setCurrentPlayingTrack,
    };
    return <TrackContext.Provider value={contextValues}>{children}</TrackContext.Provider>;
}

export default TrackProvider;
