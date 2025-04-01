import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { instance } from "../../lib/axios";

function HomePage() {
    const [data, setData] = useState([]);
    const [key, setKey] = useState(false);

    const fetchData = async () => {
        const data = await instance.get("/albums/4aawyAB9vmqN3uQ7FjRGTy").then(({ data }) => data);
        setData(data);
    };

    useEffect(() => {
        fetchData();
    }, [key]);

    return (
        <div>
            <Button onClick={fetchData}>Fetch Data</Button>
            {JSON.stringify(data)}
        </div>
    );
}

export default HomePage;
