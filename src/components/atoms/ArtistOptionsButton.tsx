import { Menu } from "@mantine/core";
import {
    ProfileAdd,
    Forbidden,
    Airdrop,
    Augur,
    ExportSquare,
    Spotify,
    UserRemove,
} from "iconsax-react";
import { MoreIcon } from "./icons";
import { useContext } from "react";
import { ArtistDetailContext } from "../pages/ArtistDetailPage";

const ArtistOptions = () => {
    const artistContext = useContext(ArtistDetailContext);
    if (!artistContext) {
        throw new Error("FollowArtistButton must be used within ArtistDetailContext");
    }
    const { isFollowing, handleChangeStatus } = artistContext;
    return (
        <Menu width={200} position="bottom-start">
            <Menu.Target>
                <button type="button" className="text-zinc-400">
                    <MoreIcon size={24} />
                </button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    leftSection={isFollowing ? <UserRemove size={16} /> : <ProfileAdd size={16} />}
                    onClick={handleChangeStatus}
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </Menu.Item>
                <Menu.Item leftSection={<Forbidden size={16} />}>Don't play this artist</Menu.Item>
                <Menu.Item leftSection={<Airdrop size={16} />}>Go to artist radio</Menu.Item>
                <Menu.Item
                    component="a"
                    href="https://support.spotify.com/vn-vi/content-policy-reporting/plain/?uri=spotify%3Aartist%3A3Wj34lTDJnPp70u4YCl4jz&platform=desktop-web"
                    target="_blank"
                    rel="noreferrer"
                    leftSection={<Augur size={16} />}
                    rightSection={<ExportSquare size={16} />}
                >
                    Report
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                    component="a"
                    href="spotify://"
                    leftSection={<Spotify size={16} variant="Bold" />}
                >
                    Open in Desktop app
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};

export default ArtistOptions;
