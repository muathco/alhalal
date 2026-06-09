import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          red: "#ED1C24",
          dark: "#1A1A1A",
          off: "#F5F0EB",
          border: "#E0D8D0",
          gray: "#6B6460",
        },
      },
      fontFamily: {
        sans: ["Thmanyah", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
