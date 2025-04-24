import { useQuery } from "@tanstack/react-query";
import DeviceServices from "../services/DeviceServices";

export const useDevices = () => {
    return useQuery({
        queryKey: ["devices"],
        queryFn: async () => DeviceServices.getDevices(),
    });
};
