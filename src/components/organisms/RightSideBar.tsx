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
        if (width > 0 && width > 768) {
            setState("current-track");
        }
    }, [width]);

    return (
        <aside
            className={`${
                state !== "off" ? "w-72" : "w-0"
            } bg-zinc-800/60 h-full rounded-md transition-all`}
        >
            <CurrentTrack />
        </aside>
    );
}

export default RightSideBar;
