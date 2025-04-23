import { useTopArtists } from "../../hooks/useArtist";
import { useRecentlyPlayed } from "../../hooks/useMedia";
import { useMadeForYou, useTopTracks } from "../../hooks/useTrack";
import MediaCard from "../molecules/MediaCard";
import HomeSection from "../organisms/HomeSection";
import AuthWrapper from "../templates/AuthWrapper";

function HomePage() {
    return (
        <AuthWrapper>
            <div className="relative bg-zinc-900 h-full rounded-md font-spotify overflow-y-scroll space-y-8">
                <PopularInVietnam />
                <TopArtists />
                <TopTracks />
                <RecentlyPlayed />
            </div>
        </AuthWrapper>
    );
}

export default HomePage;

const RecentlyPlayed = () => {
    const {
        data: { items: recentlyPlayed } = { recentlyPlayed: [] },
    } = useRecentlyPlayed();

    if (!recentlyPlayed) return null;
    return (
        <>
            <HomeSection title="Recently Listened">
                {recentlyPlayed?.map((item: any, index: number) => (
                    <MediaCard
                        size="sm"
                        key={index}
                        type="track"
                        uri={item.track.uri}
                        id={item.track.id}
                        title={item.track.name}
                        imageSrc={item.track.album.images[0].url}
                    />
                ))}
            </HomeSection>
        </>
    );
};

const TopArtists = () => {
    const { data: topArtists } = useTopArtists();

    return (
        <HomeSection title="Top Artists" className="h-72">
            {topArtists?.map((artist, index) => (
                <MediaCard
                    key={index}
                    type="artist"
                    id={artist.id}
                    uri={artist.uri}
                    title={artist.name}
                    imageSrc={artist.images[0].url}
                />
            ))}
        </HomeSection>
    );
};

const TopTracks = () => {
    const { data: topTracks } = useTopTracks();

    return (
        <HomeSection title="Top Tracks" className="h-72">
            {topTracks?.map((track, index) => (
                <MediaCard
                    key={index}
                    title={track.name}
                    id={track.id}
                    uri={track.uri || ""}
                    type="track"
                    imageSrc={track.album.images[0].url}
                />
            ))}
        </HomeSection>
    );
};

const PopularInVietnam = () => {
    const { data } = useMadeForYou();
    return (
        <HomeSection title="Popular in Vietnam" className="h-72">
            {data?.map((track, index) => (
                <MediaCard
                    key={index}
                    title={track.name}
                    id={track.id}
                    uri={track.uri || ""}
                    type="track"
                    imageSrc={track.album.images[0].url}
                />
            ))}
        </HomeSection>
    );
};
