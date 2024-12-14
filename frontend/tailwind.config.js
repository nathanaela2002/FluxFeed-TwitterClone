import daisyui from "daisyui"; // Import DaisyUI plugin for Tailwind CSS
import daisyUIThemes from "daisyui/src/theming/themes"; // Import predefined DaisyUI themes

/** @type {import('tailwindcss').Config} */
// Export Tailwind CSS configuration
export default {
    // Define files where Tailwind CSS classes will be used
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

    // Extend the default theme with custom styles
    theme: {
        extend: {
            colors: {
                'custom-purple': '#291334', // Custom purple color for branding
                'soft-purple': '#dfd5e6', // Softer purple for UI elements
            },
        },
    },

    // Add plugins to Tailwind CSS
    plugins: [daisyui], // Use the DaisyUI plugin for enhanced component styling

    // Configure DaisyUI themes
    daisyui: {
        themes: [
            "light", // Default light theme
            {
                pastel: {
                    ...daisyUIThemes["light", "dark", "cupcake"], // Extend from predefined themes
                    "base-100": "#edf8fa", // Set the base background color
                    primary: "rgba(209,193,215,255)", // Set primary color in pastel tone
                    secondary: "rgba(246,203,209,255)", // Set secondary color in pastel tone
                },
            },
        ],
    },
};