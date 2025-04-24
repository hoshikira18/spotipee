import { useParams } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";
import { useMemo } from "react";
import MediaCard from "../molecules/MediaCard";

function SearchDetailWithTypePage() {
    const { query, type } = useParams();

    const { data } = useSearch({
        q: query || "",
        limit: 50,
        type: [type as "album" | "artist" | "playlist" | "track"],
    });

    const searchResults = useMemo(
        () =>
            data?.[`${type}s`]?.items.map((item: any) => ({
                id: item?.id,
                uri: item?.uri,
                name: item?.name,
                images: type === "track" ? item?.album?.images : item?.images,
            })),
        [data],
    );

    return (
        <div className="h-full">
            <div className="grid grid-cols-12 gap-2 px-7">
                {searchResults?.map((item: any) => (
                    <MediaCard
                        type={type as "album" | "artist" | "playlist" | "track"}
                        id={item.id}
                        uri={item.uri || ""}
                        key={item.id}
                        title={item.name}
                        imageSrc={item.images ? item.images[0]?.url : ""}
                        className="col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2 min-w-0 w-auto"
                    />
                ))}
            </div>
        </div>
    );
}

export default SearchDetailWithTypePage;
