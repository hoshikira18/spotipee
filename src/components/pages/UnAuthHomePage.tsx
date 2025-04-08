import { Button } from "@mantine/core";
import { AUTH_URL } from "../../constants/auth";

function UnAuthHomePage() {
    return (
        <div className="w-full h-full rounded-md p-3 bg-zinc-800/60 flex items-center justify-center space-x-1">
            <span>Please</span>
            <Button
                component="a"
                href={AUTH_URL}
                className="hover:scale-105 transition-all duration-150"
            >
                Log in
            </Button>
            <span>to use Spotify</span>
        </div>
    );
}

export default UnAuthHomePage;
