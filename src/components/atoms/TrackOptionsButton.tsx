import { Menu } from "@mantine/core";
import { Forbidden, Airdrop, Augur, ExportSquare, Spotify } from "iconsax-react";
import { MoreIcon } from "./icons";

const TrackOptions = () => {
    return (
        <Menu width={200} position="bottom-start">
            <Menu.Target>
                <button type="button" className="text-zinc-400">
                    <MoreIcon size={24} />
                </button>
            </Menu.Target>
            <Menu.Dropdown>
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

export default TrackOptions;
