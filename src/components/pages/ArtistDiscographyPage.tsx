import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useArtist, useArtistAlbums } from "../../hooks/useArtist";
import MediaCard from "../molecules/MediaCard";
import { Combobox, useCombobox } from "@mantine/core";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";
import { cn } from "../../utils";
import { useElementScroll } from "../../hooks/useElementScroll";

function ArtistDiscographyPage() {
    const { artistId, type } = useParams<{ artistId: string; type?: "single" | "album" }>();
    const { data: artist } = useArtist(artistId as string);
    const { data: topTracks } = useArtistAlbums(artistId as string, 50);
    const [filter, setFilter] = useState<"single" | "album" | "all">(type ?? "all");

    const filteredData = topTracks?.filter(
        (track) => filter === "all" || track.album_type === filter,
    );

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const options = ["all", "single", "album"].map((item) => (
        <Combobox.Option value={item} key={item}>
            {item}
        </Combobox.Option>
    ));
    const ref = useRef<HTMLDivElement>(null);
    const { top } = useElementScroll(ref);

    return (
        <div ref={ref} className="h-full overflow-y-scroll bg-zinc-900 rounded-md relative">
            <div
                className={cn(
                    "sticky z-10 bg-zinc-900 top-0 right-0 left-0 pt-10 pb-2 flex items-center justify-between px-7",
                    top > 0 ? "shadow-2xl" : "",
                )}
            >
                <Link to={`/artist/${artistId}`} className="text-2xl font-semibold hover:underline">
                    {artist?.name}
                </Link>
                <div>
                    <Combobox
                        store={combobox}
                        width={100}
                        position="bottom-start"
                        onOptionSubmit={(val) => {
                            setFilter(val);
                            combobox.closeDropdown();
                        }}
                    >
                        <Combobox.Target>
                            <button
                                type="button"
                                onClick={() => combobox.toggleDropdown()}
                                className="flex items-center justify-center"
                            >
                                <span>
                                    {filter === "all"
                                        ? "All"
                                        : filter === "single"
                                          ? "Singles"
                                          : "Albums"}
                                </span>
                                <span>
                                    {combobox.dropdownOpened ? (
                                        <ArrowUp2 variant="Bold" />
                                    ) : (
                                        <ArrowDown2 variant="Bold" />
                                    )}
                                </span>
                            </button>
                        </Combobox.Target>

                        <Combobox.Dropdown>
                            <Combobox.Options>{options}</Combobox.Options>
                        </Combobox.Dropdown>
                    </Combobox>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-2 px-7">
                {filteredData?.map((item) => (
                    <MediaCard
                        key={item.id}
                        title={item.name}
                        imageSrc={item.images[1].url}
                        className="col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2 min-w-0 w-auto"
                    />
                ))}
            </div>
        </div>
    );
}

export default ArtistDiscographyPage;
