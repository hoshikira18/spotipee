import { useDebouncedCallback, useDisclosure, useViewportSize } from "@mantine/hooks";
import { SearchNormal } from "iconsax-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

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
        handleSearch();
    }, [q]);

    return (
        <div className={twMerge("h-full flex items-center space-x-2", className)}>
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
                    className={`${isSearchOpen ? "w-full" : "hidden"} min-w-24 truncate bg-transparent px-3 outline-none font-medium text-gray-100 placeholder-gray-300`}
                    placeholder="What do you want to play?"
                    onChange={(e) => setQ(e.target.value)}
                />
            </div>
        </div>
    );
}

export default SearchBar;
