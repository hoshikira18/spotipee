import type { SpotifyTrack } from "../../types";
import SeeAllButton from "../atoms/SeeAllButton";
import MediaCard from "../molecules/MediaCard";

interface DetailSectionProps {
    title: string;
    seeAllLink: string;
    data: SpotifyTrack[];
    type: "album" | "playlist" | "artist" | "track";
}

function DetailSection({ title, type, seeAllLink, data }: DetailSectionProps) {
    const uniqueAlbums = Array.from(new Map(data.map((item) => [item.album.id, item])).values());

    return (
        <div className="px-5 mb-10">
            <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{title}</span>
                <SeeAllButton link={seeAllLink} title="Show all" />
            </div>
            <div className="flex overflow-x-scroll pb-5 mt-5">
                {uniqueAlbums.map((item) => (
                    <MediaCard
                        key={item.album.id}
                        id={item.album.id}
                        uri={item.album.uri}
                        type={type}
                        title={item.album.name}
                        imageSrc={item.album.images[1]?.url}
                    />
                ))}
            </div>
        </div>
    );
}

export default DetailSection;
