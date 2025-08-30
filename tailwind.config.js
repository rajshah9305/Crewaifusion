/** @type {import(‘tailwindcss’).Config} */
export default {
content: [
“./index.html”,
“./src/**/*.{js,ts,jsx,tsx}”,
],
theme: {
extend: {
fontFamily: {
sans: [‘Inter’, ‘system-ui’, ‘sans-serif’],
},
animation: {
‘pulse-glow’: ‘pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite’,
‘working’: ‘working 1.5s ease-in-out infinite alternate’,
},
keyframes: {
working: {
‘0%’: { opacity: ‘0.5’ },
‘100%’: { opacity: ‘1’ },
}
},
boxShadow: {
‘glow’: ‘0 0 20px rgba(59, 130, 246, 0.5)’,
‘glow-green’: ‘0 0 20px rgba(34, 197, 94, 0.5)’,
}
},
},
plugins: [],
}
