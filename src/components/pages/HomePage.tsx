import { Loader } from "@mantine/core";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useRecentlyPlayed } from "../../hooks/useMedia";
import MediaCard from "../molecules/MediaCard";
import UnAuthHomePage from "./UnAuthHomePage";

function HomePage() {
    const { data, isLoading } = useCurrentUser();
    const { data: recentlyPlayed } = useRecentlyPlayed();

    console.log(recentlyPlayed);

    if (isLoading)
        return (
            <div className="w-full h-full rounded-md p-3 bg-zinc-800/60 flex items-center justify-center">
                <Loader />
            </div>
        );
    if (!isLoading && !data) return <UnAuthHomePage />;
    return (
        <div className="w-full h-full bg-zinc-800/60 rounded-md p-3 ">
            <div className="grid grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <MediaCard key={i} size="md" title="Artist" subtitle="Artist" />
                ))}
            </div>
        </div>
    );
}

export default HomePage;
