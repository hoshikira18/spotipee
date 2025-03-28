export const generateRandomString = (length: number) => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
};
const base64encode = (input: number) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
};

// get codeVerifier from localStorage
const codeVerifier = localStorage.getItem("code_verifier") as string;

const hashed = await sha256(codeVerifier);
export const codeChallenge = base64encode(hashed);

// set codeChallenge to use in login url
localStorage.setItem("code_challenge", codeChallenge);
