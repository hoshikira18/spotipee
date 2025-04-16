import { useContext } from "react";
import { ArtistDetailContext } from "../pages/ArtistDetailPage";

function FollowArtistButton() {
    const artistContext = useContext(ArtistDetailContext);
    if (!artistContext) {
        throw new Error("FollowArtistButton must be used within ArtistDetailContext");
    }
    const { isFollowing, handleChangeStatus } = artistContext;

    return (
        <button
            type="button"
            className="border-1 border-zinc-400 rounded-full px-4 py-1 hover:scale-105 active:scale-100 transition-all"
            onClick={handleChangeStatus}
        >
            <span className="text-sm font-[700] font-spotify text-white">
                {isFollowing ? "Following" : "Follow"}
            </span>
        </button>
    );
}

export default FollowArtistButton;
