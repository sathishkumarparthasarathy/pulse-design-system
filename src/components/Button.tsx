import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loading } from "@/icons";
import { cn } from "@/lib/cn";

/**
 * Untitled UI Button.
 *
 * Hierarchy:
 *   - Primary       — filled brand, white text, the "go" action on a page
 *   - Secondary gray — outlined gray, used for cancel/back
 *   - Secondary color — outlined brand, used for emphasis without committing
 *   - Tertiary gray — ghost gray, low-emphasis
 *   - Tertiary color — ghost brand, low-emphasis but on-brand
 *   - Link gray / Link color — inline text actions
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
        // PRIMARY — Scienaptic navy at rest, orange on hover
        primary: [
          "bg-gray-800 text-white border border-gray-800 shadow-xs",
          "hover:bg-brand-600 hover:border-brand-600",
          "focus:shadow-ring-brand",
          "disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400",
        ].join(" "),

        // PRIMARY GRADIENT — vertical brand-500 → brand-600 · opt-in for hero CTAs
        "primary-gradient": [
          "bg-gradient-to-b from-brand-500 to-brand-600 text-white border border-brand-600 shadow-xs",
          "hover:from-brand-600 hover:to-brand-700 hover:border-brand-700",
          "focus:shadow-ring-brand",
          "disabled:bg-none disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400",
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
