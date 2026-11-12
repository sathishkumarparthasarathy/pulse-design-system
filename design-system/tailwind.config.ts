import type { Config } from "tailwindcss";
import {
  colors,
  typography,
  radius,
  shadow,
  blur,
  gradients,
} from "../src/tokens/primitives";

/**
 * Same theme as the repository's tailwind.config.ts — the design system's
 * stylesheet must be the one the product uses. Only `content` differs: it
 * scans the previews this folder ships, so bundle.css carries exactly the
 * classes the artifact's cards need and nothing more.
 */
export default {
  content: [
    "./src/**/*.{ts,tsx}",
    "./design-system/previews/**/*.html",
  ],
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
