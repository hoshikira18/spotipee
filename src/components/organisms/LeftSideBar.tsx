import { Button } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { Add, Category2 } from "iconsax-react";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useFollowedArtists } from "../../hooks/useCurrentUser";
import ArtistCard from "../atoms/ArtistCard";

function LeftSideBar() {
    const { data: followedArtists, isLoading: isLoadingArtists } = useFollowedArtists();
    const { isAuth, isLoading } = useAuth(null);

    const { width } = useViewportSize();
    const [
        leftSideBarOpened,
        { toggle: leftSideBarToggle, close: leftSideBarClose, open: leftSideBarOpen },
    ] = useDisclosure(true);

    // Close the sidebar if the screen width is less than 768px
    useEffect(() => {
        if (width > 0 && width < 768) {
            leftSideBarClose();
        }
        if (width > 0 && width > 768) {
            leftSideBarOpen();
        }
    }, [width]);

    return (
        <div
            className={`${leftSideBarOpened ? "w-72" : "w-24"} h-full pl-3 py-3 space-y-4 bg-zinc-800/60 rounded-md transition-all duration-300`}
        >
            <div>
                {/* sidebar header */}
                <div className="inline-flex items-center space-x-2 px-2">
                    <button
                        type="button"
                        onClick={leftSideBarToggle}
                        className="min-w-12 h-12 flex items-center justify-center hover:text-green-600 transition-all duration-150"
                    >
                        <Category2 size={30} />
                    </button>
                    <span
                        className={`min-w-40 text-base font-medium font-spotify ${!leftSideBarOpened && "scale-0 invisible"} transition-all duration-300 origin-left`}
                    >
                        Your Library
                    </span>
                </div>

                {isAuth && !isLoading && (
                    <div className="inline-flex items-center space-x-2 px-2">
                        <button
                            type="button"
                            className="min-w-12 h-12 flex items-center justify-center bg-zinc-700 rounded-full"
                        >
                            <Add size={20} />
                        </button>
                        <span
                            className={`min-w-40 text-base font-medium font-spotify ${!leftSideBarOpened && "scale-0 invisible"} transition-all duration-300 origin-left`}
                        >
                            Create new playlist
                        </span>
                    </div>
                )}

                {!isAuth && !isLoading && (
                    <>
                        <div className="rounded-lg p-3 bg-zinc-700/50 space-y-2 mt-10">
                            <div className="font-semibold">Create your first playlist</div>
                            <span className="text-sm">It's easy, we'll help you.</span>
                            <Button mt={12}>Create playlist</Button>
                        </div>

                        <div className="rounded-lg p-3 bg-zinc-700/50 space-y-2 mt-10">
                            <div className="font-semibold">Let's find some podcasts to follow</div>
                            <div className="text-sm">We'll keep you updated on new episodes.</div>
                            <Button mt={12}>Browse podcasts</Button>
                        </div>
                    </>
                )}
            </div>

            {/* Playlist, Artists, Albums, Songs */}

            <div className="overflow-y-scroll h-full pb-24">
                {followedArtists?.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} sidebarOpened={leftSideBarOpened} />
                ))}
            </div>
        </div>
    );
}

export default LeftSideBar;
