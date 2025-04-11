import { Loader } from "@mantine/core";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useRecentlyPlayed } from "../../hooks/useMedia";
import { getImage } from "../../utils";
import MediaCard from "../molecules/MediaCard";
import HomeSection from "../organisms/HomeSection";
import UnAuthHomePage from "./UnAuthHomePage";

function HomePage() {
    const { data, isLoading } = useCurrentUser();
    const {
        data: { items: recentlyPlayed } = { recentlyPlayed: [] },
    } = useRecentlyPlayed();

    if (isLoading)
        return (
            <div className="w-full h-full rounded-md p-3 bg-zinc-800/60 flex items-center justify-center">
                <Loader />
            </div>
        );
    if (!isLoading && !data) return <UnAuthHomePage />;

    return (
        <div className="p-3 bg-zinc-800/60 rounded-md space-y-4 overflow-y-scroll h-full">
            <HomeSection title="Recently played">
                {recentlyPlayed?.map((track, i) => (
                    <MediaCard
                        className="w-1/3"
                        key={i}
                        size="sm"
                        title={track.track.name}
                        imageSrc={getImage(300, track.track.album.images)}
                        subtitle="Artist"
                    />
                ))}
            </HomeSection>
            <HomeSection title="Recently played">
                {recentlyPlayed?.map((track, i) => (
                    <MediaCard
                        className="w-1/3"
                        key={i}
                        size="md"
                        title={track.track.name}
                        imageSrc={getImage(300, track.track.album.images)}
                        subtitle="Artist"
                    />
                ))}
            </HomeSection>
            <HomeSection title="Recently played">
                {recentlyPlayed?.map((_, i) => (
                    <MediaCard
                        className="w-1/3"
                        key={i}
                        size="md"
                        title="Artist"
                        subtitle="Artist"
                    />
                ))}
            </HomeSection>
            <HomeSection title="Recently played">
                {recentlyPlayed?.map((_, i) => (
                    <MediaCard
                        className="w-1/3"
                        key={i}
                        size="lg"
                        title="Artist"
                        subtitle="Artist"
                    />
                ))}
            </HomeSection>
        </div>
    );
}

export default HomePage;
