import { Badge, Button, Select } from "@mantine/core";
import { createContext, type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { useCurrentUserPlaylist, usePlaylistTracks } from "../../hooks/usePlaylist";
import { convertMillisecondsToMinutes } from "../../utils";
import ArtistsChart from "../organisms/DashboardCharts/ArtistChart";
import ReleaseYearChart from "../organisms/DashboardCharts/ReleaseYearChart";
import TrackPopularityChart from "../organisms/DashboardCharts/TrackPopularityChart";
import TrackGenreChart from "../organisms/DashboardCharts/TrackGenreChart";
import LazyChart from "../organisms/DashboardCharts/LazyChart";

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
    const [chosenPlaylist, setChosenPlaylist] = useState<string>(playlists?.[0]?.id || "");
    const [totalArtists, setTotalArtists] = useState<number>(0);
    const { data: playlist } = usePlaylistTracks(chosenPlaylist, true);

    const currentPlaylist = useMemo(
        () => playlists?.find((playlist) => playlist.id === chosenPlaylist),
        [chosenPlaylist, playlists],
    );
    const totalTracks = useMemo(() => currentPlaylist?.tracks.total, [chosenPlaylist, playlists]);
    const totalTime = useMemo(
        () =>
            playlist?.items?.reduce((acc, item) => {
                return acc + (item?.track?.duration_ms || 0);
            }, 0),
        [chosenPlaylist, playlist],
    );
    const totalAlbums = useMemo(() => {
        if (!playlist) return 0;
        const albums = new Set(playlist?.items?.map((item) => item.track?.album?.name));
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
                <div className="col-span-12 lg:col-span-6 px-20 xl:px-32">
                    <p className="font-semibold mb-10 text-center">
                        Chart 1: Artist Percentage Distribution in Playlist
                    </p>
                    <LazyChart Component={ArtistsChart} playlistId={chosenPlaylist} />
                </div>
                <div className="col-span-12 lg:col-span-6 px-20 xl:px-32">
                    <p className="font-semibold mb-10 text-center">
                        Chart 2: Genre Percentage Distribution in Playlist
                    </p>
                    <LazyChart Component={TrackGenreChart} playlistId={chosenPlaylist} />
                </div>
                <div className="col-span-12 lg:col-span-6 px-20 mt-20">
                    <LazyChart Component={TrackPopularityChart} playlistId={chosenPlaylist} />
                    <p className="font-semibold mb-10 text-center">
                        Chart 3: Track Popularity Distribution in Playlist
                    </p>
                </div>
                <div className="col-span-12 lg:col-span-6 px-20 mt-20">
                    <LazyChart Component={ReleaseYearChart} playlistId={chosenPlaylist} />
                    <p className="font-semibold mb-10 text-center">
                        Chart 4: Track Release year Distribution in Playlist
                    </p>
                </div>
            </div>
        </DashboardContext.Provider>
    );
}

export default Dashboard;
