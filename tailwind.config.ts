import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#221735",
        school: "#6D28D9",
        accent: "#F5B301",
        plum: "#4C1D95",
        honey: "#FFF4C7"
      },
      boxShadow: {
        soft: "0 14px 34px rgba(76, 29, 149, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
