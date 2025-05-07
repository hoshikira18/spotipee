import type { Image, SpotifyArtist } from "../../types";
import { cn } from "../../utils";
import SeeAllButton from "../atoms/SeeAllButton";
import MediaCard from "../molecules/MediaCard";

interface DetailSectionProps {
    title: string;
    seeAllLink: string;
    data: {
        id: string;
        uri: string;
        name: string;
        images: Image[];
        artists?: SpotifyArtist[];
    }[];
    type: "album" | "playlist" | "artist" | "track";
    className?: string;
}

function DetailSection({ title, type, seeAllLink, data, className = "" }: DetailSectionProps) {
    return (
        <div className={cn("px-5 mb-10", className)}>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{title}</h2>
                <SeeAllButton link={seeAllLink} title="Show all" />
            </div>
            <div className="flex overflow-x-scroll pb-5 mt-5">
                {data?.map((item) => (
                    <MediaCard
                        key={item.id}
                        id={item.id}
                        uri={item.uri}
                        type={type}
                        artists={item?.artists}
                        title={item.name}
                        imageSrc={item?.images ? item?.images[0]?.url : ""}
                    />
                ))}
            </div>
        </div>
    );
}

export default DetailSection;
