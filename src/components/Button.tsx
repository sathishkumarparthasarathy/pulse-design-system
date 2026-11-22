import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loading } from "@/icons";
import { cn } from "@/lib/cn";

/**
 * Untitled UI Button.
 *
 * Hierarchy (12 total):
 *   - Primary          — vertical brand gradient, the default "go" action on every screen
 *   - Primary solid    — flat brand-600, reserved for data-dense contexts (in-row actions)
 *   - Primary hero     — glossy 3-stop gradient + brand shadow + pill radius,
 *                        reserved for marketing hero CTAs only
 *   - Secondary navy   — filled navy, used for alternate actions (Link, Upload)
 *   - Secondary gray   — outlined gray, used for cancel/back
 *   - Secondary color  — soft brand surface, used for emphasis without committing
 *   - Tertiary gray    — ghost gray, low-emphasis
 *   - Tertiary color   — ghost brand, low-emphasis but on-brand
 *   - Link gray / color — inline text actions
 *   - Destructive primary / secondary / tertiary — for delete actions
 *
 * Signatures:
 *   - shadow-xs on every visible-bordered variant (Untitled UI fingerprint)
 *   - 4px focus ring at 24% opacity of intent color
 *   - Inset bottom shadow on filled buttons for tactile depth
 */

const button = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "font-semibold whitespace-nowrap select-none",
    "transition duration-100 ease-out",
    "disabled:cursor-not-allowed disabled:shadow-none",
    "focus-visible:outline-none",
  ].join(" "),
  {
    variants: {
      hierarchy: {
        // PRIMARY — Scienaptic brand gradient (brand-500 → brand-600) · the
        // default "go" action on every screen. Expressive by design: this is
        // an AI-decisioning product, and the orange gradient is Scienaptic's
        // brand signature. Used on Submit, Save, Publish, Continue, Create
        // — anywhere the user is committing to an action.
        primary: [
          "bg-gradient-to-b from-brand-500 to-brand-600 text-white border border-brand-600 shadow-xs",
          "hover:from-brand-600 hover:to-brand-700 hover:border-brand-700",
          "focus:shadow-ring-brand",
          "disabled:bg-none disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400",
        ].join(" "),

        // PRIMARY SOLID — flat brand-600 fill · reserved for data-dense
        // contexts where the gradient reads as visual noise: in-table row
        // actions, dense list rows, inline cell CTAs. The visual is calmer
        // but the hierarchy is identical to `primary`.
        "primary-solid": [
          "bg-brand-600 text-white border border-brand-600 shadow-xs",
          "hover:bg-brand-700 hover:border-brand-700",
          "focus:shadow-ring-brand",
          "disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400",
        ].join(" "),

        // PRIMARY HERO — Scienaptic's reserved marketing-hero CTA · glossy
        // 3-stop brand gradient (brand-300 → brand-500 → brand-700), top
        // highlight + bottom depth, brand-tinted drop shadow, 26px pill
        // radius. Rules of engagement:
        //   • Marketing / landing / pricing / signup entry points ONLY
        //   • One per screen, max
        //   • Never inside the product UI (Iris forms, modals, tables)
        //   • Prefer size="xl" or "2xl" — the look needs real estate
        // When in doubt, use `primary` (the gradient) instead.
        "primary-hero": [
          "bg-gradient-to-b from-brand-300 via-brand-500 to-brand-700",
          "text-white border-[1.5px] border-brand-700",
          "shadow-hero-brand !rounded-[26px]",
          "transition-all duration-150",
          "hover:from-brand-500 hover:via-brand-600 hover:to-brand-900",
          "hover:shadow-hero-brand-hover hover:-translate-y-0.5",
          "active:translate-y-0 active:shadow-xs",
          "focus:shadow-ring-brand",
          "disabled:bg-none disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:translate-y-0",
        ].join(" "),

        // SECONDARY NAVY — filled navy, alternate commit action (Link, Upload)
        "secondary-navy": [
          "bg-gray-800 text-white border border-gray-800 shadow-xs",
          "hover:bg-gray-900 hover:border-gray-900",
          "focus:shadow-ring-gray",
          "disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400",
        ].join(" "),

        // SECONDARY GRAY — white surface, gray border
        "secondary-gray": [
          "bg-white text-gray-700 border border-gray-300 shadow-xs",
          "hover:bg-gray-50 hover:text-gray-800",
          "focus:shadow-ring-gray",
          "disabled:bg-white disabled:text-gray-400 disabled:border-gray-200",
        ].join(" "),

        // SECONDARY COLOR — soft brand surface, brand border
        "secondary-color": [
          "bg-brand-50 text-brand-700 border border-brand-50 shadow-xs",
          "hover:bg-brand-100 hover:text-brand-800",
          "focus:shadow-ring-brand",
          "disabled:bg-white disabled:text-gray-400 disabled:border-gray-200",
        ].join(" "),

        // TERTIARY GRAY — ghost
        "tertiary-gray": [
          "bg-transparent text-gray-600 border border-transparent",
          "hover:bg-gray-50 hover:text-gray-700",
          "disabled:bg-transparent disabled:text-gray-400",
        ].join(" "),

        // TERTIARY COLOR — ghost brand
        "tertiary-color": [
          "bg-transparent text-brand-700 border border-transparent",
          "hover:bg-brand-50",
          "disabled:bg-transparent disabled:text-gray-400",
        ].join(" "),

        // LINK GRAY
        "link-gray": [
          "bg-transparent text-gray-600 border-0 shadow-none p-0 h-auto",
          "hover:text-gray-700 underline-offset-2 hover:underline",
          "disabled:text-gray-400",
        ].join(" "),

        // LINK COLOR
        "link-color": [
          "bg-transparent text-brand-700 border-0 shadow-none p-0 h-auto",
          "hover:text-brand-800 underline-offset-2 hover:underline",
          "disabled:text-gray-400",
        ].join(" "),

        // DESTRUCTIVE PRIMARY
        "destructive-primary": [
          "bg-error-600 text-white border border-error-600 shadow-xs",
          "hover:bg-error-700 hover:border-error-700",
          "focus:shadow-ring-error",
          "disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400",
        ].join(" "),

        // DESTRUCTIVE SECONDARY
        "destructive-secondary": [
          "bg-white text-error-700 border border-error-300 shadow-xs",
          "hover:bg-error-50",
          "focus:shadow-ring-error",
          "disabled:bg-white disabled:text-gray-400 disabled:border-gray-200",
        ].join(" "),

        // DESTRUCTIVE TERTIARY
        "destructive-tertiary": [
          "bg-transparent text-error-700 border border-transparent",
          "hover:bg-error-50",
          "disabled:bg-transparent disabled:text-gray-400",
        ].join(" "),
      },

      size: {
        // Untitled UI sizes: sm (36), md (40), lg (44), xl (48), 2xl (60)
        sm: "h-9 px-3.5 text-sm rounded-md",
        md: "h-10 px-4 text-sm rounded-md",
        lg: "h-11 px-[18px] text-base rounded-md",
        xl: "h-12 px-5 text-base rounded-md",
        "2xl": "h-[60px] px-7 text-lg rounded-md",
      },

      iconOnly: {
        true: "p-0 aspect-square",
      },

      fullWidth: {
        true: "w-full",
      },
    },

    compoundVariants: [
      { iconOnly: true, size: "sm", className: "w-9" },
      { iconOnly: true, size: "md", className: "w-10" },
      { iconOnly: true, size: "lg", className: "w-11" },
      { iconOnly: true, size: "xl", className: "w-12" },
      { iconOnly: true, size: "2xl", className: "w-[60px]" },
    ],

    defaultVariants: {
      hierarchy: "primary",
      size: "md",
    },
  }
);

export type ButtonHierarchy = NonNullable<VariantProps<typeof button>["hierarchy"]>;
export type ButtonSize = NonNullable<VariantProps<typeof button>["size"]>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  asChild?: boolean;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      hierarchy,
      size,
      iconOnly,
      fullWidth,
      asChild = false,
      loading = false,
      disabled,
      leadingIcon,
      trailingIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(button({ hierarchy, size, iconOnly, fullWidth }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loading className="h-4 w-4" aria-hidden />
        ) : (
          leadingIcon && (
            <span className="[&_svg]:h-5 [&_svg]:w-5 shrink-0">{leadingIcon}</span>
          )
        )}
        {children}
        {!loading && trailingIcon && (
          <span className="[&_svg]:h-5 [&_svg]:w-5 shrink-0">{trailingIcon}</span>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { button as buttonVariants };
