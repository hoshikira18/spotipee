import { SearchNormal } from "iconsax-react";

function SearchBar() {
    return (
        <div className="bg-customGray-900 p-3 rounded-3xl hover:bg-customGray-500 cursor-text flex items-center justify-around">
            <SearchNormal />
            <input className="bg-transparent" />
        </div>
    );
}

export default SearchBar;
