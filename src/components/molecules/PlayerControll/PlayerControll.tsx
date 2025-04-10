import { Next, Play, Previous, Repeat, Shuffe } from "../../atoms/icons";
import { Slider } from "@mantine/core";

function PlayerControll({ toggle }) {
    return (
        <div className="space-y-4 px-2">
            <div className="flex items-center justify-center space-x-5">
                <button type="button" className="hover:text-white text-zinc-200">
                    <Shuffe />
                </button>
                <button type="button" className="hover:text-white text-zinc-200">
                    <Previous />
                </button>
                <button
                    type="button"
                    className="p-1.5 bg-white text-black rounded-full hover:scale-105 active:scale-100 transition-all"
                    onClick={toggle}
                >
                    <Play />
                </button>
                <button type="button" className="hover:text-white text-zinc-200">
                    <Next />
                </button>
                <button type="button" className="hover:text-white text-zinc-200">
                    <Repeat />
                </button>
            </div>
            <div className="">
                <Slider color="white" size="xs" defaultValue={20} />
            </div>
        </div>
    );
}

export default PlayerControll;
