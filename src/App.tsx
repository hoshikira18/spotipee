import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/atoms/Layout";
import "@mantine/core/styles.css";
import "@mantine/nprogress/styles.css";
import { Button, MantineProvider, createTheme } from "@mantine/core";
import { NavigationProgress } from "@mantine/nprogress";
import ErrorPage from "./components/pages/ErrorPage";
import HomePage from "./components/pages/HomePage";

const theme = createTheme({
    colors: {
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
        ],
    },
]);

function App() {
    return (
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <NavigationProgress />
            <RouterProvider router={router} />
        </MantineProvider>
    );
}

export default App;
