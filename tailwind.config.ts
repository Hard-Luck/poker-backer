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
        "theme-header": "#3F88C5",
        "theme-accent-silver": "#C1BDB3",
        "theme-red": "#E94F37",
      },
    },
  },
  plugins: [],
} satisfies Config;
