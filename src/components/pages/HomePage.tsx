import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function HomePage() {
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const { accessToken, refreshToken } = useAuth(code);

    useEffect(() => {
        console.log(accessToken);
    }, [accessToken]);

    return <div>{accessToken}</div>;
}

export default HomePage;
