import { Outlet, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Header from "../organisms/Header";
import LeftSideBar from "../organisms/LeftSideBar";
import RightSideBar from "../organisms/RightSideBar";
import Player from "../organisms/Player";

const Layout = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    useAuth(code);

    return (
        <div className="bg-black fixed inset-0 h-screen text-white font-spotify px-2">
            <Header />

            {/* LeftSideBar */}
            <div className="flex h-[calc(100vh-150px)] overflow-hidden space-x-2">
                <LeftSideBar />
                <div className="flex-1 bg-black overflow-hidden">
                    <Outlet />
                </div>
                <RightSideBar />
            </div>

            <footer className="h-20 fixed left-0 right-0 bottom-0 px-5 pb-2">
                <Player />
            </footer>
        </div>
    );
};

export default Layout;
