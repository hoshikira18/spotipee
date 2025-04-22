import { useRecentlyPlayed } from "../../hooks/useMedia";
import MediaCard from "../molecules/MediaCard";
import AuthWrapper from "../templates/AuthWrapper";

function HomePage() {
    const {
        data: { items: recentlyPlayed } = { recentlyPlayed: [] },
        isFetching: isRecentlyPlayedLoading,
    } = useRecentlyPlayed();

    console.log(recentlyPlayed);

    if (!recentlyPlayed) return null;

    return (
        <AuthWrapper>
            <div className="bg-zinc-900 h-full rounded-md font-spotify p-3">
                <div className="overflow-x-auto flex">
                    {recentlyPlayed?.map((item: any, index: number) => (
                        <MediaCard
                            key={index}
                            title={item.track.name}
                            imageSrc={item.track.album.images[0].url}
                        />
                    ))}
                </div>
            </div>
        </AuthWrapper>
    );
}

export default HomePage;
