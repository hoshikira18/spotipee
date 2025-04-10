import { Progress, Slider } from "@mantine/core";
import {
    Devices,
    Lyrics,
    Next,
    NowPlayingView,
    Play,
    Previous,
    Queue,
    Shuffe,
} from "../atoms/icons";
import Repeat from "../atoms/icons/Repeat";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: any;
    }
}
const track = {
    id: "3Dce2XbAZlQAFg2NWM2bb0",
    uri: "spotify:track:3Dce2XbAZlQAFg2NWM2bb0",
    type: "track",
    uid: "bab1bbfdbe6f19dfbe05",
    linked_from: {
        uri: null,
        id: null,
    },
    media_type: "audio",
    track_type: "audio",
    name: "Không Thể Cùng Nhau Suốt Kiếp",
    duration_ms: 300595,
    artists: [
        {
            name: "Hoà Minzy",
            uri: "spotify:artist:3BWBxpXDxofgji3RKZPIz8",
            url: "https://api.spotify.com/v1/artists/3BWBxpXDxofgji3RKZPIz8",
        },
        {
            name: "Mr.Siro",
            uri: "spotify:artist:35HU1GT1q797EwZsP8uduO",
            url: "https://api.spotify.com/v1/artists/35HU1GT1q797EwZsP8uduO",
        },
    ],
    album: {
        name: "Không Thể Cùng Nhau Suốt Kiếp",
        uri: "spotify:album:1GQtDQH7aPgxgo5BK0QeN8",
        images: [
            {
                url: "https://i.scdn.co/image/ab67616d0000b273eb667eeea7b8e2435878f56b",
                height: 640,
                width: 640,
                size: "UNKNOWN",
            },
            {
                url: "https://i.scdn.co/image/ab67616d00004851eb667eeea7b8e2435878f56b",
                height: 64,
                width: 64,
                size: "UNKNOWN",
            },
            {
                url: "https://i.scdn.co/image/ab67616d00001e02eb667eeea7b8e2435878f56b",
                height: 300,
                width: 300,
                size: "UNKNOWN",
            },
        ],
    },
    is_playable: true,
};

function Player() {
    const token = Cookies.get("access_token");
    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: "Web Playback SDK",
                getOAuthToken: (cb: any) => {
                    cb(token);
                },
                volume: 0.5,
            });
            console.log(player);

            setPlayer(player);

            player.addListener("ready", ({ device_id }: { device_id: string }) => {
                console.log("Ready with Device ID", device_id);
            });

            player.addListener("not_ready", ({ device_id }: { device_id: string }) => {
                console.log("Device ID has gone offline", device_id);
            });

            player.connect();

            player.addListener("player_state_changed", (state) => {
                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then((state) => {
                    !state ? setActive(false) : setActive(true);
                });
            });
        };
    }, []);

    return (
        <div className="h-full font-spotify flex items-center">
            <div className="w-1/3 h-full py-2 flex items-center space-x-3">
                <img
                    src="https://i.scdn.co/image/ab67616d00001e024a7655026a9e80a95afba515"
                    alt="song-img"
                    className="h-full rounded-md"
                />
                <div className="max-w-52">
                    <p className="line-clamp-1">Ôm em thật lâu</p>
                    <p className="text-sm text-zinc-400">Artist</p>
                </div>
            </div>
            <div className="w-1/3 space-y-4 px-2">
                <div className="flex items-center justify-center space-x-5">
                    <button type="button" className="hover:text-white text-zinc-200">
                        <Shuffe />
                    </button>
                    <button type="button" className="hover:text-white text-zinc-200">
                        <Previous />
                    </button>
                    <button
                        type="button"
                        className="p-1.5 bg-white text-black rounded-full hover:scale-105 active:scale-100 transition-all"
                        onClick={async () => await player?.resume()}
                    >
                        <Play />
                    </button>
                    <button type="button" className="hover:text-white text-zinc-200">
                        <Next />
                    </button>
                    <button type="button" className="hover:text-white text-zinc-200">
                        <Repeat />
                    </button>
                </div>
                <div className="">
                    <Slider color="blue" size="xs" showLabelOnHover={false} defaultValue={20} />
                </div>
            </div>
            <div className="w-1/3 flex items-center justify-end space-x-4">
                <button type="button" className="hover:text-white text-zinc-200">
                    <NowPlayingView />
                </button>
                <button type="button" className="hover:text-white text-zinc-200">
                    <Lyrics />
                </button>
                <button type="button" className="hover:text-white text-zinc-200">
                    <Queue />
                </button>
                <button type="button" className="hover:text-white text-zinc-200">
                    <Devices />
                </button>
            </div>
        </div>
    );
}

export default Player;
