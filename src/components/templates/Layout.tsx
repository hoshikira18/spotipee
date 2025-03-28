import { nprogress } from "@mantine/nprogress";
import { useEffect } from "react";
import { Outlet, useNavigation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Header from "../organisms/Header";
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
