import { Button } from "@mantine/core";
import { Spotify } from "iconsax-react";
import { AUTH_URL } from "../../constants/auth";
import SearchBar from "../molecules/SearchBar";

function Header() {
    return (
        <div className="flex items-center justify-between">
            <button type="button" className="p-3">
                <Spotify size="40" color="#fff" variant="Bold" />
            </button>

            <SearchBar />

            <Button size="lg" fz={"md"} bg="white" c={"dark"} component={"a"} href={AUTH_URL}>
                Log in
            </Button>
        </div>
    );
}

export default Header;
