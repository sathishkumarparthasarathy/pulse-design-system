import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  GoogleColor,
  AppleColor,
  GitHubColor,
  XColor,
  FacebookColor,
  MicrosoftColor,
  LinkedInColor,
} from "@/icons/brand";
import { cn } from "@/lib/cn";

/**
 * Untitled UI SocialButton.
 *
 * For sign-in / OAuth flows. Two visual modes:
 *   - "default" — white surface, gray border, color brand icon (Untitled UI default)
 *   - "brand"   — uses the brand's own background (Google's white-on-blue, Apple's black, etc.)
 *
 * Provider determines the icon. Children = label (typically "Sign in with X").
 */

const styles = cva(
  [
    "inline-flex items-center justify-center gap-3",
    "font-semibold whitespace-nowrap rounded-md border",
    "shadow-xs transition-colors duration-100",
    "focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-[18px] text-base",
        xl: "h-12 px-5 text-base",
      },
      mode: {
        default: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus-visible:shadow-ring-gray",
        brand: "",
      },
      provider: {
        google: "",
        apple: "",
        github: "",
        x: "",
        facebook: "",
        microsoft: "",
        linkedin: "",
      },
    },
    compoundVariants: [
      // Brand mode — each provider uses its own background per Untitled UI spec
      { mode: "brand", provider: "google",    className: "bg-white text-gray-900 border-gray-200 hover:bg-gray-50" },
      { mode: "brand", provider: "apple",     className: "bg-black text-white border-black hover:bg-gray-900" },
      { mode: "brand", provider: "github",    className: "bg-gray-900 text-white border-gray-900 hover:bg-gray-800" },
      { mode: "brand", provider: "x",         className: "bg-black text-white border-black hover:bg-gray-900" },
      { mode: "brand", provider: "facebook",  className: "bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#1565CC]" },
      { mode: "brand", provider: "microsoft", className: "bg-white text-gray-900 border-gray-200 hover:bg-gray-50" },
      { mode: "brand", provider: "linkedin",  className: "bg-[#0A66C2] text-white border-[#0A66C2] hover:bg-[#075599]" },
    ],
    defaultVariants: {
      size: "md",
      mode: "default",
      provider: "google",
    },
  }
);

const providerIcon = {
  google: GoogleColor,
  apple: AppleColor,
  github: GitHubColor,
  x: XColor,
  facebook: FacebookColor,
  microsoft: MicrosoftColor,
  linkedin: LinkedInColor,
} as const;

export type SocialProvider = keyof typeof providerIcon;

export interface SocialButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">,
    VariantProps<typeof styles> {
  provider: SocialProvider;
  /** Render an `<a>` instead of `<button>` (for OAuth redirect URLs) */
  href?: string;
  /** Override the default "Sign in with X" label */
  children?: React.ReactNode;
  fullWidth?: boolean;
}

const defaultLabel: Record<SocialProvider, string> = {
  google: "Sign in with Google",
  apple: "Sign in with Apple",
  github: "Sign in with GitHub",
  x: "Sign in with X",
  facebook: "Sign in with Facebook",
  microsoft: "Sign in with Microsoft",
  linkedin: "Sign in with LinkedIn",
};

export const SocialButton = React.forwardRef<HTMLButtonElement, SocialButtonProps>(
  ({ className, size, mode, provider, href, children, fullWidth, ...props }, ref) => {
    const Icon = providerIcon[provider];
    const content = (
      <>
        <Icon className="h-5 w-5 shrink-0" />
        {children ?? defaultLabel[provider]}
      </>
    );

    if (href) {
      return (
        <a
          href={href}
          className={cn(styles({ size, mode, provider }), fullWidth && "w-full", className)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn(styles({ size, mode, provider }), fullWidth && "w-full", className)}
        {...props}
      >
        {content}
      </button>
    );
  }
);
SocialButton.displayName = "SocialButton";
