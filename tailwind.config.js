/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    colors: {
      // Custom palette
      primary: '#0E0E0E', // Jet Black
      accent: '#9B5DE5', // Electric Purple
      secondary: '#1F1F1F', // Cool Gray
      textLight: '#F1F1F1', // Soft White
    },
  },
};
export const plugins = [];
