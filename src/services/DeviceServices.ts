import { instance } from "../lib/axios";

const DeviceServices = {
    async getDevices() {
        const devices = await instance.get("/me/player/devices").then(({ data }) => data.devices);
        return devices;
    },
    async transferPlayback(deviceId: string, play: boolean) {
        const response = await instance.put("/me/player", {
            device_ids: [deviceId],
            play,
        });
        return response.data;
    },
};

export default DeviceServices;
