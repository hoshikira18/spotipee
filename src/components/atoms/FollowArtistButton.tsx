import { useEffect, useState } from "react";
import { useFollowedArtists } from "../../hooks/useCurrentUser";
import UserServices from "../../services/UserServices";
import { useQueryClient } from "@tanstack/react-query";

interface FollowButtonProps {
    artistId: string | undefined;
    className?: string;
}

function FollowArtistButton({ artistId }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(false);
    const { data: followedArtists } = useFollowedArtists();

    useEffect(() => {
        const isArtistFollowed = followedArtists?.some(
            (artist: { id: string }) => artist.id === artistId,
        );
        setIsFollowing(isArtistFollowed || false);
    }, [followedArtists]);
    const queryClient = useQueryClient();

    if (!artistId || !followedArtists) return null;

    const handleChangeStatus = async () => {
        if (isFollowing) {
            // Unfollow the artist
            await UserServices.unfollowArtist(artistId, "artist")
                .then(() => {
                    setIsFollowing(false);
                    queryClient.invalidateQueries(["followed-artists"]);
                })
                .catch((error) => {
                    console.error("Error unfollowing artist:", error);
                });
        } else {
            // Follow the artist
            await UserServices.followArtist(artistId, "artist")
                .then(() => {
                    setIsFollowing(true);
                    queryClient.invalidateQueries(["followed-artists"]);
                })
                .catch((error) => {
                    console.error("Error following artist:", error);
                });
        }
    };

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
