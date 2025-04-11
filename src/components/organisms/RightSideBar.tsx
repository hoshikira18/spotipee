import { useViewportSize } from "@mantine/hooks";
import { useEffect } from "react";
import { useRightSidebarStore } from "../../store/rightSidebarStore";
import CurrentTrack from "../molecules/CurrentTrack";

function RightSideBar() {
    const { width } = useViewportSize();
    const { state, setState } = useRightSidebarStore();

    useEffect(() => {
        if (width > 0 && width < 768) {
            setState("off");
        }
        if (width > 0 && width > 768 && state === "off") {
            setState("current-track");
        }
    }, [width]);

    return (
        <aside
            className={`${
                state !== "off" ? "w-80" : "w-0"
            } bg-zinc-800/60 h-full rounded-md transition-all`}
        >
            {state === "current-track" && (
                <div className="h-full overflow-hidden">
                    <CurrentTrack />
                </div>
            )}
            {state === "devices" && (
                <div className="h-full overflow-hidden flex items-center justify-center">
                    Display Devices
                </div>
            )}
            {state === "queue" && (
                <div className="h-full overflow-hidden flex items-center justify-center">
                    Display Queue
                </div>
            )}
        </aside>
    );
}

export default RightSideBar;
