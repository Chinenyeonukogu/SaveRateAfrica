import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#00C853",
          yellow: "#FFD600",
          navy: "#0A1628",
          coral: "#FF5722",
          light: "#F4F6F9",
          white: "#FFFFFF"
        }
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      boxShadow: {
        float: "0 20px 60px rgba(10, 22, 40, 0.12)",
        glow: "0 12px 32px rgba(0, 200, 83, 0.24)"
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at top left, rgba(255,214,0,0.22), transparent 30%), radial-gradient(circle at 80% 20%, rgba(0,200,83,0.28), transparent 28%), linear-gradient(135deg, #00C853 0%, #0A1628 70%)"
      }
    }
  },
  plugins: []
};

export default config;
