import { Button } from "@mantine/core";
import { useClickOutside, useDisclosure, useViewportSize } from "@mantine/hooks";
import { Add, Music, SearchNormal } from "iconsax-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useFollowedArtists } from "../../hooks/useCurrentUser";
import { useCurrentUserPlaylist } from "../../hooks/usePlaylist";
import SidebarItem from "../molecules/SidebarItem";
import { HideIcon } from "../atoms/icons";
import { cn } from "../../utils";

function LeftSideBar() {
    const { data: followedArtists } = useFollowedArtists();
    const { data: currentUserPlaylists } = useCurrentUserPlaylist();

    const { isAuth, isLoading } = useAuth(null);

    const { width } = useViewportSize();
    const [
        leftSideBarOpened,
        { toggle: leftSideBarToggle, close: leftSideBarClose, open: leftSideBarOpen },
    ] = useDisclosure(true);

    // Close the sidebar if the screen width is less than 768px
    useEffect(() => {
        if (width > 0 && width < 768 && isAuth) {
            leftSideBarClose();
        }
        if (width > 0 && width > 768) {
            leftSideBarOpen();
        }
    }, [width]);

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const ref = useClickOutside(() => setDropdownOpen(false));

    const [filter, setFilter] = useState<"all" | "playlist" | "artist">("all");
    const [searchInput, setSearchInput] = useState<string>("");

    const handleSearchInputChange = (input: string) => {
        setSearchInput(input);
    };

    const filteredPlaylists = currentUserPlaylists?.filter(
        (playlist) =>
            playlist.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            playlist.description.toLowerCase().includes(searchInput.toLowerCase()),
    );

    const filteredArtists = followedArtists?.filter((artist) =>
        artist.name.toLowerCase().includes(searchInput.toLowerCase()),
    );

    return (
        <div
            className={`${leftSideBarOpened ? "w-80 xl:w-96" : "w-24"} h-full pl-3 py-3 space-y-4 bg-zinc-800/60 rounded-md transition-all duration-300`}
        >
            <div className={cn(leftSideBarOpened && "flex items-center justify-between")}>
                {/* sidebar header */}
                <div className="inline-flex items-center space-x-2 px-2">
                    <button
                        type="button"
                        onClick={() => {
                            if (isAuth) {
                                leftSideBarToggle();
                            }
                        }}
                        className="min-w-12 h-12 flex items-center justify-center hover:text-green-600 transition-all duration-150"
                    >
                        <HideIcon size={20} />
                    </button>
                    <span
                        className={`min-w-40 font-medium font-spotify ${!leftSideBarOpened && "scale-0 invisible"} transition-all duration-300 origin-left`}
                    >
                        Your Library
                    </span>
                </div>

                {isAuth && !isLoading && (
                    <button
                        ref={ref}
                        type="button"
                        className="relative px-3 h-10 mx-3 flex items-center justify-center space-x-2 bg-zinc-800 rounded-full transition-all duration-150"
                        onClick={() => {
                            setDropdownOpen((prev) => !prev);
                        }}
                    >
                        <span
                            className={cn(
                                "transition-all duration-150",
                                isDropdownOpen ? "rotate-45" : "",
                            )}
                        >
                            <Add size={20} />
                        </span>
                        {leftSideBarOpened && <span className="text-sm">Create</span>}
                        {isDropdownOpen && <CreatePlaylistDropdown opened={isDropdownOpen} />}
                    </button>
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

            {/* Filter */}
            {leftSideBarOpened && (
                <div className="space-x-2 mt-2 ml-2 min-w-96">
                    {["all", "playlist", "artist"].map((item) => (
                        <Button
                            key={item}
                            variant={filter === item ? "filter-active" : "filter"}
                            size="compact-md"
                            fz={"sm"}
                            fw={500}
                            px={16}
                            onClick={() => setFilter(item as "all" | "playlist" | "artist")}
                        >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </Button>
                    ))}
                </div>
            )}

            {/* Sidebar items */}
            <SearchBox onChange={handleSearchInputChange} />
            {/* Playlist, Artists, Albums, Songs */}

            <div className="overflow-y-scroll h-full pb-32">
                {["playlist", "all"].includes(filter) &&
                    filteredPlaylists?.map((playlist) => (
                        <SidebarItem
                            key={playlist.id}
                            id={playlist.id}
                            name={playlist.name}
                            type="playlist"
                            images={playlist.images}
                            sidebarOpened={leftSideBarOpened}
                        />
                    ))}
                {["artist", "all"].includes(filter) &&
                    filteredArtists?.map((artist) => (
                        <SidebarItem
                            key={artist.id}
                            id={artist.id}
                            name={artist.name}
                            type="artist"
                            images={artist.images}
                            sidebarOpened={leftSideBarOpened}
                        />
                    ))}
            </div>
        </div>
    );
}

export default LeftSideBar;

const SearchBox = ({ onChange }: { onChange: (input: string) => void }) => {
    const [opened, setOpened] = useState<boolean>(false);
    const ref = useRef<HTMLInputElement>(null);

    return (
        <div
            className={cn(
                "inline-flex w-1/2 hover:bg-zinc-700/60 px-2 py-1 rounded items-center transition-all duration-150 focus-within:bg-zinc-700/60",
                !opened && "rounded-full w-auto",
            )}
        >
            <button
                type="button"
                onClick={() => {
                    setOpened((prev) => !prev);
                    ref.current?.focus();
                }}
            >
                <SearchNormal size={16} />
            </button>
            <input
                ref={ref}
                type="text"
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    "w-auto outline-none placeholder:text-xs translate-x-2 transition-all duration-150",
                    !opened && "w-0 -translate-x-10",
                )}
                style={{
                    fontSize: "0.875rem",
                }}
                placeholder="Search in Your Library"
                onBlur={() => setOpened(false)}
            />
        </div>
    );
};

interface DropdownProps {
    opened: boolean;
}

const CreatePlaylistDropdown = ({ opened }: DropdownProps) => {
    return (
        <div
            className={`absolute top-0 left-0 z-20 translate-y-12 w-96 rounded-md shadow-lg transition-all duration-150 bg-zinc-800 group ${
                opened ? "scale-100" : "scale-0 invisible"
            }`}
        >
            <div className="p-1">
                <button
                    type="button"
                    className="w-full px-3 py-2 text-sm text-white text-start hover:bg-zinc-700/70 rounded-md flex items-center space-x-2"
                >
                    <button
                        type="button"
                        className="p-3 bg-zinc-700/80 rounded-full group-hover:rotate-6 group-hover:scale-105 group-hover:text-green-600 transition-all duration-150"
                    >
                        <Music />
                    </button>
                    <div>
                        <p className="font-bold">Playlist</p>
                        <p className="text-sm text-zinc-400">
                            Build a playlist with songs, or episodes
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );
};
