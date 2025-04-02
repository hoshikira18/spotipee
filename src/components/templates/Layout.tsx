import { nprogress } from "@mantine/nprogress";
import { useEffect } from "react";
import { Outlet, useNavigation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Header from "../organisms/Header";
import Player from "../organisms/Player";
import SideBar from "../organisms/SideBar";

const Layout = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    useAuth(code);

    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";

    useEffect(() => {
        if (isLoading) {
            nprogress.start();
        } else {
            nprogress.complete();
        }
    }, [isLoading]);

    return (
        <div className={"h-screen bg-black"}>
            <div className="h-[80px]">
                <Header />
            </div>
            <div className="max-h-[calc(100vh-170px)] flex p-2 space-x-2 space-y-2">
                <SideBar />
                <main className="">
                    <Outlet />
                </main>
            </div>
            <div className="h-[80px] fixed bottom-0 left-0 right-0 text-zinc-300">
                <Player />
            </div>
        </div>
    );
};

export default Layout;
