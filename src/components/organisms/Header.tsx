import { Button } from "@mantine/core";
import { Home, Spotify } from "iconsax-react";
import { AUTH_URL } from "../../constants/auth";
import { useAuth } from "../../hooks/useAuth";
import ProfileMenu from "../molecules/ProfileMenu";
import SearchBar from "../molecules/SearchBar";

function Header() {
    const { isAuth } = useAuth(null);

    return (
        <div className="flex items-center justify-between py-1">
            <button type="button" className="p-3">
                <Spotify size="40" color="#fff" variant="Bold" />
            </button>

            <div className="flex space-x-3">
                <button type="button" className="p-3 bg-zinc-800 rounded-full">
                    <Home size="30" color="#fff" variant="Bold" />
                </button>

                <SearchBar />
            </div>

            {isAuth ? (
                <ProfileMenu />
            ) : (
                <Button size="lg" fz={"md"} bg="white" c={"dark"} component={"a"} href={AUTH_URL}>
                    Log in
                </Button>
            )}
        </div>
    );
}

export default Header;
