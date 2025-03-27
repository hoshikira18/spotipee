/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                customGray: {
                    100: "#9f9f9f",
                    500: "#393939",
                    900: "#353535",
                },
            },
            fontFamily: {
                spotify: ["CircularSpotify", "sans-serif"],
            },
        },
    },
    plugins: [],
};
