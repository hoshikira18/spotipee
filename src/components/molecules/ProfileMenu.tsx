import { Button, Menu, Text } from "@mantine/core";
import { Setting } from "iconsax-react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import ProfileButton from "../atoms/ProfileButton";

function ProfileMenu() {
    const { data: currentUser } = useCurrentUser();

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <button
                    type="button"
                    className="rounded-full p-1.5 aspect-square w-12 cursor-pointer bg-zinc-900"
                >
                    <ProfileButton currentUser={currentUser} />
                </button>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item leftSection={<Setting size={14} />}>Settings</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}

export default ProfileMenu;
