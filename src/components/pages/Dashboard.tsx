import { Badge, Button, Select } from "@mantine/core";
import {
    createContext,
    type Dispatch,
    lazy,
    type SetStateAction,
    Suspense,
    useMemo,
    useState,
} from "react";
import { useCurrentUserPlaylist, usePlaylist } from "../../hooks/usePlaylist";
import { convertMillisecondsToMinutes } from "../../utils";
const TrackGenreChart = lazy(() => import("../organisms/DashboardCharts/TrackGenreChart"));
const TrackPopularityChart = lazy(
    () => import("../organisms/DashboardCharts/TrackPopularityChart"),
);
const ArtistsChart = lazy(() => import("../organisms/DashboardCharts/ArtistChart"));

type Context = {
    totalArtists: number;
    totalAlbums: number;
    totalTime: number;
    setTotalArtists: Dispatch<SetStateAction<number>>;
};

export const DashboardContext = createContext<Context>({
    totalArtists: 0,
    totalAlbums: 0,
    totalTime: 0,
    setTotalArtists: () => {},
});

function Dashboard() {
    const { data: playlists } = useCurrentUserPlaylist();
    const [chosenPlaylist, setChosenPlaylist] = useState<string>(playlists?.[1]?.id || "");
    const [totalArtists, setTotalArtists] = useState<number>(0);
    const { data: playlist } = usePlaylist(chosenPlaylist, true);

    const currentPlaylist = useMemo(
        () => playlists?.find((playlist) => playlist.id === chosenPlaylist),
        [chosenPlaylist, playlists],
    );
    const totalTracks = useMemo(() => currentPlaylist?.tracks.total, [chosenPlaylist, playlists]);
    const totalTime = useMemo(
        () =>
            playlist?.tracks.items.reduce((acc, item) => {
                return acc + item.track.duration_ms;
            }, 0),
        [playlist],
    );
    const totalAlbums = useMemo(() => {
        if (!playlist) return 0;
        const albums = new Set(playlist.tracks.items.map((item) => item.track.album.name));
        return albums.size;
    }, [playlist]);

    const contextValues = {
        totalArtists,
        setTotalArtists,
        totalAlbums: totalAlbums || 0,
        totalTime: totalTime || 0,
    };

    if (!playlists) return;
    return (
        <DashboardContext.Provider value={contextValues}>
            <div className="grid grid-cols-12 gap-3 bg-zinc-800">
                <div className="col-span-12 mb-20 flex items-end space-x-2 sticky top-15 p-3 bg-zinc-800 z-20">
                    <Select
                        label="Playlist"
                        placeholder="Pick value"
                        data={playlists?.map((playlist) => ({
                            value: playlist.id,
                            label: playlist.name,
                        }))}
                        value={chosenPlaylist}
                        onChange={(value) => setChosenPlaylist(value as string)}
                        allowDeselect={false}
                    />
                    <Button
                        onClick={() => {
                            const currentIndex = playlists.findIndex(
                                (playlist) => playlist.id === chosenPlaylist,
                            );
                            const nextIndex = (currentIndex + 1) % playlists.length;
                            setChosenPlaylist(playlists[nextIndex].id);
                        }}
                    >
                        Next Playlist
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="text-sm text-zinc-400">
                            <span>Total tracks: </span>
                            <Badge color="yellow" variant="light">
                                {totalTracks}
                            </Badge>
                        </div>
                        <div className="text-sm text-zinc-400">
                            <span>Total albums: </span>
                            <Badge color="yellow" variant="light">
                                {totalAlbums}
                            </Badge>
                        </div>
                        <div className="text-sm text-zinc-400">
                            <span>Total artists: </span>
                            <Badge color="yellow" variant="light">
                                {totalArtists}
                            </Badge>
                        </div>
                        <div className="text-sm text-zinc-400">
                            <span>Total time: </span>
                            <Badge color="yellow" variant="light">
                                {convertMillisecondsToMinutes(totalTime || 0)} (M:S)
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="col-span-6 px-20 xl:px-20">
                    <p className="font-semibold mb-10 text-center">
                        Chart 1: Artist Percentage Distribution in Playlist
                    </p>
                    <Suspense fallback={<div>Loading...</div>}>
                        <ArtistsChart playlistId={chosenPlaylist} />
                    </Suspense>
                </div>
                <div className="col-span-6 px-20 xl:px-20">
                    <p className="font-semibold mb-10 text-center">
                        Chart 2: Genre Percentage Distribution in Playlist
                    </p>
                    <Suspense fallback={<div>Loading...</div>}>
                        <TrackGenreChart playlistId={chosenPlaylist} />
                    </Suspense>
                </div>
                <div className="col-span-12 px-20 mt-20">
                    <p className="font-semibold mb-10 text-center">
                        Chart 3: Track Popularity Distribution in Playlist
                    </p>
                    <Suspense fallback={<div>Loading...</div>}>
                        <TrackPopularityChart playlistId={chosenPlaylist} />
                    </Suspense>
                </div>
                {/* <div className="col-span-6 px-20 mt-20">
                    <p className="font-semibold mb-10 text-center">
                        Chart 4: Track Popularity Distribution in Playlist
                    </p>
                    <TrackPopularityChart playlistId={chosenPlaylist} />
                </div> */}
            </div>
        </DashboardContext.Provider>
    );
}

export default Dashboard;
