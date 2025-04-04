import { SearchNormal } from "iconsax-react";
import { useEffect, useRef } from "react";

function SearchBar() {
    const ref = useRef<HTMLInputElement>(null);

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

    return (
        <div className="h-full bg-zinc-900 px-5 rounded-4xl hover:bg-zinc-800 focus-within:bg-zinc-800 cursor-text flex items-center justify-around transition-all duration-150 focus-within:outline-2 focus-within:outline-gray-50 font-spotify">
            <SearchNormal size={24} />
            <input
                ref={ref}
                className="bg-transparent px-3 outline-none font-medium text-gray-100"
                placeholder="What do you want to play?"
            />
        </div>
    );
}

export default SearchBar;
