import { Loader, Menu } from "@mantine/core";
import { Logout, MusicDashboard } from "iconsax-react";
import { useAuth } from "../../hooks/useAuth";
import type { User } from "../../types";
import { getImage } from "../../utils";
import { modals } from "@mantine/modals";
import { lazy, Suspense } from "react";
const Dashboard = lazy(() => import("../pages/Dashboard"));

type ProfileButton = {
    currentUser?: User;
};

function ProfileButton({ currentUser }: ProfileButton) {
    const image = getImage(64, currentUser?.images);
    const { logout } = useAuth(null);

    const openDashboard = () => {
        modals.open({
            children: (
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center h-full">
                            <Loader />
                        </div>
                    }
                >
                    <Dashboard />
                </Suspense>
            ),
            fullScreen: true,
        });
    };

    return (
        <Menu>
            <Menu.Target>
                <div className="w-12 rounded-full overflow-hidden bg-zinc-800 p-1.5 cursor-pointer">
                    {image ? (
                        <img src={image} alt="user-image" className="rounded-full" />
                    ) : (
                        <span>{currentUser?.display_name.charAt(0)}</span>
                    )}
                </div>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item onClick={openDashboard} leftSection={<MusicDashboard size={14} />}>
                    <p className="font-spotify">Dashboard</p>
                </Menu.Item>
                <Menu.Item onClick={logout} leftSection={<Logout size={14} />}>
                    <p className="font-spotify">Log out</p>
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}

export default ProfileButton;
