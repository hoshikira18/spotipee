import { useTopArtists } from "../../../hooks/useArtist";
import CustomTable from "../CustomTable";

function TopArtists() {
    const { data: topArtists } = useTopArtists();
    return (
        <CustomTable>
            <CustomTable.Head
                style={{
                    backgroundColor: "#f8f9fa",
                    color: "#343a40",
                    fontWeight: "bold",
                }}
            >
                <CustomTable.HeaderCell>STT</CustomTable.HeaderCell>
                <CustomTable.HeaderCell>Artist</CustomTable.HeaderCell>
                <CustomTable.HeaderCell>Popularity</CustomTable.HeaderCell>
            </CustomTable.Head>
            <CustomTable.Body>
                {topArtists?.map((artist, index) => (
                    <CustomTable.Row key={artist.id}>
                        <CustomTable.Cell>{index + 1}</CustomTable.Cell>
                        <CustomTable.Cell>
                            <div className="flex items-center gap-2">
                                <img
                                    src={artist.images[0].url}
                                    alt={artist.name}
                                    className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div>
                                    <p className="text-sm font-semibold">{artist.name}</p>
                                    <p className="text-xs text-gray-500 line-clamp-1">
                                        {artist.genres.join(", ")}
                                    </p>
                                </div>
                            </div>
                        </CustomTable.Cell>
                        <CustomTable.Cell>{artist.popularity}</CustomTable.Cell>
                    </CustomTable.Row>
                ))}
            </CustomTable.Body>
        </CustomTable>
    );
}

export default TopArtists;
