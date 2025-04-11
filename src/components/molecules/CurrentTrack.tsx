import { ExpandIcon, HideIcon, MoreIcon } from "../atoms/icons";

function CurrentTrack() {
    return (
        <div className="font-spotify group h-full px-4 pt-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                    <button
                        type="button"
                        className="-translate-x-6 scale-0 group-hover:translate-x-0 group-hover:scale-100 transition-all text-zinc-300"
                    >
                        <HideIcon />
                    </button>
                    <p className="-translate-x-6 group-hover:translate-x-0 transition-all">
                        Playlist name
                    </p>
                </div>
                <div className="flex items-center space-x-5 invisible group-hover:visible transition-all text-zinc-400">
                    <button type="button">
                        <MoreIcon />
                    </button>
                    <button type="button">
                        <ExpandIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CurrentTrack;
