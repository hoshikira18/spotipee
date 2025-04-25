import { useParams } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";
import DetailSection from "../organisms/DetailSection";
import { useMemo } from "react";

function SearchDetail() {
    const { query } = useParams();
    const { data } = useSearch({
        q: query || "",
        type: ["album", "artist", "playlist", "track"],
        limit: 10,
        offset: 0,
    });

    const tracks = useMemo(
        () =>
            data?.tracks?.items?.map((item: any) => ({
                id: item?.id,
                uri: item?.uri,
                name: item?.name,
                images: item?.album?.images,
                artists: item?.artists,
            })),
        [data],
    );

    const playlists = useMemo(
        () =>
            data?.playlists?.items?.map((item: any) => ({
                id: item?.id,
                uri: item?.uri,
                name: item?.name,
                images: item?.images,
            })),
        [data],
    );

    const artists = useMemo(
        () =>
            data?.artists?.items?.map((item: any) => ({
                id: item?.id,
                uri: item?.uri,
                name: item?.name,
                images: item?.images,
            })),
        [data],
    );

    const albums = useMemo(
        () =>
            data?.albums?.items?.map((item: any) => ({
                id: item?.id,
                uri: item?.uri,
                name: item?.name,
                images: item?.images,
            })),
        [data],
    );

    console.log(playlists);

    return (
        <div className="space-y-8">
            <div className="relative h-80">
                <DetailSection
                    title="Songs"
                    seeAllLink={`/search/${query}/track`}
                    type="track"
                    data={tracks}
                    className="absolute inset-0"
                />
            </div>
            <div className="relative h-80">
                <DetailSection
                    title="Playlists"
                    seeAllLink={`/search/${query}/playlist`}
                    type="playlist"
                    data={playlists}
                    className="absolute inset-0"
                />
            </div>
            <div className="relative h-80">
                <DetailSection
                    title="Artists"
                    seeAllLink={`/search/${query}/artist`}
                    type="artist"
                    data={artists}
                    className="absolute inset-0"
                />
            </div>
            <div className="relative h-80">
                <DetailSection
                    title="Albums"
                    seeAllLink={`/search/${query}/album`}
                    type="album"
                    data={albums}
                    className="absolute inset-0"
                />
            </div>
        </div>
    );
}

export default SearchDetail;
