import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * PULSE Tooltip — Radix-backed.
 *
 * Two-tier API:
 *   1. <Tooltip content="Save">…</Tooltip>            — 90% case, one-line usage
 *   2. <TooltipRoot>/<Trigger>/<Content>              — full composition, for edge cases
 *
 * Requires <TooltipProvider> at the app root (once, near the top of the tree).
 */

const tooltipContentVariants = cva(
  [
    "z-50 select-none rounded-md font-medium",
    "shadow-md",
    "max-w-xs",
    "focus-visible:outline-none",
  ].join(" "),
  {
    variants: {
      variant: {
        dark: "bg-gray-900 text-white",
        light: "bg-white text-gray-900 border border-gray-200",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-2.5 py-1.5 text-xs",
        lg: "px-3 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "dark",
      size: "md",
    },
  }
);

export type TooltipVariant = NonNullable<VariantProps<typeof tooltipContentVariants>["variant"]>;
export type TooltipSize = NonNullable<VariantProps<typeof tooltipContentVariants>["size"]>;

/* ─── Low-level composables (mirror Radix API) ─── */

export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

type TooltipContentBaseProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>;

export interface TooltipContentProps
  extends TooltipContentBaseProps,
    VariantProps<typeof tooltipContentVariants> {
  /** Show the little arrow pointer. Default: true. */
  arrow?: boolean;
}

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    { className, variant, size, arrow = true, sideOffset = 8, children, ...props },
    ref
  ) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(tooltipContentVariants({ variant, size }), className)}
        {...props}
      >
        {children}
        {arrow && (
          <TooltipPrimitive.Arrow
            width={11}
            height={5}
            className={variant === "light" ? "fill-white" : "fill-gray-900"}
          />
        )}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
);
TooltipContent.displayName = "TooltipContent";

/* ─── High-level convenience: <Tooltip content="..."> ─── */

export interface TooltipProps
  extends Omit<TooltipContentProps, "content" | "title"> {
  /** The trigger element (typically a Button, Icon, or text). Rendered via asChild. */
  children: React.ReactNode;
  /** Tooltip body — string or ReactNode. If falsy, the trigger renders naked (no tooltip). */
  content?: React.ReactNode;
  /** Radix delay in ms before showing. Default: 200. */
  delayDuration?: number;
  /** Force open (for demos / testing). */
  open?: boolean;
  /** Radix onOpenChange callback. */
  onOpenChange?: (open: boolean) => void;
  /** Disable if you want a wrapper that's a no-op sometimes. */
  disabled?: boolean;
}

export const Tooltip = ({
  children,
  content,
  delayDuration = 200,
  open,
  onOpenChange,
  disabled,
  ...contentProps
}: TooltipProps) => {
  if (!content || disabled) return <>{children}</>;
  return (
    <TooltipRoot delayDuration={delayDuration} open={open} onOpenChange={onOpenChange}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent {...contentProps}>{content}</TooltipContent>
    </TooltipRoot>
  );
};

/* ─── Rich tooltip helper — title + description + optional shortcut ─── */

export interface TooltipRichProps
  extends Omit<TooltipProps, "content" | "size" | "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Small `<kbd>` chips shown at the top-right of the tooltip. Example: shortcut={["⌘", "S"]} */
  shortcut?: React.ReactNode[];
}

export const TooltipRich = ({
  children,
  title,
  description,
  shortcut,
  variant = "dark",
  ...rest
}: TooltipRichProps) => {
  const kbdBase =
    variant === "light"
      ? "bg-gray-100 text-gray-600 border border-gray-200"
      : "bg-gray-800 text-gray-300 border border-gray-700";

  const body = (
    <div className="flex flex-col gap-1 max-w-[240px]">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-semibold leading-tight">{title}</div>
        {shortcut && shortcut.length > 0 && (
          <div className="flex items-center gap-0.5 shrink-0">
            {shortcut.map((k, i) => (
              <kbd
                key={i}
                className={cn(
                  "inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded text-[10px] font-mono font-medium",
                  kbdBase
                )}
              >
                {k}
              </kbd>
            ))}
          </div>
        )}
      </div>
      {description && (
        <div
          className={cn(
            "text-xs leading-relaxed",
            variant === "light" ? "text-gray-600" : "text-gray-300"
          )}
        >
          {description}
        </div>
      )}
    </div>
  );

  return (
    <Tooltip content={body} variant={variant} size="md" {...rest}>
      {children}
    </Tooltip>
  );
};

/* Re-export the arrow so consumers doing full composition can style it themselves. */
export const TooltipArrow = TooltipPrimitive.Arrow;
