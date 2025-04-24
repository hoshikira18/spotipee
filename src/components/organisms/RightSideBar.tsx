import { useViewportSize } from "@mantine/hooks";
import { useEffect } from "react";
import { useRightSidebarStore } from "../../store/rightSidebarStore";
import NowPlayingView from "../molecules/NowPlayingView";
import QueueView from "../molecules/QueueView";
import DevicesView from "../molecules/DevicesView";

function RightSideBar() {
    const { width } = useViewportSize();
    const { state, setState } = useRightSidebarStore();

    // Handle the sidebar state based on the screen width
    useEffect(() => {
        if (width > 0 && width < 768) {
            setState("off");
        }
    }, [width]);

    return (
        <aside
            className={`${
                state !== "off" ? "min-w-1/4 w-1/4" : "w-0"
            } bg-zinc-800/60 h-full rounded-md transition-all`}
        >
            {state === "current-track" && (
                <div className="h-full overflow-hidden">
                    <NowPlayingView />
                </div>
            )}
            {state === "devices" && (
                <div className="h-full overflow-hidden">
                    <DevicesView />
                </div>
            )}
            {state === "queue" && (
                <div className="h-full">
                    <QueueView />
                </div>
            )}
        </aside>
    );
}

export default RightSideBar;
