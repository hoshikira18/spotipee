import { Button } from "@mantine/core";
import { Home, Spotify } from "iconsax-react";
import { Link } from "react-router-dom";
import { AUTH_URL } from "../../constants/auth";
import { useAuth } from "../../hooks/useAuth";
import ProfileMenu from "../molecules/ProfileMenu";
import SearchBar from "../molecules/SearchBar";

function Header() {
    const { isAuth } = useAuth(null);

    return (
        <div className="sticky top-0 flex items-center md:justify-between py-1">
            <Link to={"/"} className="p-3">
                <Spotify size="40" color="#fff" variant="Bold" />
            </Link>

            <div className="flex space-x-3">
                <Link to={"/"} className="p-3 bg-zinc-800 rounded-full">
                    <Home size="25" color="#fff" variant="Bold" />
                </Link>

                <SearchBar />
            </div>

            <div className="absolute md:relative right-0">
                {isAuth ? (
                    <ProfileMenu />
                ) : (
                    <Button
                        size="lg"
                        fz={"md"}
                        bg="white"
                        c={"dark"}
                        component={"a"}
                        href={AUTH_URL}
                    >
                        Log in
                    </Button>
                )}
            </div>
        </div>
    );
}

export default Header;
