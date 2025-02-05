import { deepPurple, pink } from "@mui/material/colors";
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const deepPurpleColors = Object.entries(deepPurple).reduce(
  (previous, [key, value]) => ({ ...previous, [`primary-${key}`]: value }),
  {
    "primary-dark": deepPurple[700],
    "primary-light": deepPurple[300],
    "primary-main": deepPurple[500],
  }
);

const pinkColors = Object.entries(pink).reduce(
  (previous, [key, value]) => ({ ...previous, [`secondary-${key}`]: value }),
  {
    "secondary-dark": pink[700],
    "secondary-light": pink[300],
    "secondary-main": pink[500],
  }
);

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        alegreya: ["Alegreya", ...defaultTheme.fontFamily.sans],
      },
      fontWeight: {
        alegreyaRegular: "400",
        alegreyaMedium: "500",
        alegreyaSemiBold: "600",
        alegreyaBold: "700",
        alegreyaExtraBold: "800",
        alegreyaBlack: "900",
      },
      colors: { ...deepPurpleColors, ...pinkColors },
    },
  },
  plugins: [],
};
export default config;
