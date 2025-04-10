import { Slider } from "@mantine/core";
import { usePlayer } from "../../hooks/usePlayer";

function SongProgress() {
    const { currentTime, duration } = usePlayer();

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    console.log(currentTime);

    return (
        <div className="w-full flex items-center justify-between space-x-5">
            <span className="flex-none">{formatTime(currentTime)}</span>
            <div className="w-full">
                <Slider
                    color="blue"
                    size="xs"
                    showLabelOnHover={false}
                    value={(currentTime / duration) * 100 || 0}
                />
            </div>
            <span className="flex-none">{formatTime(duration)}</span>
        </div>
    );
}

export default SongProgress;
