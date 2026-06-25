import type { Config } from "tailwindcss";
import { colors } from "./src/tokens/colors";
import { typography } from "./src/tokens/typography";
import { radius, shadow, blur } from "./src/tokens/spacing";
import { gradients } from "./src/tokens/gradients";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize as never,
      fontWeight: typography.fontWeight,
      borderRadius: radius,
      boxShadow: shadow,
      blur,
      backdropBlur: blur,
      backgroundImage: gradients as unknown as Record<string, string>,
    },
  },
  plugins: [],
} satisfies Config;
