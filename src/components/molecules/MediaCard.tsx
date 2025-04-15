import { cn } from "../../utils";
import { Play } from "../atoms/icons";
import { Skeleton } from "@mantine/core";

export interface MediaCardProps {
    type?: "singer" | "album" | "playlists";
    size?: "sm" | "md" | "lg";
    imageSrc?: string;
    title: string;
    subtitle?: string;
    onClick?: () => void;
    isLoading?: boolean;
    className?: string;
}

export default function MediaCard({
    type = "playlists",
    size = "md",
    imageSrc,
    title,
    subtitle,
    className = "",
    isLoading = false,
}: MediaCardProps) {
    const sizeClasses = {
        sm: {
            container: "p-2 space-y-1 min-w-32",
            title: "text-sm font-medium",
            subtitle: "text-xs",
        },
        md: {
            container: "p-3 space-y-2 min-w-48",
            title: "text-base font-medium",
            subtitle: "text-sm",
        },
        lg: {
            container: "p-4 space-y-3 min-w-64",
            title: "text-lg font-semibold",
            subtitle: "text-sm",
        },
    };

    if (isLoading) {
        return <MediaCardSkeleton />;
    }

    return (
        <div
            className={cn(
                "hover:bg-zinc-700/60 rounded-md transition-colors group font-spotify",
                sizeClasses[size].container,
                className,
            )}
        >
            <div className="relative aspect-square">
                <img
                    src={
                        imageSrc ||
                        "https://seed-mix-image.spotifycdn.com/v6/img/artist/7lq25uVNvzRoAJgr4CYr8e/en/default"
                    }
                    alt={title}
                    className={cn(
                        type === "singer" ? "rounded-full" : "rounded-md",
                        "w-full aspect-square object-cover",
                    )}
                />
                <button
                    type="button"
                    className="invisible absolute w-10 aspect-square -bottom-0 right-3 group-hover:bottom-3 group-hover:visible transition-all duration-75 ease-in-out bg-green-600 p-2 rounded-full flex items-center justify-center text-black shadow-md hover:scale-110 hover:shadow-lg active:scale-95"
                >
                    <Play />
                </button>
            </div>
            <div>
                <h3 className={sizeClasses[size].title}>{title}</h3>
                {subtitle && (
                    <span className={cn("text-zinc-400", sizeClasses[size].subtitle)}>
                        {subtitle}
                    </span>
                )}
            </div>
        </div>
    );
}

const MediaCardSkeleton = () => {
    return (
        <div className="p-3 space-y-2 min-w-48">
            <Skeleton height={192} width="100%" radius="md" />
            <div className="space-y-1">
                <Skeleton height={20} width="60%" radius="sm" />
                <Skeleton height={16} width="40%" radius="sm" />
            </div>
        </div>
    );
};
