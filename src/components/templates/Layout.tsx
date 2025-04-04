import { Outlet, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Header from "../organisms/Header";
import LeftSideBar from "../organisms/LeftSideBar";
import RightSideBar from "../organisms/RightSideBar";

const Layout = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    useAuth(code);

    return (
        <div className="bg-black fixed inset-0 h-screen text-white font-spotify px-2 space-y-2">
            <Header />

            {/* LeftSideBar */}
            <div className="flex h-[calc(100vh-160px)] overflow-hidden">
                <LeftSideBar />
                <div className="flex-1 bg-black px-3">
                    <Outlet />
                </div>
                <RightSideBar />
            </div>

            <footer className="h-20 fixed left-0 right-0 bottom-0">Footer</footer>
        </div>
    );
};

export default Layout;
