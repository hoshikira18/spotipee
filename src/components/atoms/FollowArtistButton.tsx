import { useEffect, useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import UserServices from "../../services/UserServices";
import type { SpotifyArtist } from "../../types";
import { useQueryClient } from "@tanstack/react-query";
import { useFollowedArtists } from "../../hooks/useCurrentUser";

interface FollowArtistButtonProps {
    artist: SpotifyArtist;
}

function FollowArtistButton({ artist }: FollowArtistButtonProps) {
    const queryClient = useQueryClient();
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChangeStatus = async () => {
        if (!artist) return;
        setIsLoading(true);
        if (isFollowing) {
            // Unfollow the artist
            await UserServices.unfollowArtist(artist.id, "artist")
                .then(() => {
                    setIsFollowing(false);
                    queryClient.invalidateQueries(["followed-artists"]);
                })
                .catch((error) => {
                    console.error("Error unfollowing artist:", error);
                });
            setIsLoading(false);
        } else {
            // Follow the artist
            await UserServices.followArtist(artist.id, "artist")
                .then(() => {
                    setIsFollowing(true);
                    queryClient.invalidateQueries(["followed-artists"]);
                })
                .catch((error) => {
                    console.error("Error following artist:", error);
                });
            setIsLoading(false);
        }
    };

    const { data: followedArtists } = useFollowedArtists();

    useEffect(() => {
        const isArtistFollowed = followedArtists?.some((a: { id: string }) => a.id === artist.id);
        setIsFollowing(isArtistFollowed || false);
    }, [followedArtists]);

    return (
        <button
            type="button"
            className="border-1 border-zinc-400 rounded-full px-4 py-1 hover:scale-105 active:scale-100 transition-all disabled:bg-zinc-600"
            onClick={handleChangeStatus}
            disabled={isLoading}
        >
            <span className="text-sm font-[700] font-spotify text-white">
                {isFollowing ? "Following" : "Follow"}
            </span>
        </button>
    );
}

export default FollowArtistButton;
