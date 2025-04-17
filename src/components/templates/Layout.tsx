import { Outlet, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Header from "../organisms/Header";
import LeftSideBar from "../organisms/LeftSideBar";
import RightSideBar from "../organisms/RightSideBar";
import { Button } from "@mantine/core";
import Player from "../organisms/Player/Player";
import { cn } from "../../utils";

const Layout = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const { isAuth, isLoading } = useAuth(code);

    return (
        <div className="bg-black fixed inset-0 h-screen text-white font-spotify px-2 flex flex-col pb-2">
            <Header />

            {/* LeftSideBar */}
            <div className="flex h-full min-h-[calc(100vh-150px)] overflow-hidden">
                <LeftSideBar />
                <div className="flex-1 bg-black px-2">
                    <Outlet />
                </div>
                <RightSideBar />
            </div>

            <footer
                className={cn("h-20 mt-2", {
                    hidden: isLoading,
                })}
            >
                {isAuth ? (
                    <div className="h-full px-5 pb-2">
                        <Player />
                    </div>
                ) : (
                    <div className="h-full pb-2">
                        <div className="bg-gradient-to-r from-pink-500 to-sky-400 h-full p-3 flex items-center justify-between">
                            <div>
                                <span className="font-semibold">Preview of Spotify</span>
                                <p>
                                    Sign up to get unlimited songs and podcasts with occasional ads.
                                    No credit card needed.
                                </p>
                            </div>
                            <Button
                                fz={"md"}
                                size="lg"
                                color="white"
                                c={"black"}
                                className="hover:scale-105 transition-all duration-150 hover:!bg-zinc-200"
                            >
                                Sign up free
                            </Button>
                        </div>
                    </div>
                )}
            </footer>
        </div>
    );
};

export default Layout;
