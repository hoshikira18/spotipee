import { useEffect, useMemo, useState } from "react";
import { useDevices } from "../../hooks/useDevices";
import { useRightSidebarStore } from "../../store/rightSidebarStore";
import type { SpotifyDevice } from "../../types";
import { CloseIcon, ComputerIcon, ExpandIcon, ExternalLinkIcon, PhoneIcon } from "../atoms/icons";
import { useQueryClient } from "@tanstack/react-query";
import {
    ArrowCircleDown,
    ArrowCircleDown2,
    Computing,
    Link,
    Wifi,
    WifiSquare,
} from "iconsax-react";
import DeviceServices from "../../services/DeviceServices";
import DevicesIcon from "../atoms/icons/Devices";

function DevicesView() {
    const { key, setState: setRightSidebarContentState } = useRightSidebarStore();

    const queryClient = useQueryClient();
    useEffect(() => {
        queryClient.invalidateQueries(["devices"]);
    }, []);

    return (
        <div className="px-3 overflow-y-scroll h-full relative">
            <div className="flex items-center justify-between px-2 pt-4 pb-3 sticky top-0 z-10 bg-zinc-900">
                <div className="flex space-x-3">
                    <p className="font-semibold">Connect to a device</p>
                </div>
                <button
                    type="button"
                    className="p-2 hover:bg-zinc-700/40 rounded-full"
                    onClick={() => setRightSidebarContentState("off")}
                >
                    <CloseIcon size={20} />
                </button>
            </div>
            <CurrentDevice />
            <DevicesList />
        </div>
    );
}

export default DevicesView;

const CurrentDevice = () => {
    const { data: devices } = useDevices();
    const [currentDevice, setCurrentDevice] = useState<SpotifyDevice | null>(null);

    useEffect(() => {
        if (devices && devices.length > 0) {
            const activeDevice = devices.find((device: SpotifyDevice) => device.is_active);
            setCurrentDevice(activeDevice || null);
        }
    }, [devices]);

    return (
        <div className="px-3 py-5 bg-gradient-to-b from-[#1a2e1a] to-[#1b1b1b] shadow-md rounded-md">
            <div className="flex items-center space-x-3">
                <img
                    width="24"
                    height="24"
                    alt=""
                    aria-hidden="true"
                    src="https://open.spotifycdn.com/cdn/images/device-picker-equaliser-animation.946e7243.webp"
                    data-testid="animated-now-playing"
                    className="mb-2"
                />
                <span className="font-bold text-2xl">Current device</span>
            </div>
            <span>{currentDevice?.name}</span>
        </div>
    );
};

const DevicesList = () => {
    const { data: devices } = useDevices();
    const filteredDevices = useMemo(
        () => devices?.filter((item: SpotifyDevice) => !item.is_active),
        [devices],
    );

    // no other devices found options
    const options = [
        {
            icon: <WifiSquare />,
            title: "Check your WiFi",
            description: "Connect the devices you’re using to the same WiFi.",
        },
        {
            icon: <DevicesIcon />,
            title: "Play from another device",
            description: "It will automatically appear here.",
        },
        {
            icon: <ArrowCircleDown2 />,
            title: "Switch to the Spotify app",
            description: "The app can detect more devices.",
        },
    ];

    return (
        <div className="flex flex-col mt-5">
            <span className="font-bold mb-7 px-3">
                {filteredDevices?.length === 0 ? "No other devices found" : "Select another device"}
            </span>
            {filteredDevices?.length === 0 && (
                <div className="">
                    <div>
                        {options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-3 mb-5 px-3">
                                <div className="text-zinc-400 w-10 flex-none flex items-center justify-center">
                                    {option.icon}
                                </div>
                                <div>
                                    <p className="font-semibold">{option.title}</p>
                                    <p className="text-sm text-zinc-500">{option.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/60 px-3 py-5 rounded-md">
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://support.spotify.com/us/article/spotify-connect/"
                            className="text-sm text-zinc-300 px-3 py-3 hover:bg-zinc-800/60 rounded-md flex items-center justify-between"
                        >
                            <span className="hover:underline">Don't see your device?</span>
                            <ExternalLinkIcon />
                        </a>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://connect.spotify.com/howto?utm_campaign=connect&utm_medium=web&utm_source=desktop"
                            className="text-sm text-zinc-300 px-3 py-3 hover:bg-zinc-800/60 rounded-md flex items-center justify-between"
                        >
                            <span className="hover:underline">What can I connect to?</span>
                            <ExternalLinkIcon />
                        </a>
                    </div>
                </div>
            )}

            {filteredDevices?.map((device: SpotifyDevice) => (
                <DeviceCard key={device.id} device={device} />
            ))}
        </div>
    );
};

interface DeviceCardProps {
    device: SpotifyDevice;
}

const DeviceCard = ({ device }: DeviceCardProps) => {
    const queryClient = useQueryClient();
    const setRightBarState = useRightSidebarStore((state) => state.setState);

    const handleTransferPlayback = async () => {
        await DeviceServices.transferPlayback(device.id, true)
            .then(() => {
                queryClient.invalidateQueries(["devices"]);
                setRightBarState("current-track");
            })
            .catch((error) => {
                console.error("Error transferring playback:", error);
            });
    };
    return (
        <button
            type="button"
            onClick={handleTransferPlayback}
            className="flex items-center space-x-2 px-3 py-5 rounded-md hover:bg-zinc-800/60"
        >
            <div>{device.type === "Smartphone" ? <PhoneIcon /> : <ComputerIcon />}</div>
            <span>{device.name}</span>
        </button>
    );
};
