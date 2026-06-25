import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { XClose } from "@/icons";
import { cn } from "@/lib/cn";

/**
 * Untitled UI CloseButton.
 *
 * A dedicated icon-only button for closing modals, drawers, toasts, badges, etc.
 * 4 sizes (sm/md/lg/xl) and 2 themes (gray default, brand-on-brand-surfaces).
 *
 * Always renders an X icon; accepts `aria-label` for screen readers.
 */

const styles = cva(
  [
    "inline-flex items-center justify-center shrink-0",
    "rounded-md transition-colors duration-100",
    "focus-visible:outline-none focus-visible:shadow-ring-gray",
    "disabled:cursor-not-allowed disabled:opacity-40",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-8 w-8 [&_svg]:h-4 [&_svg]:w-4",
        md: "h-9 w-9 [&_svg]:h-5 [&_svg]:w-5",
        lg: "h-10 w-10 [&_svg]:h-5 [&_svg]:w-5",
        xl: "h-11 w-11 [&_svg]:h-6 [&_svg]:w-6",
      },
      theme: {
        gray: "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
        brand: "text-brand-700 hover:bg-brand-100 hover:text-brand-800 focus-visible:shadow-ring-brand",
        ghost: "text-gray-500 hover:text-gray-700",
      },
    },
    defaultVariants: { size: "md", theme: "gray" },
  }
);

export interface CloseButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof styles> {
  "aria-label"?: string;
}

export const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ className, size, theme, "aria-label": ariaLabel = "Close", ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      className={cn(styles({ size, theme }), className)}
      {...props}
    >
      <XClose aria-hidden />
    </button>
  )
);
CloseButton.displayName = "CloseButton";
