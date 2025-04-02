import { instance } from "../lib/axios";

const UserServices = {
    async getCurrentUser() {
        try {
            const data = instance.get("/me").then(({ data }) => data);
            return data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
};

export default UserServices;
