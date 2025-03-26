import { nprogress } from "@mantine/nprogress";
import { useEffect } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Header from "../organisms/Header";
import SideBar from "../organisms/SideBar";

const Layout = () => {
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
            <Header />
            <div>
                <SideBar />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
