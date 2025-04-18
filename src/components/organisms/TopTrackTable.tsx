import { useContext } from "react";
import TrackServices from "../../services/TrackServices";
import type { SpotifyTrack } from "../../types";
import { TrackContext } from "../../contexts/TrackContext";
import { PlayerContext } from "../../contexts/PlayerContext";
import { nprogress } from "@mantine/nprogress";
import UserServices from "../../services/UserServices";
import { notifications } from "@mantine/notifications";
import CustomTable from "./CustomTable";
import { Pause, Play } from "../atoms/icons";
import TrackCell from "../atoms/TrackCell";
import { convertMillisecondsToMinutes } from "../../utils";
import TrackOptions from "../atoms/TrackOptionsButton";
import { AddCircle, TickCircle } from "iconsax-react";

interface TopTracksTableProps {
    tracks: SpotifyTrack[] | undefined;
    isShowMore: boolean;
}

const TopTracksTable = ({ isShowMore, tracks }: TopTracksTableProps) => {
    const handlePlayTrack = async (track: SpotifyTrack) => {
        playbackState.isPaused && currentTrack?.id === track.id
            ? togglePlay()
            : await TrackServices.play([track.uri] as string[]);
    };

    const trackContext = useContext(TrackContext);
    const playerContext = useContext(PlayerContext);
    if (!trackContext || !playerContext) {
        throw new Error("TrackContext or PlayerContext is not available");
    }
    const { setSavedTracks, savedTracks } = trackContext;
    const { currentTrack, togglePlay, playbackState } = playerContext;

    const isSaved = (track: SpotifyTrack) => {
        return savedTracks.some((t) => t.id === track.id);
    };

    const handleSaveTrack = async (track: SpotifyTrack) => {
        try {
            nprogress.start();
            if (track.isSaved) {
                await UserServices.removeTracks([track.id])
                    .then(() => {
                        const updatedTracks = savedTracks.filter(
                            (savedTrack) => savedTrack.id !== track.id,
                        );
                        setSavedTracks(updatedTracks);
                    })
                    .catch(() => {
                        notifications.show({
                            message: "Failed to remove track from saved tracks",
                            color: "red",
                        });
                    });
                return;
            }
            await UserServices.saveTracks([track.id as string])
                .then(() => {
                    const updatedTracks = [...savedTracks, track];
                    setSavedTracks(updatedTracks);
                })
                .catch(() => {
                    notifications.show({
                        message: "Failed to save track",
                        color: "red",
                    });
                })
                .finally(() => {
                    nprogress.complete();
                });
        } catch (error) {
            console.error("Error saving track:", error);
        } finally {
            nprogress.complete();
        }
    };

    const isPlaying = (track: SpotifyTrack) => {
        if (!currentTrack) return false;
        return currentTrack.id === track.id;
    };
    return (
        <CustomTable>
            <CustomTable.Body>
                {tracks?.slice(0, isShowMore ? 10 : 5).map((track, index) => (
                    <CustomTable.Row key={track.id} className="group">
                        <CustomTable.Cell width={20}>
                            <div className="flex items-center space-x-3">
                                {isPlaying(track) && !playbackState.isPaused ? (
                                    <div className="group">
                                        <img
                                            width="14"
                                            height="14"
                                            alt=""
                                            src="https://open.spotifycdn.com/cdn/images/equaliser-green.f8937a92.svg"
                                            className="group-hover:hidden"
                                        />
                                        <button
                                            onClick={togglePlay}
                                            type="button"
                                            className="hidden group-hover:block"
                                        >
                                            <Pause />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className={
                                            isPlaying(track) ? "text-green-400" : "text-zinc-200"
                                        }
                                    >
                                        <span className="block w-5 text-center text-base group-hover:hidden">
                                            {index + 1}
                                        </span>
                                        <button
                                            type="button"
                                            className="w-5 text-center text-base hidden group-hover:block"
                                            onClick={() => handlePlayTrack(track)}
                                        >
                                            <Play />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </CustomTable.Cell>
                        <CustomTable.Cell className={`${isPlaying(track) ? "text-green-400" : ""}`}>
                            <TrackCell track={track} />
                        </CustomTable.Cell>
                        <CustomTable.Cell align="right">
                            <div className="flex items-center justify-end space-x-3">
                                <button
                                    type="button"
                                    className={`${isSaved(track) ? "text-green-500" : "invisible group-hover:visible text-zinc-400 hover:text-zinc-200 hover:scale-105 "}`}
                                    onClick={() => handleSaveTrack(track)}
                                >
                                    {!isSaved(track) ? (
                                        <AddCircle size={18} />
                                    ) : (
                                        <TickCircle variant="Bold" size={18} />
                                    )}
                                </button>
                                <span className="text-[#b3b3b3]">
                                    {convertMillisecondsToMinutes(track.duration_ms)}
                                </span>
                                <TrackOptions track={track} />
                            </div>
                        </CustomTable.Cell>
                    </CustomTable.Row>
                ))}
            </CustomTable.Body>
        </CustomTable>
    );
};

export default TopTracksTable;
