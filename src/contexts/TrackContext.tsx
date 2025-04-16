import { createContext, useEffect, useState } from "react";
import type { SpotifyTrack } from "../types";
import UserServices from "../services/UserServices";

export const TrackContext = createContext<{
    savedTracks: SpotifyTrack[];
    savedTracksCount: number;
    setSavedTracks: (tracks: SpotifyTrack[]) => void;
    setSavedTracksCount: (count: number) => void;
} | null>(null);

interface TrackProviderProps {
    children: React.ReactNode;
}

function TrackProvider({ children }: TrackProviderProps) {
    const [savedTracks, setSavedTracks] = useState<SpotifyTrack[]>([]);
    const [savedTracksCount, setSavedTracksCount] = useState(0);

    useEffect(() => {
        const fetchSavedTracks = async () => {
            try {
                const tracks = await UserServices.getSavedTracks();
                setSavedTracks(tracks);
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
    };
    return <TrackContext.Provider value={contextValues}>{children}</TrackContext.Provider>;
}

export default TrackProvider;
