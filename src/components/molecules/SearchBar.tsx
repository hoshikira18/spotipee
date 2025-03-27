import { SearchNormal } from "iconsax-react";

function SearchBar() {
    return (
        <div className="bg-customGray-900 px-3 rounded-3xl hover:bg-customGray-500 cursor-text flex items-center justify-around transition-all duration-300 hover:outline-1 hover:outline outline-customGray-100/65 ">
            <SearchNormal />
            <input
                className="bg-transparent p-3 outline-none font-medium text-gray-100 font-spotify"
                placeholder="What do you want to play?"
            />
        </div>
    );
}

export default SearchBar;
