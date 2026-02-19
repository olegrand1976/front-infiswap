// Tailwind CSS v4 configuration
// Main configuration is now in app/assets/css/tailwind.css using @theme
// This file contains container and plugin configuration

import animate from 'tailwindcss-animate';

export default {
    content: [
        './app/**/*.{vue,js,ts,jsx,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1400px',
            },
        },
    },
    plugins: [animate],
};
