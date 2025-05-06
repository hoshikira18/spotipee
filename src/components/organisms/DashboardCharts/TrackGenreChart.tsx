import { useState, useEffect } from "react";
import { usePlaylistTracks } from "../../../hooks/usePlaylist";
import type { ChartOptions, PlaylistGenres } from "../../../types";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { ScrollArea } from "@mantine/core";
import ListBadge from "../../molecules/ListBadge";

const TrackGenreChart = ({ playlistId }: { playlistId: string }) => {
    const { data: playlist } = usePlaylistTracks(playlistId, true);
    const [series, setSeries] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [otherGenres, setOtherGenres] = useState<string[]>([]);
    const chartOptions: ChartOptions["options"] = {
        chart: {
            id: "type-chart",
            type: "pie",
            width: 400,
        },
        legend: {
            position: "bottom",
            labels: {
                colors: "#ccc",
            },
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

        merge(series, labels);
    }, [playlist, playlistId]);

    const merge = (series: number[], labels: string[]) => {
        const MAX_LABELS = 20;
        const THRESHOLD_ADJUSTMENT = series.length > 100 ? 5 : 0;

        if (series.length <= MAX_LABELS) {
            // No need to merge; just update chart directly
            ApexCharts.exec("type-chart", "updateOptions", { labels });
            ApexCharts.exec("type-chart", "updateSeries", series);
            setOtherGenres([]);
            return;
        }

        const total = series.reduce((sum, value) => sum + value, 0);
        const mean = total / series.length;
        const mergeThreshold = mean + THRESHOLD_ADJUSTMENT;

        const mergedSeries: number[] = [];
        const mergedLabels: string[] = [];
        let othersTotal = 0;
        const otherArtists: string[] = [];

        series.forEach((value, index) => {
            if (value <= mergeThreshold) {
                othersTotal += value;
                otherArtists.push(labels[index]);
            } else {
                mergedSeries.push(value);
                mergedLabels.push(labels[index]);
            }
        });

        const finalSeries = othersTotal > 0 ? [...mergedSeries, othersTotal] : [...series];
        const finalLabels =
            othersTotal > 0
                ? [...mergedLabels, `Appear <= ${Math.floor(mergeThreshold)}. Listed below`]
                : [...labels];

        setSeries(finalSeries);
        setLabels(finalLabels);
        setOtherGenres(otherArtists.length > 0 ? otherArtists : []);

        ApexCharts.exec("type-chart", "updateOptions", { labels: finalLabels });
        ApexCharts.exec("type-chart", "updateSeries", finalSeries);
    };

    return (
        <div className="grid grid-cols-12 gap-3 mb-20">
            <div className="col-span-12">
                <Chart type="pie" series={[...series]} options={chartOptions} />
            </div>
            <div className="col-span-12">
                {otherGenres.length > 0 && (
                    <ScrollArea h={250}>
                        <h2 className="mb-10">Other genres: </h2>
                        <ListBadge items={otherGenres} />
                    </ScrollArea>
                )}
            </div>
        </div>
    );
};

export default TrackGenreChart;
