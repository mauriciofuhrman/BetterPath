import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        muted: "hsl(var(--muted))",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        buttonheartbeat: "buttonheartbeat 4s infinite ease-in-out",
      },
      keyframes: {
        buttonheartbeat: {
          "0%": {
            "box-shadow": "0 0 0 0 hsl(var(--accent-blue))",
            transform: "scale(1)",
          },
          "50%": {
            "box-shadow": "0 0 0 7px hsl(var(--accent-blue) / 0)",
            transform: "scale(1.05)",
          },
          "100%": {
            "box-shadow": "0 0 0 0 hsl(var(--accent-blue) / 0)",
            transform: "scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
