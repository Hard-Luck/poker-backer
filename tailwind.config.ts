import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "theme-black": "#232931",
        "theme-grey": "#393E46",
        "theme-green": "#4ECCA3",
        "theme-white": "#EEEEEE",
        "theme-red": "#A34E4E",
      },
    },
  },
  plugins: [],
} satisfies Config;
