import { useRef } from "react";
import { useElementScroll } from "../../hooks/useElementScroll";
import { cn } from "../../utils";
import MediaCard from "../molecules/MediaCard";
import { useTopArtists } from "../../hooks/useArtist";

function UserTopArtistsPage() {
    const { data: topArtists } = useTopArtists(50);
    const ref = useRef<HTMLDivElement>(null);
    const { top } = useElementScroll(ref);

    if (!topArtists) return null;
    return (
        <div ref={ref} className="h-full overflow-y-scroll bg-zinc-900 rounded-md relative">
            <div
                className={cn(
                    "sticky z-10 bg-zinc-900 top-0 right-0 left-0 pt-10 pb-2 flex items-center justify-between px-7",
                    top > 0 ? "shadow-2xl" : "",
                )}
            >
                <p className="text-2xl font-semibold hover:underline">Your Top Tracks</p>
            </div>
            <div className="grid grid-cols-12 gap-2 px-7">
                {topArtists?.map((item) => (
                    <MediaCard
                        type="artist"
                        id={item.id}
                        uri={item.uri || ""}
                        key={item.id}
                        title={item.name}
                        imageSrc={item.images[1]?.url}
                        className="col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2 min-w-0 w-auto"
                    />
                ))}
            </div>
        </div>
    );
}

export default UserTopArtistsPage;
