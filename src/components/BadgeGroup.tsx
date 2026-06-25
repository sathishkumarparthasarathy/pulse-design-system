import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Untitled UI BadgeGroup.
 *
 * A composite badge with a LEADING addon (pill/label) + TRAILING message.
 * Used for announcement banners, version tags, "New feature →" CTAs, etc.
 *
 * Variants:
 *   - pill-color   — outer tinted pill + inner white pill
 *   - pill-outline — outer transparent + inner outlined pill
 *   - badge-color  — squared (rounded-md) version of pill-color
 *   - modern       — white surface with shadow-xs ring + colored dot
 *
 * Themes: gray, brand, error, warning, success, blue, indigo, purple, pink, ai
 *
 * Sizes: md (h-7, 12px addon), lg (h-9, 14px addon)
 *
 * Layout options:
 *   - align="leading"  (default) — addon on left, message on right
 *   - align="trailing"            — message on left, addon on right
 */

const group = cva("inline-flex items-center font-medium gap-2 transition-colors", {
  variants: {
    variant: {
      "pill-color": "rounded-full border",
      "pill-outline": "rounded-full border bg-transparent",
      "badge-color": "rounded-md border",
      modern: "rounded-full bg-white border border-gray-300 shadow-xs text-gray-700",
    },
    size: {
      md: "h-7 pl-1 pr-2.5 text-xs",
      lg: "h-9 pl-1.5 pr-3 text-sm",
    },
    theme: {
      gray: "",
      brand: "",
      error: "",
      warning: "",
      success: "",
      blue: "",
      indigo: "",
      purple: "",
      pink: "",
      ai: "",
    },
  },
  compoundVariants: [
    // pill-color: tinted outer
    { variant: "pill-color", theme: "gray",    className: "bg-gray-50 border-gray-200 text-gray-700" },
    { variant: "pill-color", theme: "brand",   className: "bg-brand-50 border-brand-200 text-brand-700" },
    { variant: "pill-color", theme: "error",   className: "bg-error-50 border-error-200 text-error-700" },
    { variant: "pill-color", theme: "warning", className: "bg-warning-50 border-warning-200 text-warning-700" },
    { variant: "pill-color", theme: "success", className: "bg-success-50 border-success-200 text-success-700" },
    { variant: "pill-color", theme: "blue",    className: "bg-blue-50 border-blue-200 text-blue-700" },
    { variant: "pill-color", theme: "indigo",  className: "bg-indigo-50 border-indigo-200 text-indigo-700" },
    { variant: "pill-color", theme: "purple",  className: "bg-purple-50 border-purple-200 text-purple-700" },
    { variant: "pill-color", theme: "pink",    className: "bg-pink-50 border-pink-200 text-pink-700" },
    { variant: "pill-color", theme: "ai",      className: "bg-aiProcess-50 border-aiProcess-200 text-aiProcess-700" },

    // pill-outline: outlined outer
    { variant: "pill-outline", theme: "gray",    className: "border-gray-300 text-gray-700" },
    { variant: "pill-outline", theme: "brand",   className: "border-brand-300 text-brand-700" },
    { variant: "pill-outline", theme: "error",   className: "border-error-300 text-error-700" },
    { variant: "pill-outline", theme: "warning", className: "border-warning-300 text-warning-700" },
    { variant: "pill-outline", theme: "success", className: "border-success-300 text-success-700" },
    { variant: "pill-outline", theme: "blue",    className: "border-blue-300 text-blue-700" },
    { variant: "pill-outline", theme: "indigo",  className: "border-indigo-300 text-indigo-700" },
    { variant: "pill-outline", theme: "purple",  className: "border-purple-300 text-purple-700" },
    { variant: "pill-outline", theme: "pink",    className: "border-pink-300 text-pink-700" },
    { variant: "pill-outline", theme: "ai",      className: "border-aiProcess-300 text-aiProcess-700" },

    // badge-color: tinted squared
    { variant: "badge-color", theme: "gray",    className: "bg-gray-50 border-gray-200 text-gray-700" },
    { variant: "badge-color", theme: "brand",   className: "bg-brand-50 border-brand-200 text-brand-700" },
    { variant: "badge-color", theme: "error",   className: "bg-error-50 border-error-200 text-error-700" },
    { variant: "badge-color", theme: "warning", className: "bg-warning-50 border-warning-200 text-warning-700" },
    { variant: "badge-color", theme: "success", className: "bg-success-50 border-success-200 text-success-700" },
    { variant: "badge-color", theme: "blue",    className: "bg-blue-50 border-blue-200 text-blue-700" },
    { variant: "badge-color", theme: "indigo",  className: "bg-indigo-50 border-indigo-200 text-indigo-700" },
    { variant: "badge-color", theme: "purple",  className: "bg-purple-50 border-purple-200 text-purple-700" },
    { variant: "badge-color", theme: "pink",    className: "bg-pink-50 border-pink-200 text-pink-700" },
    { variant: "badge-color", theme: "ai",      className: "bg-aiProcess-50 border-aiProcess-200 text-aiProcess-700" },

    // Trailing alignment swaps padding
    { size: "md", className: "[&[data-align=trailing]]:pl-2.5 [&[data-align=trailing]]:pr-1" },
    { size: "lg", className: "[&[data-align=trailing]]:pl-3 [&[data-align=trailing]]:pr-1.5" },
  ],
  defaultVariants: { variant: "pill-color", theme: "brand", size: "md" },
});

// Inner addon pill — the leading badge
const addon = cva("inline-flex items-center gap-1 font-semibold rounded-full border", {
  variants: {
    variant: {
      "pill-color": "bg-white",
      "pill-outline": "bg-transparent",
      "badge-color": "bg-white rounded-md",
      modern: "bg-transparent border-transparent",
    },
    size: {
      md: "h-5 px-2 text-xs",
      lg: "h-6 px-2.5 text-xs",
    },
    theme: {
      gray: "", brand: "", error: "", warning: "", success: "",
      blue: "", indigo: "", purple: "", pink: "", ai: "",
    },
  },
  compoundVariants: [
    { variant: ["pill-color", "badge-color"], theme: "gray",    className: "border-gray-200 text-gray-700" },
    { variant: ["pill-color", "badge-color"], theme: "brand",   className: "border-brand-200 text-brand-700" },
    { variant: ["pill-color", "badge-color"], theme: "error",   className: "border-error-200 text-error-700" },
    { variant: ["pill-color", "badge-color"], theme: "warning", className: "border-warning-200 text-warning-700" },
    { variant: ["pill-color", "badge-color"], theme: "success", className: "border-success-200 text-success-700" },
    { variant: ["pill-color", "badge-color"], theme: "blue",    className: "border-blue-200 text-blue-700" },
    { variant: ["pill-color", "badge-color"], theme: "indigo",  className: "border-indigo-200 text-indigo-700" },
    { variant: ["pill-color", "badge-color"], theme: "purple",  className: "border-purple-200 text-purple-700" },
    { variant: ["pill-color", "badge-color"], theme: "pink",    className: "border-pink-200 text-pink-700" },
    { variant: ["pill-color", "badge-color"], theme: "ai",      className: "border-aiProcess-200 text-aiProcess-700" },

    { variant: "pill-outline", theme: "gray",    className: "border-gray-300 text-gray-700" },
    { variant: "pill-outline", theme: "brand",   className: "border-brand-300 text-brand-700" },
    { variant: "pill-outline", theme: "error",   className: "border-error-300 text-error-700" },
    { variant: "pill-outline", theme: "warning", className: "border-warning-300 text-warning-700" },
    { variant: "pill-outline", theme: "success", className: "border-success-300 text-success-700" },
    { variant: "pill-outline", theme: "blue",    className: "border-blue-300 text-blue-700" },
    { variant: "pill-outline", theme: "indigo",  className: "border-indigo-300 text-indigo-700" },
    { variant: "pill-outline", theme: "purple",  className: "border-purple-300 text-purple-700" },
    { variant: "pill-outline", theme: "pink",    className: "border-pink-300 text-pink-700" },
    { variant: "pill-outline", theme: "ai",      className: "border-aiProcess-300 text-aiProcess-700" },
  ],
  defaultVariants: { variant: "pill-color", theme: "brand", size: "md" },
});

const dotMap: Record<string, string> = {
  gray: "bg-gray-500",
  brand: "bg-brand-500",
  error: "bg-error-500",
  warning: "bg-warning-500",
  success: "bg-success-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  ai: "bg-aiProcess-500",
};

export type BadgeGroupTheme =
  | "gray" | "brand" | "error" | "warning" | "success"
  | "blue" | "indigo" | "purple" | "pink" | "ai";
export type BadgeGroupSize = "md" | "lg";
export type BadgeGroupVariant = "pill-color" | "pill-outline" | "badge-color" | "modern";

export interface BadgeGroupProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children">,
    Pick<VariantProps<typeof group>, never> {
  variant?: BadgeGroupVariant;
  theme?: BadgeGroupTheme;
  size?: BadgeGroupSize;
  /** Text shown inside the leading (or trailing) addon pill */
  addonText: React.ReactNode;
  /** The main message — rendered to the right of the addon */
  children: React.ReactNode;
  /** Where the addon pill sits relative to the message */
  align?: "leading" | "trailing";
  /** Optional icon next to the message (typically an arrow) */
  trailingIcon?: React.ReactNode;
  /** Optional dot inside the addon (only meaningful for `modern` variant) */
  dot?: boolean;
  /** Render the whole thing as a clickable anchor */
  href?: string;
  as?: "div" | "a" | "button";
}

export const BadgeGroup = React.forwardRef<HTMLElement, BadgeGroupProps>(
  (
    {
      className,
      variant = "pill-color",
      theme = "brand",
      size = "md",
      addonText,
      children,
      align = "leading",
      trailingIcon,
      dot,
      href,
      as,
      ...props
    },
    ref
  ) => {
    const Comp = (href ? "a" : as ?? "div") as "div";
    const isInteractive = !!href || as === "button" || as === "a";

    const addonNode =
      variant === "modern" ? (
        <span className="inline-flex items-center gap-1.5 pl-1 pr-2 text-xs font-semibold text-gray-700">
          {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotMap[theme])} aria-hidden />}
          {addonText}
        </span>
      ) : (
        <span className={cn(addon({ variant, theme, size }))}>{addonText}</span>
      );

    return React.createElement(
      Comp,
      {
        ref: ref as React.Ref<HTMLDivElement>,
        href,
        "data-align": align,
        className: cn(
          group({ variant, theme, size }),
          isInteractive && "hover:opacity-90 cursor-pointer focus-visible:outline-none focus-visible:shadow-ring-brand",
          variant === "modern" && "pl-1 pr-3",
          className
        ),
        ...props,
      },
      align === "leading" ? (
        <>
          {addonNode}
          <span className="inline-flex items-center gap-1.5">
            {children}
            {trailingIcon && (
              <span className="[&_svg]:h-4 [&_svg]:w-4 shrink-0">{trailingIcon}</span>
            )}
          </span>
        </>
      ) : (
        <>
          <span className="inline-flex items-center gap-1.5">
            {children}
            {trailingIcon && (
              <span className="[&_svg]:h-4 [&_svg]:w-4 shrink-0">{trailingIcon}</span>
            )}
          </span>
          {addonNode}
        </>
      )
    );
  }
);
BadgeGroup.displayName = "BadgeGroup";
