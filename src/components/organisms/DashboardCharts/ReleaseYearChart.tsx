import { useEffect, useMemo, useState } from "react";
import { usePlaylist } from "../../../hooks/usePlaylist";
import type { ChartOptions } from "../../../types";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { countBins } from "../../../utils";
import { Slider } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";

interface ReleaseYearChartProps {
    playlistId: string;
}

const ReleaseYearChart = ({ playlistId }: ReleaseYearChartProps) => {
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
                    columnWidth: "45%",
                    distributed: true,
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
    const releaseYears = useMemo(
        () =>
            playlist?.tracks.items.map((item) =>
                new Date(item.track.album.release_date).getFullYear(),
            ),
        [playlist],
    );

    console.log(releaseYears);

    // generate labels for the x-axis base on step
    useEffect(() => {
        if (!releaseYears) return;
        const labels: string[] = [];
        for (let i = 0; i < releaseYears?.length; i += step) {
            labels.push(`${i} - ${i + step}`);
        }
        // update labels in the chart
        ApexCharts.exec("popularity-chart", "updateOptions", { labels: labels });
    }, [step]);

    // update series in the chart
    useEffect(() => {
        if (!playlist) return;
        const series: number[] = countBins(releaseYears || [], step);

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

export default ReleaseYearChart;
