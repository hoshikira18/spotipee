import { Select } from "@mantine/core";
import { createContext, useEffect, useState } from "react";
import { useCurrentUserPlaylist, usePlaylist, usePlaylistGenres } from "../../hooks/usePlaylist";
import Chart from "react-apexcharts";
import { PlaylistGenres, SpotifyPlaylist } from "../../types";

const DashboardContext = createContext(null);

function Dashboard() {
    const { data: playlists } = useCurrentUserPlaylist();
    const [chosenPlaylist, setChosenPlaylist] = useState<string>(playlists?.[0]?.id || "");

    return (
        <DashboardContext.Provider value={null}>
            <div className="grid grid-cols-12 gap-3">
                <div className="col-span-4 col-start-5 mb-20">
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
                </div>
                <div className="col-span-6 px-20 xl:px-20">
                    <ArtistsChart playlistId={chosenPlaylist} />
                </div>
                <div className="col-span-6 px-20 xl:px-20">
                    <TypesChart playlistId={chosenPlaylist} />
                </div>
                {/* <div className="col-span-6 px-20 mt-20"> <DemoBarChart />
                </div>
                <div className="col-span-6 px-20 mt-20">
                    <DemoBarChart />
                </div> */}
            </div>
        </DashboardContext.Provider>
    );
}

export default Dashboard;

const ArtistsChart = ({ playlistId }: { playlistId: string }) => {
    const { data: playlist } = usePlaylist(playlistId, true);
    const [series, setSeries] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);

    useEffect(() => {
        if (!playlist) return;

        // object to store the count of each artist
        const obj: { [key: string]: number } = {};

        // loop through the playlist tracks and count the number of times each artist appears
        for (const item of playlist.tracks.items) {
            for (const artist of item.track.artists) {
                if (artist) {
                    obj[artist.name] = (obj[artist.name] || 0) + 1;
                }
            }
        }

        /* 
            return {
                artist1: 5,
                artist2: 3,
                artist3: 2,
            }
        */

        const series = Object.values(obj);
        const labels = Object.keys(obj);
        setSeries(series);
        setLabels(labels);
    }, [playlist, playlistId]);

    return (
        <div key={JSON.stringify(series) + JSON.stringify(labels)}>
            <Chart
                type="pie"
                series={[...series]}
                options={{
                    chart: {
                        id: "pie-chart",
                        width: 380,
                        type: "pie",
                    },
                    labels: [...labels],
                }}
            />
        </div>
    );
};

const TypesChart = ({ playlistId }: { playlistId: string }) => {
    const { data: playlist } = usePlaylist(playlistId, true);
    const [series, setSeries] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);

    useEffect(() => {
        if (!playlist) return;
        const series = Object.values(playlist.genres as PlaylistGenres);
        const labels = Object.keys(playlist.genres as PlaylistGenres);
        setSeries(series);
        setLabels(labels);
    }, [playlist, playlistId]);

    return (
        <div key={JSON.stringify(series) + JSON.stringify(labels)}>
            <Chart
                type="pie"
                series={[...series]}
                options={{
                    chart: {
                        id: "pie-chart",
                        width: 380,
                        type: "pie",
                    },
                    labels: [...labels],
                }}
            />
        </div>
    );
};
