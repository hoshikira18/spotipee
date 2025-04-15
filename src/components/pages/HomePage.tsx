import { useRecentlyPlayed } from "../../hooks/useMedia";
import { getImage } from "../../utils";
import MediaCard from "../molecules/MediaCard";
import HomeSection from "../organisms/HomeSection";
import type { SpotifyTrack } from "../../types";
import AuthWrapper from "../templates/AuthWrapper";

function HomePage() {
    const {
        data: { items: recentlyPlayed } = { recentlyPlayed: [] },
        isFetching: isRecentlyPlayedLoading,
    } = useRecentlyPlayed();

    return (
        <AuthWrapper>
            <div className="p-3 bg-zinc-800/60 rounded-md space-y-4 overflow-y-scroll h-full">
                <HomeSection title="Recently played">
                    {recentlyPlayed?.map((track: { track: SpotifyTrack }, i: number) => (
                        <MediaCard
                            isLoading={isRecentlyPlayedLoading}
                            className="w-1/3"
                            key={i}
                            size="sm"
                            title={track.track.name}
                            imageSrc={getImage(300, track.track.album.images)}
                            subtitle="Artist"
                        />
                    ))}
                </HomeSection>
            </div>
        </AuthWrapper>
    );
}

export default HomePage;
