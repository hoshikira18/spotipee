import { Link, useParams } from "react-router-dom";
import { useArtist } from "../../hooks/useArtist";
import { useEffect, useRef, useState } from "react";
import type { SpotifyArtist } from "../../types";
import CommonServices from "../../services/CommonServices";
import MediaCard from "../molecules/MediaCard";
import { useElementScroll } from "../../hooks/useElementScroll";
import { cn } from "../../utils";

function RelatedArtistPage() {
    const { artistId } = useParams();
    const { data: artist } = useArtist(artistId as string);
    const [relatedArtist, setRelatedArtist] = useState<SpotifyArtist[]>([]);

    const ARTIST_PER_PAGE = 40;
    useEffect(() => {
        const fetchRelatedArtists = async () => {
            const data = await CommonServices.search({
                q: artist?.genres.join(","),
                type: "artist",
                limit: ARTIST_PER_PAGE,
            }).then((res) => res.artists.items);
            setRelatedArtist(data);
        };
        fetchRelatedArtists();
    }, [artist]);
    const ref = useRef<HTMLDivElement>(null);
    const { top } = useElementScroll(ref);

    if (!relatedArtist) return null;
    return (
        <div ref={ref} className="h-full overflow-y-scroll bg-zinc-900 rounded-md relative">
            <div
                className={cn(
                    "sticky z-10 bg-zinc-900 top-0 right-0 left-0 pt-10 pb-2 flex items-center justify-between px-7",
                    top > 0 ? "shadow-2xl" : "",
                )}
            >
                <Link to={`/artist/${artistId}`} className="text-2xl font-semibold hover:underline">
                    Fans also like
                </Link>
            </div>
            <div className="grid grid-cols-12 gap-2 px-7 pb-10">
                {relatedArtist
                    ?.filter((item) => item.id !== artist?.id)
                    .map((item) => (
                        <MediaCard
                            key={item.id}
                            type="singer"
                            title={item.name}
                            imageSrc={item.images[1].url}
                            className="col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2 min-w-0 w-auto"
                        />
                    ))}
            </div>
        </div>
    );
}

export default RelatedArtistPage;
