import { Loader } from "@mantine/core";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import UnAuthHomePage from "./UnAuthHomePage";

function HomePage() {
    const { data, isLoading } = useCurrentUser();
    if (isLoading)
        return (
            <div className="w-full h-full rounded-md p-3 bg-zinc-800/60 flex items-center justify-center">
                <Loader />
            </div>
        );
    if (!isLoading && !data) return <UnAuthHomePage />;
    return <div className="bg-zinc-800/60 w-full h-full rounded-md p-3">TEST</div>;
}

export default HomePage;
