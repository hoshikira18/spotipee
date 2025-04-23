import { Link } from "react-router-dom";
import { Play } from "../atoms/icons";
import { cn } from "../../utils";
import type { Image } from "../../types";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface SidebarItemProps {
    id: string;
    name: string;
    type: "artist" | "playlist";
    images?: Image[];
    sidebarOpened?: boolean;
}

export default function SidebarItem({
    id,
    name,
    type,
    images,
    sidebarOpened = true,
}: SidebarItemProps) {
    const { data: currentUser } = useCurrentUser();

    return (
        <Link
            to={`/${type}/${id}`}
            className="group inline-flex items-center space-x-2 p-2 hover:bg-zinc-700/80 w-full rounded-md"
        >
            <button
                type="button"
                className="relative button min-w-12 h-12 flex items-center justify-center transition-all duration-150"
            >
                <img
                    src={images?.length ? images[0]?.url : ""}
                    alt={name}
                    className={cn("w-12 aspect-square object-cover", {
                        "rounded-full": type === "artist",
                        "rounded-md": type === "playlist",
                    })}
                />
                <span className="absolute invisible group-hover:visible hover:text-green-600 text-white">
                    <Play />
                </span>
            </button>
            <div
                className={`min-w-40 origin-left transition-all duration-300 ${!sidebarOpened && "scale-0 invisible"}`}
            >
                <div className="text-base font-spotify">{name}</div>
                <span className="text-sm font-spotify text-zinc-400">
                    {type === "artist" ? "Artist" : `Playlist • ${currentUser?.display_name}`}
                </span>
            </div>
        </Link>
    );
}
