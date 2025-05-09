import { useContext } from "react";
import type { SpotifyTrack } from "../../types";
import { TrackContext } from "../../contexts/TrackContext";
import { PlayerContext } from "../../contexts/PlayerContext";
import CustomTable from "./CustomTable";
import TrackCell from "../atoms/TrackCell";
import { convertMillisecondsToMinutes } from "../../utils";
import TrackOptions from "../atoms/TrackOptionsButton";
import PlayButtonCell from "../atoms/PlayButtonCell";
import SaveTrackButton from "../atoms/SaveTrackButton";

interface TopTracksTableProps {
    tracks: SpotifyTrack[] | undefined;
    isShowMore: boolean;
}

const TopTracksTable = ({ isShowMore, tracks }: TopTracksTableProps) => {
    const trackContext = useContext(TrackContext);
    const playerContext = useContext(PlayerContext);
    if (!trackContext || !playerContext) {
        throw new Error("TrackContext or PlayerContext is not available");
    }

    return (
        <CustomTable>
            <CustomTable.Body>
                {tracks?.slice(0, isShowMore ? 10 : 5).map((track, index) => (
                    <CustomTable.Row key={track.id} className="group">
                        <CustomTable.Cell width={20}>
                            <PlayButtonCell index={index} track={track} />
                        </CustomTable.Cell>
                        <CustomTable.Cell>
                            <TrackCell track={track} />
                        </CustomTable.Cell>
                        <CustomTable.Cell align="right">
                            <div className="flex items-center justify-end space-x-3">
                                <SaveTrackButton trackId={track.id} />
                                <span className="text-[#b3b3b3]">
                                    {convertMillisecondsToMinutes(track.duration_ms)}
                                </span>
                                {/* <TrackOptions track={track} /> */}
                            </div>
                        </CustomTable.Cell>
                    </CustomTable.Row>
                ))}
            </CustomTable.Body>
        </CustomTable>
    );
};

export default TopTracksTable;
