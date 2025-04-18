import type { SpotifyAlbum } from "../../types";
import SeeAllButton from "../atoms/SeeAllButton";
import MediaCard from "../molecules/MediaCard";

interface DetailSectionProps {
    title: string;
    seeAllLink: string;
    data: SpotifyAlbum[];
}

function DetailSection({ title, seeAllLink, data }: DetailSectionProps) {
    return (
        <div className="px-5 mb-10">
            <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{title}</span>
                <SeeAllButton link={seeAllLink} title="Show all" />
            </div>
            <div className="flex overflow-x-scroll pb-5 mt-5">
                {data?.map((item) => (
                    <MediaCard key={item.id} title={item.name} imageSrc={item.images[1].url} />
                ))}
            </div>
        </div>
    );
}

export default DetailSection;
