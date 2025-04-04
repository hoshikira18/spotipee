import { Button } from "@mantine/core";
import { Spotify, User } from "iconsax-react";
import { Link } from "react-router-dom";
import { AUTH_URL } from "../../constants/auth";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import ProfileButton from "../atoms/ProfileButton";
import SearchBar from "../molecules/SearchBar";

function Header() {
    const { data: currentUser, isLoading } = useCurrentUser();

    return (
        <header className="h-16 flex items-center md:justify-between p-2">
            <Link to={"/"} className="px-2">
                <Spotify size={45} variant="Bold" />
            </Link>
            <SearchBar />
            {isLoading ? (
                <div className="absolute md:relative right-0 flex items-center gap-2">
                    <User />
                </div>
            ) : (
                <div className="absolute md:relative right-0 flex items-center gap-2">
                    {currentUser ? (
                        <ProfileButton currentUser={currentUser} />
                    ) : (
                        <Button component={"a"} href={AUTH_URL} size="md">
                            Log in
                        </Button>
                    )}
                </div>
            )}
        </header>
    );
}

export default Header;
