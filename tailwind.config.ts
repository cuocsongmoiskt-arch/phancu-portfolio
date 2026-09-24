import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#F7F7F5", alt: "#EFEFEA" },
        ink: { 900: "#1E2A33", 700: "#2C3A45", 500: "#5E6B75" },
        surface: { DEFAULT: "#FFFFFF", sub: "#F7F7F5" },
        line: "#E4E3DE",
        accent: { 600: "#3F6A5B", 50: "#E3EDE7" },
        highlight: "#B08A55",
        band: { DEFAULT: "#2C4150", deep: "#22333F" },
      },
      fontFamily: {
        display: [
          "var(--font-archivo)",
          "var(--font-noto-sans-sc)",
          "system-ui",
          "sans-serif",
        ],
        sans: [
          "var(--font-plex-sans)",
          "var(--font-noto-sans-sc)",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: { container: "1440px" },
      boxShadow: {
        soft: "var(--shadow-1)",
        card: "var(--shadow-2)",
        lifted: "var(--shadow-3)",
      },
    },
  },
  plugins: [],
};
export default config;
