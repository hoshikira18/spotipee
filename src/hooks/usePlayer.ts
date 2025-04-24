import { useDebouncedCallback } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { instance } from "../lib/axios";
import type { SpotifyTrack } from "../types";
import TrackServices from "../services/TrackServices";

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: any;
    }
}

export const usePlayer = (token: string) => {
    const [player, setPlayer] = useState<any>(undefined);
    const [currentTrack, setTrack] = useState<any>(null);
    const [nextTrack, setNextTrack] = useState<SpotifyTrack[] | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);

    const [playbackState, setPlaybackState] = useState({
        isPaused: true,
        isShuffle: false,
        repeatMode: 0,
        volume: 0,
    });
    const progressRef = useRef({
        currentTime: 0,
        duration: 0,
    });

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
            volume: 0.5,
        });

        setPlayer(player);

        player.getVolume().then((volume: number) => {
            setPlaybackState((prevState) => ({
                ...prevState,
                volume: volume * 100,
            }));
        });

        // Playback status updates
        player.addListener("player_state_changed", (state: any) => {
            if (!state) {
                return;
            }

            try {
                const { paused, track_window, duration, position, shuffle, repeat_mode } = state;
                const { current_track, next_tracks } = track_window;
                setNextTrack(next_tracks);

                setTrack(current_track);
                setPlaybackState((state) => ({
                    ...state,
                    isPaused: paused,
                    isShuffle: shuffle,
                    repeatMode: repeat_mode,
                }));
                progressRef.current = {
                    currentTime: position,
                    duration: duration,
                };
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
    }, [token]);

    // Activate current device
    useEffect(() => {
        if (deviceId) {
            instance
                .put("me/player", {
                    device_ids: [deviceId],
                    play: false,
                })
                .then(() => {
                    console.log("Device is active and ready to play");
                })
                .catch((error) => {
                    console.error("Error activating device:", error);
                });
        }
    }, [deviceId]);

    useEffect(() => {
        const fetchCurrentTrack = async () => {
            await TrackServices.getCurrentPlayingTrack().then((res) => {
                setTrack(res);
            });
        };

        if (!currentTrack) {
            fetchCurrentTrack();
        }
    }, [currentTrack]);

    // Timer to update currentTime
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (!playbackState.isPaused) {
            interval = setInterval(() => {
                progressRef.current.currentTime = Math.min(
                    progressRef.current.currentTime + 1000,
                    progressRef.current.duration,
                );
            }, 1000);
        } else if (interval) {
            clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [playbackState.isPaused]);

    const togglePlay = async () => {
        await player?.togglePlay();
    };

    const seek = async (position: number) => {
        await player?.seek(position);
    };

    const skipToNext = async () => {
        await player?.nextTrack();
    };

    const skipToPrevious = async () => {
        await player?.previousTrack();
    };

    const handleToggleShuffle = async () => {
        await instance.put("/me/player/shuffle", null, {
            params: {
                state: !playbackState.isShuffle,
            },
        });
    };

    const handleToggleRepeat = async () => {
        const state =
            playbackState.repeatMode === 0
                ? "context"
                : playbackState.repeatMode === 1
                  ? "track"
                  : "off";
        await instance.put("/me/player/repeat", null, {
            params: {
                state,
            },
        });
    };

    const handleVolumeChange = useDebouncedCallback(async (volume: number) => {
        await instance
            .put("/me/player/volume", null, {
                params: {
                    volume_percent: volume,
                },
            })
            .then(() => {
                setPlaybackState((prevState) => ({
                    ...prevState,
                    volume: volume,
                }));
            });
    }, 100);

    return {
        player,
        currentTrack,
        nextTrack,
        playbackState,
        togglePlay,
        skipToNext,
        skipToPrevious,
        progress: progressRef.current,
        seek,
        handleToggleShuffle,
        handleToggleRepeat,
        handleVolumeChange,
    };
};
