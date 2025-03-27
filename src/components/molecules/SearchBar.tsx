import { SearchNormal } from "iconsax-react";

function SearchBar() {
    return (
        <div className="bg-customGray-900 px-3 rounded-3xl hover:bg-customGray-500 cursor-text flex items-center justify-around transition-all duration-150 focus-within:outline-2 focus-within:outline-gray-50 font-spotify">
            <SearchNormal />
            <input
                className="bg-transparent p-3 outline-none font-medium text-gray-100"
                placeholder="What do you want to play?"
            />
        </div>
    );
}

export default SearchBar;
