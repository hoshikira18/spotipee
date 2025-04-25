import {
    useClickOutside,
    useDebouncedCallback,
    useDisclosure,
    useViewportSize,
} from "@mantine/hooks";
import { SearchNormal } from "iconsax-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { cn } from "../../utils";
import { useSearchBarStore } from "../../store/searchBarStore";
import QueueCard from "../atoms/QueueCard";
import type { SpotifyArtist } from "../../types";
import { Button } from "@mantine/core";

interface SearchBarProps {
    className?: string;
    displayHomeButton?: boolean;
}

function SearchBar({ className = "", displayHomeButton = true }: SearchBarProps) {
    const ref = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [q, setQ] = useState("");
    const [isSearchOpen, { open, close, toggle }] = useDisclosure(true);
    const { width } = useViewportSize();
    const [mounted, setMounted] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "k") {
                e.preventDefault(); // prevent default focus on browser search bar
                ref.current?.focus();
            }
        };
        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    });

    useEffect(() => {
        if (width > 0 && width < 768) {
            close();
        }
        if (width > 0 && width > 768) {
            open();
        }
    }, [width]);

    const handleSearch = useDebouncedCallback(() => {
        navigate(`/search/${encodeURIComponent(q.trim())}`);
    }, 200);

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
            return;
        }
        handleSearch();
    }, [q]);

    const [opened, setOpened] = useState(false);
    const recentlySearchedBoxRef = useClickOutside(() => setOpened(false));

    return (
        <div className={twMerge("relative h-full flex items-center space-x-2", className)}>
            <div
                transition-all
                duration-200
                className={cn(
                    "absolute z-20 top-full translate-y-3 left-0 right-0 pl-16 transition-all duration-200 shadow-md",
                    opened ? "visible opacity-100" : "invisible opacity-0",
                )}
                ref={recentlySearchedBoxRef}
            >
                <RecentlySearched />
            </div>
            {displayHomeButton && (
                <Link
                    to={"/"}
                    className="p-3 bg-zinc-800 h-full aspect-square flex items-center justify-center rounded-full"
                >
                    <svg
                        fill="white"
                        data-encore-id="icon"
                        role="img"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                    >
                        <path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732l-7.5-4.33z" />
                    </svg>
                </Link>
            )}

            <div
                className={
                    "h-full w-full px-3 overflow-hidden bg-zinc-900 rounded-4xl hover:bg-zinc-800 focus-within:bg-zinc-800 flex items-center justify-around transition-all duration-150 focus-within:outline-2 focus-within:outline-gray-50 font-spotify"
                }
            >
                <button type="button" onClick={toggle}>
                    <SearchNormal size={24} />
                </button>
                <input
                    ref={ref}
                    value={q}
                    className={`${isSearchOpen ? "w-full" : "lg:w-full lg:block hidden"} min-w-24 truncate bg-transparent px-3 outline-none font-medium text-gray-100 placeholder-gray-300`}
                    placeholder="What do you want to play?"
                    onChange={(e) => setQ(e.target.value)}
                    onFocus={() => setOpened(true)}
                />
            </div>
        </div>
    );
}

export default SearchBar;

const RecentlySearched = () => {
    const { key } = useSearchBarStore();
    const [data, setData] = useState<
        | {
              id: string;
              type: "track" | "playlist" | "album" | "artist";
              name: string;
              artists?: SpotifyArtist[];
              image: string;
              uri: string;
          }[]
        | null
    >(null);

    useEffect(() => {
        const storedData = localStorage.getItem("recentlySearched");
        if (storedData) {
            setData(JSON.parse(storedData));
        }
    }, [key]);

    const handleClearHistory = () => {
        localStorage.removeItem("recentlySearched");
        setData([]);
    };

    if (!data || data.length === 0) return null;

    return (
        <div className="bg-zinc-800 rounded-lg max-h-96 overflow-y-scroll shadow-md">
            <h2 className="font-semibold text-gray-200 sticky top-0 bg-zinc-800 z-20 px-3 pt-3 pb-2">
                Recently Searched
            </h2>
            <ul className="mt-2 space-y-1 px-3 pb-3">
                {data?.map((item) => (
                    <QueueCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        image={item.image}
                        artists={item.artists || []}
                        type={item.type}
                        uri={item.uri}
                        isPlaying={false}
                        displayDeleteButton={true}
                    />
                ))}
            </ul>
            <div className="px-3 pb-3">
                <Button variant="outline" color="white" fz={"sm"} onClick={handleClearHistory}>
                    Clear recently searches
                </Button>
            </div>
        </div>
    );
};
