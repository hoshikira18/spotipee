import { TextInput, Textarea, Button } from "@mantine/core";
import UserImage from "../atoms/UserImage";
import type { SpotifyPlaylist } from "../../types";
import PlaylistServices from "../../services/PlaylistServices";
import { nprogress } from "@mantine/nprogress";
import { useContext, useState } from "react";
import { PlaylistDetailContext } from "../pages/PLaylistDetailPage";
import { notifications } from "@mantine/notifications";

interface ModalProps {
    playlist?: SpotifyPlaylist;
}

function EditPlaylistModal({ playlist }: ModalProps) {
    const playlistDetailContext = useContext(PlaylistDetailContext);
    if (!playlistDetailContext) {
        throw new Error("EditPlaylistModal must be used within a PlaylistDetailProvider");
    }

    const { name, description, setName, setDescription } = playlistDetailContext;
    const [n, setN] = useState(name);
    const [d, setD] = useState(description);

    const handleUpdatePlaylist = async () => {
        if (!playlist) return;

        nprogress.start();
        await PlaylistServices.changePlaylistInfo(playlist.id, n, d)
            .then(() => {
                setName(n);
                setDescription(d);
            })
            .catch((err) => {
                console.error(err);
                notifications.show({
                    title: "Error",
                    message: "Failed to update playlist",
                    color: "red",
                });
            });
        nprogress.complete();
    };

    return (
        <div className="flex flex-col space-y-5 font-spotify">
            <h1 className="font-bold text-2xl">Edit details</h1>
            <div className="grid grid-cols-3 gap-2">
                <UserImage
                    imageUrl={playlist?.images[0].url || ""}
                    alt="playlist-image"
                    className="col-span-1"
                />
                <div className="col-span-2 flex flex-col justify-between space-y-2">
                    <TextInput
                        defaultValue={name}
                        value={n}
                        onChange={(e) => setN(e.target.value)}
                        label="Name"
                        placeholder="Add a name"
                    />
                    <Textarea
                        defaultValue={description}
                        value={d}
                        onChange={(e) => setD(e.target.value)}
                        rows={5}
                        label="Description"
                        placeholder="Add an optional description"
                    />
                </div>
                <div className="col-span-3 flex items-center justify-end space-x-2">
                    <Button
                        size="lg"
                        fz={16}
                        fw={700}
                        px={32}
                        py={8}
                        color="white"
                        c={"black"}
                        className="hover:scale-105 transition-all duration-150 hover:!bg-zinc-200"
                        onClick={handleUpdatePlaylist}
                    >
                        Save
                    </Button>
                </div>
                <div className="col-span-3">
                    <p className="text-[12px] text-zinc-200">
                        By proceeding, you agree to give Spotify access to the image you choose to
                        upload. Please make sure you have the right to upload the image.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default EditPlaylistModal;
