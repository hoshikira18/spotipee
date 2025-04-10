import {
    Devices,
    Lyrics,
    Next,
    NowPlayingView,
    Pause,
    Play,
    Previous,
    Queue,
    Shuffe,
} from "../atoms/icons";
import Repeat from "../atoms/icons/Repeat";
import { usePlayer } from "../../hooks/usePlayer";
import SongProgress from "../molecules/SongProgress";

function Player() {
    const { isPaused, currentTrack, togglePlay } = usePlayer();

    return (
        <div className="h-full font-spotify flex items-center">
            <div className="w-1/3 h-full py-2 flex items-center space-x-3">
                <img
                    src={currentTrack?.album?.images[0]?.url || ""}
                    alt="song-img"
                    className="h-full rounded-md"
                />
                <div className="max-w-52">
                    <p className="line-clamp-1">{currentTrack?.name || "No Track Playing"}</p>
                    <p className="text-sm text-zinc-400">
                        {currentTrack?.artists?.map((artist: any) => artist.name).join(", ") || ""}
                    </p>
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
                        onClick={togglePlay}
                    >
                        {isPaused ? <Play /> : <Pause />}
                    </button>
                    <button type="button" className="hover:text-white text-zinc-200">
                        <Next />
                    </button>
                    <button type="button" className="hover:text-white text-zinc-200">
                        <Repeat />
                    </button>
                </div>
                <SongProgress />
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
