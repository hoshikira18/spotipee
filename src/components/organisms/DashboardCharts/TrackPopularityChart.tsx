import { useEffect, useState } from "react";
import { usePlaylist } from "../../../hooks/usePlaylist";
import type { ChartOptions } from "../../../types";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { countBins } from "../../../utils";
import { Slider } from "@mantine/core";
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
                categories: [],
            },
        },
    });

    useEffect(() => {
        const labels: string[] = [];
        // generate labels for the x-axis base on step
        for (let i = 0; i < 100; i += step) {
            labels.push(`${i} - ${i + step}`);
        }
        // update labels in the chart
        ApexCharts.exec("popularity-chart", "updateOptions", { labels: labels });
    }, [step]);

    useEffect(() => {
        if (!playlist) return;
        const popularity = playlist.tracks.items.map((item) => item.track.popularity);
        const series: number[] = countBins(popularity, step);

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
        // update series in the chart
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
            <div className="w-96 mb-10">
                <span>Step:</span>
                <Slider
                    label="Step"
                    value={step}
                    onChange={(value) => handleChangeStep(value.toString())}
                    min={1}
                    max={100}
                    step={1}
                    marks={[
                        { value: 20, label: "20" },
                        { value: 50, label: "50" },
                        { value: 80, label: "80" },
                    ]}
                />
            </div>
            <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
        </div>
    );
};

export default TrackPopularityChart;
