import { codeChallenge } from "../utils/auth";

export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
export const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
export const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const SCOPE = import.meta.env.VITE_AUTH_SCOPE;
const CODE_CHALLENGE_METHOD = import.meta.env.VITE_CODE_CHALLENGE_METHOD;

export const AUTH_URL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPE}&code_challenge_method=${CODE_CHALLENGE_METHOD}&code_challenge=${codeChallenge}&redirect_uri=http://localhost:5173`;
