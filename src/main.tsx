import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.js";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const reactQuery = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: Number.POSITIVE_INFINITY,
            refetchOnWindowFocus: false,
        },
    },
});

root.render(
    <QueryClientProvider client={reactQuery}>
        <App />
    </QueryClientProvider>,
);
