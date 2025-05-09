import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "@mantine/core/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import {
    Button,
    MantineProvider,
    type VariantColorsResolver,
    createTheme,
    defaultVariantColorsResolver,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
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
import "./App.css";
import ArtistDiscographyPage from "./components/pages/ArtistDiscographyPage";
import RelatedArtistPage from "./components/pages/RelatedArtistPage";
import PLaylistDetailPage from "./components/pages/PLaylistDetailPage";
import AlbumDetailPage from "./components/pages/AlbumDetailPage";
import TrackDetailPage from "./components/pages/TrackDetailPage";
import NowPlayingProvider from "./contexts/NowPlayingContext";
import UserTopTracksPage from "./components/pages/UserTopTracksPage";
import UserTopArtistsPage from "./components/pages/UserTopArtistsPage";
import SearchPage from "./components/pages/SearchPage";
import SearchDetail from "./components/pages/SearchDetail";
import SearchDetailWithTypePage from "./components/pages/SearchDetailWithTypePage";
import SearchPageLayout from "./components/templates/SearchPageLayout";
import Dashboard from "./components/pages/Dashboard";
import CustomModalProvider from "./components/organisms/CustomModal/CustomModalProvider";

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

const variantColorResolver: VariantColorsResolver = (input) => {
    const defaultResolvedColors = defaultVariantColorsResolver(input);

    // Add new variants support
    if (input.variant === "filter") {
        return {
            background: "#27272a",
            hover: "#3f3f46",
            color: "var(--mantine-color-white)",
            border: "none",
        };
    }

    if (input.variant === "filter-active") {
        return {
            background: "#f1f1f1",
            hover: "#f0f0f0",
            color: "var(--mantine-color-black)",
            border: "none",
        };
    }

    return defaultResolvedColors;
};

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
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                path: "/search",
                element: <SearchPage />,
            },
            {
                element: <SearchPageLayout />,
                children: [
                    {
                        path: "/search/:query",
                        element: <SearchDetail />,
                    },
                    {
                        path: "/search/:query/:type",
                        element: <SearchDetailWithTypePage />,
                    },
                ],
            },
            {
                path: "/top-tracks",
                element: <UserTopTracksPage />,
            },
            {
                path: "/top-artists",
                element: <UserTopArtistsPage />,
            },
            {
                path: "/playlist/:playlistId",
                element: <PLaylistDetailPage />,
            },
            {
                path: "/album/:albumId",
                element: <AlbumDetailPage />,
            },
            {
                path: "/track/:trackId",
                element: <TrackDetailPage />,
            },
            {
                path: "/artist/:artistId",
                element: <ArtistDetailPage />,
            },
            {
                path: "/artist/:artistId/discography",
                element: <ArtistDiscographyPage />,
            },
            {
                path: "/artist/:artistId/discography/:type",
                element: <ArtistDiscographyPage />,
            },
            {
                path: "/artist/:artistId/related",
                element: <RelatedArtistPage />,
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
        <MantineProvider theme={{ ...theme, variantColorResolver }} defaultColorScheme="dark">
            <ModalsProvider>
                <CustomModalProvider>
                    <TrackProvider>
                        <PlayerProvider>
                            <NowPlayingProvider>
                                <Notifications position="top-right" />
                                <NavigationProgress />
                                <RouterProvider router={router} />
                            </NowPlayingProvider>
                        </PlayerProvider>
                    </TrackProvider>
                </CustomModalProvider>
            </ModalsProvider>
        </MantineProvider>
    );
}

export default App;
