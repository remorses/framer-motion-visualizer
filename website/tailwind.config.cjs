const colors = require('beskar/colors')

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
    mode: 'jit',
    content: [
        './src/**/*.{js,ts,jsx,tsx}', //
        '../beskar/src/**/*.{js,ts,jsx,tsx}', //
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                
                ...colors,
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
