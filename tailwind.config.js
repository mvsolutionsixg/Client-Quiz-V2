/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'tally-green': '#39B54A',
                'tally-yellow': '#F7D71C',
                'brand-dark': '#1a1a1a',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'bounce-slow': 'bounce 3s infinite',
            },
            boxShadow: {
                'neon-green': '0 0 10px #39B54A, 0 0 20px #39B54A',
                'neon-red': '0 0 10px #EF4444, 0 0 20px #EF4444',
            }
        },
    },
    plugins: [],
}
