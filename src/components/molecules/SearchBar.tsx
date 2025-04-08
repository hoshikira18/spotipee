import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { SearchNormal } from "iconsax-react";
import { useEffect, useRef } from "react";

function SearchBar() {
    const ref = useRef<HTMLInputElement>(null);
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
            // close();
        }
        if (width > 0 && width > 768) {
            open();
        }
    }, [width]);

    return (
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
                className={`${isSearchOpen ? "w-full" : "hidden"} min-w-24 truncate bg-transparent px-3 outline-none font-medium text-gray-100 placeholder-gray-300`}
                placeholder="What do you want to play?"
            />
        </div>
    );
}

export default SearchBar;
