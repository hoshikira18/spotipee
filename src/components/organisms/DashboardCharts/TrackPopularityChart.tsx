import { useEffect, useState } from "react";
import { usePlaylist } from "../../../hooks/usePlaylist";
import type { ChartOptions } from "../../../types";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { countBins } from "../../../utils";
import { Select } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";

interface TrackPopularityChartProps {
    playlistId: string;
}

const TrackPopularityChart = ({ playlistId }: TrackPopularityChartProps) => {
    const { data: playlist } = usePlaylist(playlistId, true);
    const [step, setStep] = useState<number>(20);

    const [state, setState] = useState<ChartOptions>({
        series: [
            {
                data: [],
            },
        ],
        options: {
            chart: {
                id: "popularity-chart",
                height: 350,
                type: "bar",
            },
            plotOptions: {
                bar: {
                    distributed: true,
                    horizontal: true,
                },
            },
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: false,
            },
            xaxis: {
                title: {
                    text: "Number of Tracks",
                },
                categories: [],
                stepSize: step,
            },
            yaxis: {
                title: {
                    text: "Popularity",
                },
            },
        },
    });

    // update chart labels when step changes
    useEffect(() => {
        const labels: string[] = [];
        // generate labels for the x-axis base on step
        for (let i = 0; i < 100; i += step) {
            labels.push(`${i} - ${i + step}`);
        }
        ApexCharts.exec("popularity-chart", "updateOptions", { labels: labels });
    }, [step]);

    // update chart series when playlist changes
    useEffect(() => {
        if (!playlist) return;
        const popularity = playlist.tracks.items.map((item) => item.track.popularity);
        const series: number[] = countBins(popularity, step, 100, 0);

        setState({
            series: [
                {
                    data: series,
                },
            ],
            options: {
                ...state.options,
            },
        });
        ApexCharts.exec("popularity-chart", "updateSeries", {
            data: series,
        });
    }, [playlist, step]);

    const handleChangeStep = useDebouncedCallback((value: string) => {
        const stepValue = Number.parseInt(value);
        if (Number.isNaN(stepValue) || stepValue < 1 || stepValue > 100) return;
        setStep(stepValue);
    }, 200);

    return (
        <div>
            <div className="flex items-center justify-end mb-10">
                <Select
                    w={"100"}
                    label="Step"
                    value={step.toString()}
                    onChange={(value) => handleChangeStep(value as string)}
                    data={[
                        { value: "5", label: "5" },
                        { value: "10", label: "10" },
                        { value: "20", label: "20" },
                        { value: "50", label: "50" },
                        { value: "100", label: "100" },
                    ]}
                    size={"sm"}
                />
            </div>
            <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
        </div>
    );
};

export default TrackPopularityChart;
