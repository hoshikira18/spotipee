import { ScrollArea, Badge } from "@mantine/core";
import { useContext, useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { usePlaylist } from "../../../hooks/usePlaylist";
import { DashboardContext } from "../../pages/Dashboard";
import type { ChartOptions } from "../../../types";
import ApexCharts from "apexcharts";

const ArtistsChart = ({
    playlistId,
}: {
    playlistId: string;
}) => {
    const { setTotalArtists } = useContext(DashboardContext);
    const { data: playlist, isFetching } = usePlaylist(playlistId, true);
    const [series, setSeries] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [otherArtists, setOtherArtists] = useState<string[]>([]);

    const chartOptions: ChartOptions["options"] = {
        chart: {
            id: "pie-chart",
            type: "pie",
            width: 400,
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
        for (const item of playlist.tracks.items) {
            for (const artist of item.track.artists) {
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

        merge(series, labels);
    };

    const merge = (series: number[], labels: string[]) => {
        // if the playlist has a huge of artist (> 20) then merge the rest into "others"
        if (series.length > 20) {
            const newSeries: number[] = [];
            const newLabels: string[] = [];

            // calculate mean(avg) of series
            const totalSeries = series.reduce((a, b) => a + b, 0);
            const mean = totalSeries / series.length;

            // group series that has value <= mean
            let totalOthers = 0;
            const otherArtistsName: string[] = [];
            series.forEach((item, index) => {
                if (item <= mean) {
                    totalOthers += item;
                    otherArtistsName.push(labels[index]);
                } else {
                    newSeries.push(item);
                    newLabels.push(labels[index]);
                }
            });

            // append label to other artists
            const finalSeries = totalOthers > 0 ? [...newSeries, totalOthers] : series;
            const finalLabels =
                otherArtistsName.length > 0
                    ? [...newLabels, `Appear <= ${Math.floor(mean)}. Listed below`]
                    : labels;
            setSeries(finalSeries);
            setLabels(finalLabels);
            setOtherArtists(otherArtistsName.length > 0 ? otherArtistsName : []);

            ApexCharts.exec("pie-chart", "updateOptions", {
                labels: finalLabels,
            });
            ApexCharts.exec("pie-chart", "updateSeries", finalSeries);
        } else {
            ApexCharts.exec("pie-chart", "updateOptions", { labels: labels });
            ApexCharts.exec("pie-chart", "updateSeries", series);
            setOtherArtists([]);
        }
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
                        <div className="grid grid-cols-4 gap-4">
                            {otherArtists?.map((artist) => (
                                <Badge variant="light" key={artist}>
                                    <span className="hover:underline">{artist}</span>
                                </Badge>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </div>
    );
};

export default ArtistsChart;
