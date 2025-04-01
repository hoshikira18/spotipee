import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { CLIENT_ID } from "../constants/auth";

interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
}

const BASE_URL = "https://api.spotify.com/v1";

export const instance = axios.create({
    baseURL: BASE_URL,
});

let abortController = new AbortController(); // Global AbortController

// Attach Access Token to Requests
instance.interceptors.request.use((request: InternalAxiosRequestConfig) => {
    const accessToken = Cookies.get("access_token");

    if (accessToken) {
        request.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    request.signal = abortController.signal;

    return request;
});

const handleRefreshToken = async (): Promise<SpotifyTokenResponse | undefined> => {
    try {
        const refreshToken = Cookies.get("refresh_token");

        // Abort all ongoing requests
        abortController.abort("Aborted ongoing requests due to token refresh.");
        abortController = new AbortController();

        const { data } = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken || "",
                client_id: CLIENT_ID,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        );

        Cookies.set("access_token", data.access_token, {
            expires: data?.expires_in ? data.expires_in / (3600 * 24) : 0,
            secure: true,
        });

        Cookies.set("refresh_token", data?.refresh_token, {
            expires: 30,
            secure: true,
        });

        return data;
    } catch (error: any) {
        console.error(error);
    }
};

// Refresh token
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                const data = await handleRefreshToken();
                if (data) {
                    error.config.headers.Authorization = `Bearer ${data.access_token}`;
                    error.config.signal = abortController.signal; // Attach the new signal
                    return instance(error.config);
                }
            } catch (error) {
                console.error(error);
            }
        }
        return Promise.reject(error);
    },
);
