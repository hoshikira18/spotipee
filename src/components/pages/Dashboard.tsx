import { Button, NativeSelect } from "@mantine/core";
import { createContext, type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { useCurrentUserPlaylist, usePlaylistTracks } from "../../hooks/usePlaylist";
import { convertMillisecondsToHours } from "../../utils";
import ArtistsChart from "../organisms/DashboardCharts/ArtistChart";
import ReleaseYearChart from "../organisms/DashboardCharts/ReleaseYearChart";
import TrackPopularityChart from "../organisms/DashboardCharts/TrackPopularityChart";
import TrackGenreChart from "../organisms/DashboardCharts/TrackGenreChart";
import LazyChart from "../organisms/DashboardCharts/LazyChart";
import type { PlaylistTrack } from "spotify-types";
import TopTracks from "../organisms/DashboardCharts/TopTracks";
import TopArtists from "../organisms/DashboardCharts/TopArtists";
import StatCard from "../molecules/StatCard";

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
            playlist?.items?.reduce((acc: number, item: PlaylistTrack) => {
                return acc + (item?.track?.duration_ms || 0);
            }, 0),
        [chosenPlaylist, playlist],
    );
    const totalAlbums = useMemo(() => {
        if (!playlist) return 0;
        const albums = new Set(
            playlist?.items?.map((item: PlaylistTrack) => item.track?.album?.name),
        );
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
            <div>
                <div className="grid grid-cols-12 gap-3 pb-20">
                    <div className="col-span-12 flex items-end space-x-2 sticky top-0 p-3 bg-zinc-800 z-20">
                        <NativeSelect
                            label="Playlist"
                            data={playlists?.map((playlist) => ({
                                value: playlist.id,
                                label: playlist.name,
                            }))}
                            value={chosenPlaylist}
                            onChange={(e) => setChosenPlaylist(e.target.value as string)}
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
                    </div>
                    <div className="col-span-12 grid grid-cols-6 gap-3 px-3 mb-20">
                        <StatCard total={`${totalTracks} tracks`} />
                        <StatCard total={`${totalAlbums} albums`} />
                        <StatCard total={`${totalArtists} artists`} />
                        <StatCard total={`${convertMillisecondsToHours(totalTime)}`} />
                        <StatCard total={`${totalTracks} tracks`} />
                    </div>
                    <div className="col-span-12 lg:col-span-6 xl:px-10">
                        <h2 className="font-semibold mb-10 text-center">
                            Chart 1: Artist Percentage Distribution in Playlist
                        </h2>
                        <LazyChart Component={ArtistsChart} playlistId={chosenPlaylist} />
                    </div>
                    <div className="col-span-12 lg:col-span-6 xl:px-10">
                        <h2 className="font-semibold mb-10 text-center">
                            Chart 2: Genre Percentage Distribution in Playlist
                        </h2>
                        <LazyChart Component={TrackGenreChart} playlistId={chosenPlaylist} />
                    </div>
                    <div className="col-span-12 lg:col-span-6 mt-20">
                        <LazyChart Component={TrackPopularityChart} playlistId={chosenPlaylist} />
                        <h2 className="font-semibold mb-10 text-center">
                            Chart 3: Track Popularity Distribution in Playlist
                        </h2>
                    </div>
                    <div className="col-span-12 lg:col-span-6 mt-20">
                        <LazyChart Component={ReleaseYearChart} playlistId={chosenPlaylist} />
                        <h2 className="font-semibold mb-10 text-center">
                            Chart 4: Track Release year Distribution in Playlist
                        </h2>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-6 mb-20">
                        <h2 className="font-semibold mb-5 text-center">Table 1: Your Top Tracks</h2>
                        <div className="border shadow-sm h-full">
                            <TopTracks />
                        </div>
                    </div>
                    <div className="col-span-6 mb-20">
                        <h2 className="font-semibold mb-5 text-center">
                            Table 2: Your Top Artists
                        </h2>
                        <div className="border shadow-sm h-full">
                            <TopArtists />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardContext.Provider>
    );
}

export default Dashboard;
