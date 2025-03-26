import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App.js";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const reactQuery = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Number.POSITIVE_INFINITY,
            cacheTime: Number.POSITIVE_INFINITY,
        },
    },
});

root.render(
    <StrictMode>
        <QueryClientProvider client={reactQuery}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </StrictMode>,
);
