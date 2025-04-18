import { AddCircle, TickCircle } from "iconsax-react";
import type { SpotifyTrack } from "../../types";
import { nprogress } from "@mantine/nprogress";
import UserServices from "../../services/UserServices";
import { useContext, useState } from "react";
import { TrackContext } from "../../contexts/TrackContext";
import { notifications } from "@mantine/notifications";
import { cn } from "../../utils";

interface SaveTrackButtonProps {
    track: SpotifyTrack;
    className?: string;
    size?: "sm" | "md" | "lg";
}

const buttonSize = {
    sm: 18,
    md: 24,
    lg: 30,
};

function SaveTrackButton({ track, className = "", size = "sm" }: SaveTrackButtonProps) {
    const trackContext = useContext(TrackContext);

    if (!trackContext) {
        throw new Error("TrackContext or PlayerContext is not available");
    }

    const { setSavedTracks, savedTracks } = trackContext;

    const isSaved = savedTracks.some((t) => t.id === track.id);

    const handleSaveTrack = async (track: SpotifyTrack) => {
        try {
            nprogress.start();
            if (isSaved) {
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

    return (
        <button
            type="button"
            className={cn(
                `${isSaved ? "text-green-500" : "invisible group-hover:visible text-zinc-400 hover:text-zinc-200 hover:scale-105 "}`,
                className,
            )}
            onClick={() => handleSaveTrack(track)}
        >
            {!isSaved ? (
                <AddCircle size={buttonSize[size]} />
            ) : (
                <TickCircle variant="Bold" size={buttonSize[size]} />
            )}
        </button>
    );
}

export default SaveTrackButton;
