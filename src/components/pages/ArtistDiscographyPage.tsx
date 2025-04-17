import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useArtistAlbums, useArtistTopTracks } from "../../hooks/useArtist";
import MediaCard from "../molecules/MediaCard";
import { Select } from "@mantine/core";

function ArtistDiscographyPage() {
    const { artistId } = useParams();
    const { data: topTracks } = useArtistAlbums(artistId as string, 50);
    const [filter, setFilter] = useState<"single" | "album" | "all">("all");

    const handleFilterChange = (newFilter: "single" | "album" | "all") => {
        setFilter(newFilter);
    };

    const filteredData = topTracks?.filter(
        (track) => filter === "all" || track.album_type === filter,
    );

    return (
        <div className="h-full overflow-y-scroll bg-zinc-900 rounded-md px-7 relative">
            <div className="sticky z-10 bg-zinc-900 inset-0 pt-10 pb-2 shadow-2xl flex items-center justify-between">
                <Link to={`/artist/${artistId}`} className="text-2xl font-semibold hover:underline">
                    Discography
                </Link>
                <div></div>
            </div>
            <div className="grid grid-cols-12 gap-4">
                {filteredData?.map((item) => (
                    <MediaCard
                        key={item.id}
                        title={item.name}
                        imageSrc={item.images[1].url}
                        className="col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2"
                    />
                ))}
            </div>
        </div>
    );
}

export default ArtistDiscographyPage;
