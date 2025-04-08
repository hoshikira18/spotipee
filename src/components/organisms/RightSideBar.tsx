import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { useEffect } from "react";

function RightSideBar() {
    const { width } = useViewportSize();
    const [rightSideBarOpened, { close: rightSideBarClose }] = useDisclosure(false);

    // Close the sidebar if the screen width is less than 768px
    useEffect(() => {
        if (width > 0 && width < 768) {
            rightSideBarClose();
        }
    }, [width]);
    return (
        <div
            className={`${rightSideBarOpened ? "w-72 p-3" : "w-0"} bg-zinc-800 rounded-md transition-all duration-300`}
        >
            TEST
        </div>
    );
}

export default RightSideBar;
