import { useRef } from "react";
import { useElementScroll } from "../../hooks/useElementScroll";
import { cn } from "../../utils";
import { Link, Outlet, useParams } from "react-router-dom";
import { Button } from "@mantine/core";

function SearchPageLayout() {
    const ref = useRef<HTMLDivElement>(null);
    const { top } = useElementScroll(ref);
    const { query, type } = useParams();

    const searchResultTypes = [
        { type: null, label: "All" },
        { type: "album", label: "Albums" },
        { type: "artist", label: "Artists" },
        { type: "playlist", label: "Playlists" },
        { type: "track", label: "Tracks" },
    ];

    return (
        <div ref={ref} className="bg-zinc-900 h-full rounded-md font-spotify overflow-y-scroll">
            <div
                className={cn(
                    "sticky z-10 bg-zinc-900 top-0 right-0 left-0 pt-10 pb-5 flex items-center justify-between px-7",
                    top > 0 ? "shadow-2xl" : "",
                )}
            >
                <div className="flex items-center space-x-2">
                    {searchResultTypes.map((item) => (
                        <Button
                            key={item.type}
                            variant={
                                type === item.type || (!type && !item.type)
                                    ? "filter-active"
                                    : "filter"
                            }
                            color={type === item.type ? "blue" : "gray"}
                            className="text-sm font-semibold"
                            component={Link}
                            to={`/search/${query}/${item.type ? item.type : ""}`}
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default SearchPageLayout;
