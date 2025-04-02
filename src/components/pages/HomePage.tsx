import { Button } from "@mantine/core";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import UserServices from "../../services/UserServices";

function HomePage() {
    const [data, setData] = useState(null);

    const fetchData = async () => {
        const data = await UserServices.getCurrentUser();
        setData(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Button onClick={fetchData}>FetchData</Button>
            <Button onClick={() => Cookies.remove("access_token")}>Remove Token</Button>
        </div>
    );
}

export default HomePage;
