import { useTopTracks } from "../../../hooks/useTrack";
import { convertMillisecondsToMinutes } from "../../../utils";
import CustomTable from "../CustomTable";

function TopTracks() {
    const { data: topTracks } = useTopTracks();
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
                <CustomTable.HeaderCell>Track</CustomTable.HeaderCell>
                <CustomTable.HeaderCell>Time</CustomTable.HeaderCell>
                <CustomTable.HeaderCell>Popularity</CustomTable.HeaderCell>
            </CustomTable.Head>
            <CustomTable.Body>
                {topTracks?.map((track, index) => (
                    <CustomTable.Row key={track.id}>
                        <CustomTable.Cell>{index + 1}</CustomTable.Cell>
                        <CustomTable.Cell>
                            <div className="flex items-center gap-2">
                                <img
                                    src={track.album.images[0].url}
                                    alt={track.name}
                                    className="w-10 h-10 rounded-lg"
                                />
                                <div>
                                    <p className="text-sm font-semibold">{track.name}</p>
                                    <p className="text-xs text-gray-500">{track.artists[0].name}</p>
                                </div>
                            </div>
                        </CustomTable.Cell>
                        <CustomTable.Cell>
                            {convertMillisecondsToMinutes(track.duration_ms)}
                        </CustomTable.Cell>
                        <CustomTable.Cell>{track.popularity}</CustomTable.Cell>
                    </CustomTable.Row>
                ))}
            </CustomTable.Body>
        </CustomTable>
    );
}

export default TopTracks;
