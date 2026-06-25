import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Untitled UI Badge.
 *
 * Two main visual styles:
 *   - "pill-color"   — soft tint, colored text, colored ring (the most-used in Untitled UI)
 *   - "pill-outline" — white surface, colored border
 *   - "badge-color"  — squared with rounded corners (rarer)
 *   - "badge-modern" — white with subtle ring + colored dot (very Untitled UI signature)
 *
 * 7 tones × 3 sizes (sm/md/lg).
 * Optional leading dot or icon.
 */

const badge = cva("inline-flex items-center gap-1 font-medium whitespace-nowrap border", {
  variants: {
    variant: {
      "pill-color": "rounded-full",
      "pill-outline": "rounded-full bg-white",
      "badge-color": "rounded-md",
      "badge-modern": "rounded-full bg-white shadow-xs",
    },
    tone: {
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
    size: {
      sm: "h-[22px] px-2 text-xs",
      md: "h-6 px-2.5 text-xs",
      lg: "h-7 px-3 text-sm",
    },
  },
  compoundVariants: [
    // PILL-COLOR (soft tint) — text-700, bg-50, border-200
    { variant: "pill-color", tone: "gray", className: "bg-gray-100 text-gray-700 border-gray-200" },
    { variant: "pill-color", tone: "brand", className: "bg-brand-50 text-brand-700 border-brand-200" },
    { variant: "pill-color", tone: "error", className: "bg-error-50 text-error-700 border-error-200" },
    { variant: "pill-color", tone: "warning", className: "bg-warning-50 text-warning-700 border-warning-200" },
    { variant: "pill-color", tone: "success", className: "bg-success-50 text-success-700 border-success-200" },
    { variant: "pill-color", tone: "blue", className: "bg-blue-50 text-blue-700 border-blue-200" },
    { variant: "pill-color", tone: "indigo", className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { variant: "pill-color", tone: "purple", className: "bg-purple-50 text-purple-700 border-purple-200" },
    { variant: "pill-color", tone: "pink", className: "bg-pink-50 text-pink-700 border-pink-200" },
    { variant: "pill-color", tone: "ai", className: "bg-aiProcess-50 text-aiProcess-700 border-aiProcess-200" },

    // PILL-OUTLINE — text-700, border-300
    { variant: "pill-outline", tone: "gray", className: "text-gray-700 border-gray-300" },
    { variant: "pill-outline", tone: "brand", className: "text-brand-700 border-brand-300" },
    { variant: "pill-outline", tone: "error", className: "text-error-700 border-error-300" },
    { variant: "pill-outline", tone: "warning", className: "text-warning-700 border-warning-300" },
    { variant: "pill-outline", tone: "success", className: "text-success-700 border-success-300" },
    { variant: "pill-outline", tone: "blue", className: "text-blue-700 border-blue-300" },
    { variant: "pill-outline", tone: "indigo", className: "text-indigo-700 border-indigo-300" },
    { variant: "pill-outline", tone: "purple", className: "text-purple-700 border-purple-300" },
    { variant: "pill-outline", tone: "pink", className: "text-pink-700 border-pink-300" },
    { variant: "pill-outline", tone: "ai", className: "text-aiProcess-700 border-aiProcess-300" },

    // BADGE-COLOR (squared)
    { variant: "badge-color", tone: "gray", className: "bg-gray-100 text-gray-700 border-gray-200" },
    { variant: "badge-color", tone: "brand", className: "bg-brand-50 text-brand-700 border-brand-200" },
    { variant: "badge-color", tone: "error", className: "bg-error-50 text-error-700 border-error-200" },
    { variant: "badge-color", tone: "warning", className: "bg-warning-50 text-warning-700 border-warning-200" },
    { variant: "badge-color", tone: "success", className: "bg-success-50 text-success-700 border-success-200" },
    { variant: "badge-color", tone: "blue", className: "bg-blue-50 text-blue-700 border-blue-200" },
    { variant: "badge-color", tone: "indigo", className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { variant: "badge-color", tone: "purple", className: "bg-purple-50 text-purple-700 border-purple-200" },
    { variant: "badge-color", tone: "pink", className: "bg-pink-50 text-pink-700 border-pink-200" },
    { variant: "badge-color", tone: "ai", className: "bg-aiProcess-50 text-aiProcess-700 border-aiProcess-200" },

    // BADGE-MODERN — white surface, gray border, colored dot
    { variant: "badge-modern", className: "text-gray-700 border-gray-300" },
  ],
  defaultVariants: { variant: "pill-color", tone: "gray", size: "md" },
});

const dotColor: Record<string, string> = {
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

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {
  dot?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, tone, size, dot, leadingIcon, trailingIcon, children, ...props }, ref) => {
    const t = tone ?? "gray";
    return (
      <span ref={ref} className={cn(badge({ variant, tone, size }), className)} {...props}>
        {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotColor[t])} aria-hidden />}
        {leadingIcon && <span className="[&_svg]:h-3 [&_svg]:w-3 shrink-0">{leadingIcon}</span>}
        {children}
        {trailingIcon && <span className="[&_svg]:h-3 [&_svg]:w-3 shrink-0">{trailingIcon}</span>}
      </span>
    );
  }
);
Badge.displayName = "Badge";
