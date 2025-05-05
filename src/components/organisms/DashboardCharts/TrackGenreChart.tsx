import { useState, useEffect } from "react";
import { usePlaylist } from "../../../hooks/usePlaylist";
import type { ChartOptions, PlaylistGenres } from "../../../types";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";

const TrackGenreChart = ({ playlistId }: { playlistId: string }) => {
    const { data: playlist } = usePlaylist(playlistId, true);
    const [series, setSeries] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const chartOptions: ChartOptions["options"] = {
        chart: {
            id: "type-chart",
            type: "pie",
            width: 400,
        },
        legend: {
            position: "bottom",
        },
        labels: labels,
    };

    useEffect(() => {
        if (!playlist) return;
        const series = Object.values(playlist.genres as PlaylistGenres);
        const labels = Object.keys(playlist.genres as PlaylistGenres);
        setSeries(series);
        setLabels(labels);

        ApexCharts.exec("type-chart", "updateOptions", { labels: labels });
        ApexCharts.exec("type-chart", "updateSeries", series);
    }, [playlist, playlistId]);

    return (
        <div className="grid grid-cols-12 gap-3 mb-20">
            <div className="col-span-12">
                <Chart type="pie" series={[...series]} options={chartOptions} />
            </div>
        </div>
    );
};

export default TrackGenreChart;
