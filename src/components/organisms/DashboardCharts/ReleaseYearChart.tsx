import { useEffect, useMemo, useState } from "react";
import { usePlaylist } from "../../../hooks/usePlaylist";
import type { ChartOptions } from "../../../types";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { Slider } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { countBins } from "../../../utils";

interface ReleaseYearChartProps {
    playlistId: string;
}

const ReleaseYearChart = ({ playlistId }: ReleaseYearChartProps) => {
    const { data: playlist } = usePlaylist(playlistId, true);
    const [step, setStep] = useState<number>(2);

    const [state, setState] = useState<ChartOptions>({
        series: [
            {
                data: [],
            },
        ],
        options: {
            chart: {
                id: "release-year-chart",
                height: 350,
                type: "bar",
            },
            plotOptions: {
                bar: {
                    columnWidth: "45%",
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
            },
            yaxis: {
                title: {
                    text: "Release Year",
                },
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
    const maxYear = useMemo(() => Math.max(...(releaseYears || [])), [releaseYears]);
    const minYear = useMemo(() => Math.min(...(releaseYears || [])), [releaseYears]);

    // update chart labels when step changes
    useEffect(() => {
        if (!releaseYears) return;
        // generate labels for the x-axis base on step
        const labels: string[] = getLabels(step, maxYear, minYear);
        setState((prev) => ({
            ...prev,
            options: {
                ...prev.options,
                xaxis: {
                    ...prev.options.xaxis,
                    categories: labels,
                },
            },
        }));
        ApexCharts.exec("release-year-chart", "updateOptions", { labels: labels });
    }, [step]);

    // update chart series when playlist changes
    useEffect(() => {
        if (!playlist || !releaseYears) return;
        const series: number[] = countBins(releaseYears || [], step, maxYear, minYear);
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
        ApexCharts.exec("release-year-chart", "updateSeries", {
            data: series,
        });
    }, [playlist, step]);

    const handleChangeStep = useDebouncedCallback((value: string) => {
        const stepValue = Number.parseInt(value);
        if (Number.isNaN(stepValue) || stepValue < 1 || stepValue > 100) return;
        setStep(stepValue);
    }, 200);

    const getLabels = (step: number, maxYear: number, minYear: number) => {
        const labels: string[] = [];
        for (let i = minYear; i <= maxYear; i += step) {
            labels.push(`${i} - ${i + step}`);
        }

        return labels;
    };

    return (
        <div>
            <div className="w-60 mx-auto mb-10">
                <span>Step:</span>
                <Slider
                    label="Step"
                    value={step}
                    onChange={(value) => handleChangeStep(value.toString())}
                    min={1}
                    max={10}
                    step={1}
                    marks={[
                        { value: 2, label: "2" },
                        { value: 5, label: "5" },
                        { value: 8, label: "8" },
                    ]}
                    size={"sm"}
                />
            </div>
            <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
        </div>
    );
};

export default ReleaseYearChart;
