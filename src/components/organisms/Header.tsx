import { Spotify } from "iconsax-react";
import AccountButton from "../molecules/AccountButton";
import SearchBar from "../molecules/SearchBar";

function Header() {
    return (
        <div className="flex items-center justify-between">
            <button type="button" className="p-3">
                <Spotify size="40" color="#fff" variant="Bold" />
            </button>

            <SearchBar />

            <AccountButton />
        </div>
    );
}

export default Header;
