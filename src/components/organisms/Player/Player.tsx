import {
    Devices,
    Lyrics,
    Next,
    NowPlayingView,
    Pause,
    Play,
    Previous,
    Queue,
    RepeatOneIcon,
    Shuffe,
} from "../../atoms/icons";
import Repeat from "../../atoms/icons/Repeat";
import { Loader, Slider } from "@mantine/core";
import { useContext } from "react";
import styles from "./Player.module.css";
import { VolumeHigh } from "iconsax-react";
import { useDebouncedCallback } from "@mantine/hooks";
import { useRightSidebarStore } from "../../../store/rightSidebarStore";
import { PlayerContext } from "../../../contexts/PlayerContext";

function Player() {
    return (
        <div className="h-full font-spotify flex items-center">
            <CurrentSong />
            <PlayerControl />

            <PlayerFunction />
        </div>
    );
}

const CurrentSong = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        return null;
    }
    const { currentTrack } = context;

    return (
        <div className="w-1/3 h-full py-2 flex items-center space-x-3">
            {currentTrack ? (
                <>
                    <img
                        src={currentTrack?.album?.images[0]?.url || ""}
                        alt="song-img"
                        className="h-full rounded-md"
                    />
                    <div className="max-w-52">
                        <p className="line-clamp-1">{currentTrack?.name || "No Track Playing"}</p>
                        <p className="text-sm text-zinc-400">
                            {currentTrack?.artists?.map((artist: any) => artist.name).join(", ") ||
                                ""}
                        </p>
                    </div>
                </>
            ) : (
                <Loader />
            )}
        </div>
    );
};

const PlayerControl = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        return null;
    }

    const {
        playbackState,
        togglePlay,
        skipToNext,
        skipToPrevious,
        handleToggleShuffle,
        handleToggleRepeat,
    } = context;

    return (
        <div className="w-1/3 space-y-2 px-2">
            <div className="flex items-center justify-center space-x-5">
                <button
                    type="button"
                    className={` ${playbackState.isShuffle ? "text-green-600 hover:text-green-500" : "text-zinc-200 hover:text-white"} hover:scale-105`}
                    onClick={handleToggleShuffle}
                >
                    <Shuffe />
                </button>
                <button
                    type="button"
                    className="hover:text-white text-zinc-200"
                    onClick={skipToPrevious}
                >
                    <Previous />
                </button>
                <button
                    type="button"
                    className="p-1.5 bg-white text-black rounded-full hover:scale-105 active:scale-100 transition-all"
                    onClick={togglePlay}
                >
                    {playbackState.isPaused ? <Play /> : <Pause />}
                </button>
                <button
                    type="button"
                    className="hover:text-white text-zinc-200"
                    onClick={skipToNext}
                >
                    <Next />
                </button>
                <button
                    type="button"
                    className={` ${playbackState.repeatMode > 0 ? "text-green-600 hover:text-green-500" : "text-zinc-200 hover:text-white"} hover:scale-105`}
                    onClick={handleToggleRepeat}
                >
                    {playbackState.repeatMode === 1 || playbackState.repeatMode === 0 ? (
                        <Repeat />
                    ) : (
                        <RepeatOneIcon />
                    )}
                </button>
            </div>
            <SongProgress />
        </div>
    );
};

const SongProgress = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        return null;
    }
    const {
        playbackState: { currentTime, duration },
        seek,
    } = context;

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleSeek = useDebouncedCallback(async (value: number) => {
        const newPosition = (value / 100) * duration;
        seek(newPosition);
    }, 100);

    return (
        <div className="w-full flex items-center justify-between space-x-5">
            <span className="flex-none text-[12px]">{formatTime(currentTime)}</span>
            <div className="w-full">
                <Slider
                    color="blue"
                    size="xs"
                    showLabelOnHover={false}
                    value={Math.floor((currentTime / duration) * 100) || 0}
                    onChange={handleSeek}
                    classNames={styles}
                />
            </div>
            <span className="flex-none text-[12px]">{formatTime(duration)}</span>
        </div>
    );
};

const PlayerFunction = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        return null;
    }
    const {
        playbackState: { volume },
        handleVolumeChange,
    } = context;

    // function to change right sidebar content state
    const setRightSidebarContentState = useRightSidebarStore((state) => state.setState);

    return (
        <div className="w-1/3 flex items-center justify-end space-x-4">
            <button
                type="button"
                className="hover:text-white text-zinc-200"
                onClick={() => setRightSidebarContentState("current-track")}
            >
                <NowPlayingView />
            </button>
            <button type="button" className="hover:text-white text-zinc-200">
                <Lyrics />
            </button>
            <button
                type="button"
                className="hover:text-white text-zinc-200"
                onClick={() => setRightSidebarContentState("queue")}
            >
                <Queue />
            </button>
            <button
                type="button"
                className="hover:text-white text-zinc-200"
                onClick={() => setRightSidebarContentState("devices")}
            >
                <Devices />
            </button>
            <div className="w-1/3 flex items-center justify-end space-x-2">
                <VolumeHigh />
                <Slider
                    color="blue"
                    size="xs"
                    showLabelOnHover={false}
                    value={volume}
                    className="w-full"
                    classNames={styles}
                    onChange={handleVolumeChange}
                />
            </div>
        </div>
    );
};

export default Player;
