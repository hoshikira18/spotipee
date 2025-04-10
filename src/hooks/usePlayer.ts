import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { instance } from "../lib/axios";

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: any;
    }
}

export const usePlayer = () => {
    const token = Cookies.get("access_token");
    const [player, setPlayer] = useState<any>(undefined);
    const [currentTrack, setTrack] = useState<any>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);

    const [isPaused, setIsPaused] = useState<boolean>(true);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const loadScript = () => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.defer = true;
        script.src = "https://sdk.scdn.co/spotify-player.js";
        document.body.appendChild(script);
    };

    const playerInit = () => {
        console.log("-- player init --");

        const player = new window.Spotify.Player({
            name: "Spotipee",
            getOAuthToken: (cb: any) => {
                cb(token);
            },
        });

        setPlayer(player);

        // Playback status updates
        player.addListener("player_state_changed", (state: any) => {
            if (!state) {
                return;
            }

            try {
                const { paused, track_window, duration, position } = state;
                const { current_track } = track_window;

                setTrack(current_track);
                setIsPaused(paused);
                setDuration(duration);
                setCurrentTime(position);
            } catch (error) {
                console.log(error);
            }
        });

        // Ready
        player.addListener("ready", ({ device_id }: { device_id: string }) => {
            console.log("Ready with Device ID", device_id);
            setDeviceId(device_id);
        });

        // Not Ready
        player.addListener("not_ready", ({ device_id }: { device_id: string }) => {
            console.log("Device ID has gone offline", device_id);
        });

        // Connect to the player
        player.connect();
    };

    useEffect(() => {
        loadScript();

        window.onSpotifyWebPlaybackSDKReady = () => playerInit();
    }, []);

    // Activate current device
    useEffect(() => {
        if (deviceId) {
            instance
                .put("me/player", {
                    device_ids: [deviceId],
                    play: true,
                })
                .then(() => {
                    console.log("Device is active and ready to play");
                })
                .catch((error) => {
                    console.error("Error activating device:", error);
                });
        }
    }, [deviceId]);

    // Timer to update currentTime
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (!isPaused) {
            interval = setInterval(() => {
                setCurrentTime((prevTime) => Math.min(prevTime + 1000, duration));
            }, 1000);
        } else if (interval) {
            clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPaused, duration]);

    const togglePlay = async () => {
        await player?.togglePlay();
    };

    return {
        player,
        currentTrack,
        togglePlay,
        isPaused,
        currentTime,
        duration,
    };
};
