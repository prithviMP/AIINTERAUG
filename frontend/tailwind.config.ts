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
        canvas: "#09090B",
        surface: {
          DEFAULT: "#121215",
          raised: "#18181B",
          high: "#27272A",
        },
        emerald: {
          DEFAULT: "#10B981",
          glow: "#34D399",
          soft: "rgba(16, 185, 129, 0.1)",
        },
        ink: {
          DEFAULT: "#FAFAFA",
          secondary: "#A1A1AA",
          muted: "#71717A",
        },
        warn: "#F59E0B",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        ring: "0 0 0 1px #10B981",
        bevel:
          "inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px #27272A",
      },
      borderRadius: {
        panel: "0.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
