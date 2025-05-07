import { useEffect, useMemo, useState } from "react";
import { usePlaylistTracks } from "../../../hooks/usePlaylist";
import type { ChartOptions } from "../../../types";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { NativeSelect, Select } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { countBins } from "../../../utils";
import { notifications } from "@mantine/notifications";

interface ReleaseYearChartProps {
    playlistId: string;
}

const ReleaseYearChart = ({ playlistId }: ReleaseYearChartProps) => {
    const { data: playlist } = usePlaylistTracks(playlistId, true);
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
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: false,
            },
            xaxis: {
                title: {
                    text: "Release Year",
                    style: {
                        color: "#ccc",
                    },
                },
                categories: [],
                labels: {
                    style: {
                        colors: "#ccc",
                    },
                },
                stepSize: step,
            },
            yaxis: {
                title: {
                    text: "Number of Tracks",
                    style: {
                        color: "#ccc",
                    },
                },
                labels: {
                    style: {
                        colors: "#ccc",
                    },
                },
            },
        },
    });

    const releaseYears = useMemo(
        () => playlist?.items.map((item) => new Date(item.track.album.release_date).getFullYear()),
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
        ApexCharts.exec("release-year-chart", "updateOptions", {
            labels: labels,
        });
    }, [step, releaseYears]);

    // update chart series when playlist changes
    useEffect(() => {
        if (!playlist || !releaseYears) return;
        const series: number[] = countBins(releaseYears || [], step, maxYear, minYear);
        if (series.length === 0) {
            notifications.show({
                title: "No data",
                message: "No data to display for this playlist",
                color: "red",
            });
        }
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
            <div className="flex items-center justify-end mb-10">
                <NativeSelect
                    w={"100"}
                    label="Step"
                    value={step.toString()}
                    onChange={(e) => handleChangeStep(e.target.value as string)}
                    data={[
                        { value: "1", label: "1" },
                        { value: "2", label: "2" },
                        { value: "3", label: "3" },
                        { value: "4", label: "4" },
                        { value: "5", label: "5" },
                        { value: "6", label: "6" },
                        { value: "7", label: "7" },
                        { value: "8", label: "8" },
                        { value: "9", label: "9" },
                        { value: "10", label: "10" },
                    ]}
                    size={"sm"}
                />
            </div>
            <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
        </div>
    );
};

export default ReleaseYearChart;
