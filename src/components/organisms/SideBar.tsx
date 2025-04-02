import { useDisclosure } from "@mantine/hooks";
import { Add, Category, Heart } from "iconsax-react";
import { useFollowedArtists } from "../../hooks/useCurrentUser";
import { getImage } from "../../utils";

function SideBar() {
    const [opened, handlers] = useDisclosure(true);
    const { data: followedArtists } = useFollowedArtists();

    const handleExpandSidebar = () => {
        if (opened) {
            handlers.close();
            return;
        }
        handlers.open();
    };

    console.log(followedArtists);

    return (
        <div className="flex flex-col rounded-lg bg-zinc-900 overflow-hidden">
            <div
                className={`bg-zinc-900 py-3 px-4 shadow-md flex transition-all flex-col space-y-2 ${opened ? "" : "w-20"}`}
            >
                <div className="flex items-center font-bold font-spotify space-x-2">
                    <button
                        type="button"
                        onClick={handleExpandSidebar}
                        className="w-12 rounded-md aspect-square flex items-center justify-center hover:text-zinc-50"
                    >
                        <Category />
                    </button>
                    {opened && <div>Your library</div>}
                </div>
                <div className="flex items-center font-bold font-spotify space-x-2">
                    <button
                        type="button"
                        className="bg-zinc-800/70 w-12 p-1 rounded-full aspect-square flex items-center justify-center"
                    >
                        <Add size={20} />
                    </button>
                    {opened && <div>New playlist</div>}
                </div>
            </div>
            <div
                className={`relative pl-2.5 py-3 space-y-2 overflow-y-scroll overflow-x-hidden transition-all duration-300 ${opened ? "w-72" : "w-20"}`}
            >
                <div className="flex space-x-2 p-2">
                    <div className="min-w-12 w-12 bg-gradient-to-br from-purple-700 to-blue-300 p-3 rounded-md aspect-square flex items-center justify-center">
                        <Heart size={20} color="white" variant="Bold" />
                    </div>
                    <div className="h-12">
                        <div className="font-spotify font-medium text-base text-zinc-50 min-w-32">
                            Liked Songs
                        </div>
                        <span className="font-spotify text-sm text-zinc-400">
                            Playlist * 3 songs
                        </span>
                    </div>
                </div>
                {followedArtists?.map((artist) => (
                    <div
                        key={artist.id}
                        className="flex space-x-2 p-2 transition-all overflow-hidden"
                    >
                        <div className="min-w-12 w-12 h-12 rounded-full overflow-hidden aspect-square">
                            <img
                                src={getImage(320, artist.images)}
                                alt={artist.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="h-12">
                            <div className="font-spotify font-medium text-base text-zinc-50 min-w-32">
                                {artist.name}
                            </div>
                            <span className="font-spotify text-sm text-zinc-400">
                                {artist.type === "artist" ? "Artist" : "Other"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SideBar;
