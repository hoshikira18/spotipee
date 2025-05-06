import { ScrollArea, Badge, List } from "@mantine/core";
import { useContext, useState, useEffect, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { usePlaylistTracks } from "../../../hooks/usePlaylist";
import { DashboardContext } from "../../pages/Dashboard";
import type { ChartOptions } from "../../../types";
import ApexCharts from "apexcharts";
import ListBadge from "../../molecules/ListBadge";

const ArtistsChart = ({
    playlistId,
}: {
    playlistId: string;
}) => {
    const { setTotalArtists } = useContext(DashboardContext);
    // const { data: playlist, isFetching } = usePlaylist(playlistId, true);
    const { data: playlist, isFetching } = usePlaylistTracks(playlistId, true);
    const [series, setSeries] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [otherArtists, setOtherArtists] = useState<string[]>([]);

    const chartOptions: ChartOptions["options"] = {
        chart: {
            id: "pie-chart",
            type: "pie",
            width: 400,
        },
        legend: {
            show: true,
            position: "bottom",
        },
        labels: labels,
    };

    useEffect(() => {
        if (!playlist || isFetching) return;
        updateChart();
    }, [playlist, playlistId, isFetching]);

    const updateChart = () => {
        if (!playlist) return;

        // object to store the count of each artist
        const obj: { [key: string]: number } = {};

        // loop through the playlist tracks and count the number of times each artist appears
        for (const item of playlist.items) {
            for (const artist of item.track?.artists) {
                if (artist) {
                    obj[artist.name] = (obj[artist.name] || 0) + 1;
                }
            }
        }
        const series = Object.values(obj);
        const labels = Object.keys(obj);

        setSeries(series);
        setLabels(labels);
        setTotalArtists(series.length);

        // if the playlist has a huge number of artist then merge the rest into "others"
        merge(series, labels);
    };

    const merge = (series: number[], labels: string[]) => {
        const MAX_LABELS = 20;
        const THRESHOLD_ADJUSTMENT = series.length > 100 ? 5 : 0;

        if (series.length <= MAX_LABELS) {
            // No need to merge; just update chart directly
            ApexCharts.exec("pie-chart", "updateOptions", { labels });
            ApexCharts.exec("pie-chart", "updateSeries", series);
            setOtherArtists([]);
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
        setOtherArtists(otherArtists.length > 0 ? otherArtists : []);

        ApexCharts.exec("pie-chart", "updateOptions", { labels: finalLabels });
        ApexCharts.exec("pie-chart", "updateSeries", finalSeries);
    };

    return (
        <div className="grid grid-cols-12 gap-3 mb-20">
            <div className="col-span-12">
                <ReactApexChart type="pie" series={series} options={chartOptions} />
            </div>
            <div className="col-span-12">
                {otherArtists.length > 0 && (
                    <ScrollArea h={250}>
                        <h2 className="mb-10">Other artists: </h2>
                        <ListBadge items={otherArtists} />
                    </ScrollArea>
                )}
            </div>
        </div>
    );
};

export default ArtistsChart;
