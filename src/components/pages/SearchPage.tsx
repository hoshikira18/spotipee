import SearchBar from "../molecules/SearchBar";

function SearchPage() {
    return (
        <div className="h-full bg-zinc-900 rounded-md flex items-center justify-center">
            <div className="h-12">
                <SearchBar displayHomeButton={false} />
            </div>
        </div>
    );
}

export default SearchPage;
