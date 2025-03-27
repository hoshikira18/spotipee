import axios from "axios";
import qs from "qs";
import { useEffect, useState } from "react";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "../constants/auth";

export const useAuth = (code: string | null) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [expiresIn, setExpiresIn] = useState<number | null>(null);

    useEffect(() => {
        localStorage.setItem("code", code || "");
    }, [code]);

    useEffect(() => {
        if (!code) return;

        const fetchToken = async () => {
            try {
                const codeVerifier = localStorage.getItem("code_verifier");

                const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
                const headers = {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Basic ${basicAuth}`,
                    },
                };
                const data = {
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: REDIRECT_URI,
                    code_verifier: codeVerifier,
                };

                const res = await axios.post(
                    "https://accounts.spotify.com/api/token",
                    qs.stringify(data),
                    headers,
                );

                console.log(res);

                setAccessToken(res.data?.access_token || null);
                setRefreshToken(res.data?.refresh_token || null);
                setExpiresIn(res.data?.expires_in || null);
                // clear url
                window.history.pushState({}, "", "/");
            } catch (err: any) {
                console.log(err);
            }
        };

        fetchToken();
    }, [code]);

    useEffect(() => {
        if (!refreshToken || !expiresIn) return;
        const timeout = setTimeout(async () => {
            try {
                const payload = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        grant_type: "refresh_token",
                        refresh_token: refreshToken,
                        client_id: CLIENT_ID,
                    }),
                };
                const body = await fetch("https://accounts.spotify.com/api/token", payload);
                const res = await body.json();

                setAccessToken(res?.access_token || null);
                setRefreshToken(res?.refresh_token || null);
                setExpiresIn(res?.expires_in || null);

                // clear url
                window.history.pushState({}, "", "/");
            } catch (err: any) {
                console.log(err);
            }
        }, 1000);
        return () => clearTimeout(timeout);
    }, [refreshToken, expiresIn]);

    return {
        accessToken,
        refreshToken,
    };
};
