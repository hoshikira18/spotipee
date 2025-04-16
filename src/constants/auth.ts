import { codeChallenge } from "../utils/auth";

// if codeChallenge is exist in localStorage, prevent create new codeChallenge
export const CODE_CHALLENGE = localStorage.getItem(codeChallenge) ?? codeChallenge;
export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
export const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
export const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
export const SCOPE =
    "streaming user-read-private user-read-email user-follow-read user-read-recently-played user-library-read user-read-playback-position user-read-playback-state user-library-modify user-library-read";
export const CODE_CHALLENGE_METHOD = import.meta.env.VITE_CODE_CHALLENGE_METHOD;

export const AUTH_URL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPE}&code_challenge_method=${CODE_CHALLENGE_METHOD}&code_challenge=${CODE_CHALLENGE}&redirect_uri=${REDIRECT_URI}`;
