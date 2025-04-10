import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const SpotifyPlayback = () => {
    const [player, setPlayer] = useState(null);
    const [isPaused, setIsPaused] = useState(true);
    const [deviceId, setDeviceId] = useState(null);

    console.log(deviceId);

    useEffect(() => {
        const scriptReady = () => {
            const spotifyPlayer = new window.Spotify.Player({
                name: "My React Player",
                getOAuthToken: (cb) => cb(Cookies.get("access_token")),
                volume: 0.5,
            });

            setPlayer(spotifyPlayer);

            spotifyPlayer.addListener("ready", ({ device_id }) => {
                console.log("Ready with Device ID", device_id);
                setDeviceId(device_id);
            });

            spotifyPlayer.addListener("not_ready", ({ device_id }) => {
                console.log("Device ID has gone offline", device_id);
            });

            spotifyPlayer.addListener("player_state_changed", (state) => {
                if (!state) return;
                setIsPaused(state.paused);
            });

            spotifyPlayer.connect();
        };

        if (window.Spotify) {
            scriptReady();
        } else {
            window.onSpotifyWebPlaybackSDKReady = scriptReady;
        }
    }, []);

    const play = async () => {
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            body: JSON.stringify({
                uris: ["spotify:track:3n3Ppam7vgaVa1iaRUc9Lp"], // Lose Yourself
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("access_token")}`,
            },
        });
    };

    const pause = () => {
        player?.pause();
    };

    const resume = () => {
        player?.resume();
    };

    return (
        <div className="p-4 bg-black text-white rounded-lg max-w-md mx-auto text-center">
            <h2 className="text-xl mb-2">Spotify Player</h2>
            <button
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-2"
                onClick={play}
            >
                Play
            </button>
            {isPaused ? (
                <button
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                    onClick={resume}
                >
                    Resume
                </button>
            ) : (
                <button
                    className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
                    onClick={pause}
                >
                    Pause
                </button>
            )}
        </div>
    );
};

export default SpotifyPlayback;
