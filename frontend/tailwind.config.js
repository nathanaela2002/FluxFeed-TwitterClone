import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                'custom-purple': '#291334',
                'soft-purple': '#dfd5e6',
            },
        },
    },
    plugins: [daisyui],

    daisyui: {
        themes: [
            "light",
            {
                pastel: {
                    ...daisyUIThemes["light", "dark", "cupcake"],
                    "base-100": "#edf8fa",
                    primary: "rgba(209,193,215,255)",
                    secondary: "rgba(246,203,209,255)",
                },
            },
        ],
    },
};