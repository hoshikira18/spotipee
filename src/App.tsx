import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "@mantine/core/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import { Button, MantineProvider, createTheme } from "@mantine/core";
import { NavigationProgress, nprogress } from "@mantine/nprogress";
import { useEffect } from "react";
import ErrorPage from "./components/pages/ErrorPage";
import HomePage from "./components/pages/HomePage";
import Layout from "./components/templates/Layout";
import { generateRandomString } from "./utils/auth";
import ArtistDetailPage from "./components/pages/ArtistDetailPage";
import { useIsFetching } from "@tanstack/react-query";
import PlayerProvider from "./contexts/PlayerContext";
import TrackProvider from "./contexts/TrackContext";

const theme = createTheme({
    colors: {
        // cGreen = custom green
        cGreen: [
            "#e8f5e9",
            "#c8e6c9",
            "#a5d6a7",
            "#81c784",
            "#4caf50",
            "#1DB954",
            "#18a74d",
            "#12813a",
            "#0c5b27",
            "#063214",
        ],
    },
    primaryColor: "cGreen",
    components: {
        Button: Button.extend({
            defaultProps: {
                radius: "xl",
            },
        }),
    },
});

const router = createBrowserRouter([
    {
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/artist/:artistId",
                element: <ArtistDetailPage />,
            },
        ],
    },
]);

function App() {
    // generate code_verifier for auth PKEC
    useEffect(() => {
        const code = localStorage.getItem("code_verifier");
        if (!code) {
            const codeVerifier = generateRandomString(64);
            localStorage.setItem("code_verifier", codeVerifier);
        }
    }, []);

    const isFetching = useIsFetching();

    useEffect(() => {
        if (isFetching) {
            nprogress.start();
        } else {
            nprogress.complete();
        }
    }, [isFetching]);

    return (
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <TrackProvider>
                <PlayerProvider>
                    <Notifications position="top-right" />
                    <NavigationProgress />
                    <RouterProvider router={router} />
                </PlayerProvider>
            </TrackProvider>
        </MantineProvider>
    );
}

export default App;
