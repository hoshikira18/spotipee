import { useContext, useEffect } from "react";
import { ExpandIcon, HideIcon, MoreIcon } from "../atoms/icons";
import { NowPlayingContext } from "../../contexts/NowPlayingContext";
import { Link } from "react-router-dom";
import CurrentTrackTitle from "./CurrentTrackTitle";
import SaveTrackButton from "../atoms/SaveTrackButton";
import ShareButton from "../atoms/ShareButton";
import { REDIRECT_URI } from "../../constants/auth";
import { PlayerContext } from "../../contexts/PlayerContext";
import QueueCard from "../atoms/QueueCard";
import { useRightSidebarStore } from "../../store/rightSidebarStore";
import type { SpotifyArtist } from "../../types";
import FollowArtistButton from "../atoms/FollowArtistButton";

function NowPlayingView() {
    const nowPlayingContext = useContext(NowPlayingContext);
    if (!nowPlayingContext) {
        throw new Error("NowPlayingView must be used within a NowPlayingProvider");
    }

    const { type, id, name, albumImage, artists, track, setKey } = nowPlayingContext;
    const setRightSidebarContentState = useRightSidebarStore((state) => state.setState);

    useEffect(() => {
        setKey((prev) => !prev);
    }, []);

    return (
        <div className="font-spotify h-full group overflow-y-scroll">
            {/* Header */}
            <div className="flex items-center justify-between py-2 px-4 sticky top-0 bg-zinc-900">
                <div className="flex space-x-3">
                    <button
                        type="button"
                        className="-translate-x-6 scale-0 group-hover:translate-x-0 group-hover:scale-100 transition-all text-zinc-300"
                        onClick={() => setRightSidebarContentState("off")}
                    >
                        <HideIcon size={20} />
                    </button>
                    <Link
                        to={`/${type}/${id}`}
                        className="-translate-x-6 group-hover:translate-x-0 transition-all text-lg line-clamp-1 hover:underline"
                    >
                        {name}
                    </Link>
                </div>
                <div className="flex items-center space-x-3 invisible group-hover:visible transition-all text-zinc-400">
                    <button type="button" className="p-3">
                        <MoreIcon size={20} />
                    </button>
                    <button type="button" className="p-3">
                        <ExpandIcon size={20} />
                    </button>
                </div>
            </div>
            <div className="px-4">
                <img
                    src={albumImage || ""}
                    alt={name || "album-image"}
                    className="w-full h-1/2 object-cover rounded-md"
                />
            </div>
            <div className="px-4 py-4 flex items-center justify-between space-x-2">
                <CurrentTrackTitle
                    id={track?.id as string}
                    name={track?.name}
                    size="lg"
                    artists={artists}
                />
                <div className="flex items-center space-x-3">
                    <ShareButton
                        content={`${REDIRECT_URI}/${type}/${track?.id}`}
                        className="group-hover:scale-100 group-hover:translate-x-0 scale-0 translate-x-10 transition-all"
                    />
                    <SaveTrackButton className="visible" size="lg" trackId={id as string} />
                </div>
            </div>
            <div className="px-4 py-2">
                <Artists artists={track?.artists} />
            </div>
            <div className="px-4 py-2">
                <NextInQueue />
            </div>
        </div>
    );
}

export default NowPlayingView;

const NextInQueue = () => {
    const playerContext = useContext(PlayerContext);
    if (!playerContext) {
        throw new Error("PlayerContext is not available");
    }
    const { nextTrack } = playerContext;

    if (!nextTrack?.length) return null;

    return (
        <div className="bg-zinc-800 p-4 rounded-md space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold">Next in queue</h4>
                <button type="button">
                    <span className="text-sm font-semibold">Open queue</span>
                </button>
            </div>
            <div>
                {nextTrack?.slice(0, 1).map((track) => (
                    <QueueCard key={track.id} track={track} />
                ))}
            </div>
        </div>
    );
};

const Artists = ({ artists }: { artists?: SpotifyArtist[] }) => {
    if (!artists?.length) return null;
    return (
        <div className="bg-zinc-800 p-4 rounded-md space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold">Credits</h4>
            </div>
            <div className="space-y-5">
                {artists?.map((artist) => (
                    <div key={artist.id} className="flex items-center justify-between">
                        <p>{artist.name}</p>
                        <FollowArtistButton artist={artist} />
                    </div>
                ))}
            </div>
        </div>
    );
};
