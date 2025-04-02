import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "../constants/auth";

export const useAuth = (code: string | null) => {
    const [accessToken, setAccessToken] = useState<string | null>(
        Cookies.get("access_token") || null,
    );
    const [refreshToken, setRefreshToken] = useState<string | null>(
        Cookies.get("refresh_token") || null,
    );

    // get access_token
    useEffect(() => {
        if (!code || accessToken) return;

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

                Cookies.set("access_token", data.access_token, {
                    // js-cookie use days for expire time, not miliseconds
                    expires: data?.expires_in ? data.expires_in / (3600 * 24) : 0,
                    secure: true,
                });
                setAccessToken(data.access_token);

                Cookies.set("refresh_token", data?.refresh_token, {
                    // refresh_token will be expire in a month
                    expires: 30,
                    secure: true,
                });
                setRefreshToken(data.refresh_token);

                // clear url
                window.history.pushState({}, "", "/");
            } catch (err: any) {
                console.log(err);
            }
        };

        fetchToken();
    }, [code]);

    const isAuth = Boolean(accessToken);

    return { accessToken, refreshToken, isAuth };
};
