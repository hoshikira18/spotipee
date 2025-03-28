import axios from "axios";
import { useEffect, useState } from "react";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "../constants/auth";
interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
}

export const useAuth = (code: string | null) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(
        localStorage.getItem("refresh_token"),
    );
    const [expiresIn, setExpiresIn] = useState<number | null>(null);

    // get access_token
    useEffect(() => {
        if (!code) return;

        const fetchToken = async () => {
            try {
                // get code verifier from localStorage
                const codeVerifier = localStorage.getItem("code_verifier");

                // config header, body
                const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
                const headers = {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Basic ${basicAuth}`,
                    },
                };
                const body = {
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: REDIRECT_URI,
                    code_verifier: codeVerifier,
                };

                const { data } = await axios.post(
                    "https://accounts.spotify.com/api/token",
                    body,
                    headers,
                );

                // set value for AT, RT, Expires time
                setAccessToken(data?.access_token || null);
                setRefreshToken(data?.refresh_token || null);
                setExpiresIn(data?.expires_in || null);

                // refresh_token will exist forever =))
                localStorage.setItem("refresh_token", data?.refresh_token);

                // clear url
                window.history.pushState({}, "", "/");
            } catch (err: any) {
                console.log(err);
            }
        };

        fetchToken();
    }, [code]);

    // handle get refresh token function
    const handleRefreshToken = async (): Promise<SpotifyTokenResponse | undefined> => {
        try {
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

            setAccessToken(data?.access_token || null);
            setRefreshToken(data?.refresh_token || null);
            setExpiresIn(data?.expires_in || null);

            // after refresh, a new refresh_token will be returned
            localStorage.setItem("refresh_token", data?.refresh_token);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    // auto refresh_token before expires 1m
    useEffect(() => {
        if (!refreshToken || !expiresIn) return;
        const timeout = setTimeout(
            handleRefreshToken,
            // get refresh token before expires 1m
            (expiresIn - 60) * 1000,
        );
        return () => clearTimeout(timeout);
    }, [refreshToken, expiresIn]);

    // refresh token when access/reload page
    useEffect(() => {
        if (!refreshToken) return;
        handleRefreshToken();
    }, []);

    return {
        accessToken,
        refreshToken,
    };
};
