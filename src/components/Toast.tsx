import * as React from "react";
import * as RadixToast from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import {
  InfoCircle,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loading,
} from "@/icons";
import { CloseButton } from "./CloseButton";
import { Button } from "./Button";
import { cn } from "@/lib/cn";

/**
 * PULSE Toast — Radix-backed.
 *
 * Anatomy (left → right):
 *   icon 20px → message column (subject + rest) → optional count ×N
 *               → action (divider-separated text button) and/or close
 *
 * Two layouts:
 *   - compact : self-sizing, max-w 560, min-w 240 — the default
 *   - full    : full-width within its container (banner-style)
 *
 * Intent drives the leading icon + its color:
 *   info · success · warning · error · neutral (no icon)
 *
 * State:
 *   - default : normal, auto-dismisses unless persistent
 *   - loading : spinner replaces icon, no timer, no close
 *   - busy    : action button shows spinner + is disabled (set while a
 *               Promise returned by onAction is in-flight)
 *
 * Exports both:
 *   - Primitives (ToastRoot/Title/Description/Action/Close) — thin wrappers
 *     on Radix for consumers who want full composition.
 *   - <Toast> convenience component — consumed by <Toaster />.
 */

/* ─── Primitives (thin Radix wrappers) ─── */

export const ToastProvider = RadixToast.Provider;
export const ToastRoot = RadixToast.Root;
export const ToastTitle = RadixToast.Title;
export const ToastDescription = RadixToast.Description;
export const ToastAction = RadixToast.Action;
export const ToastClose = RadixToast.Close;
export const ToastViewport = RadixToast.Viewport;

/* ─── Intent config — icon + color ─── */

export type ToastIntent = "info" | "success" | "warning" | "error" | "neutral";

type IntentCfg = {
  // ElementType is lenient enough to accept Lucide's ForwardRef components
  Icon: React.ElementType | null;
  iconColor: string;
};

const INTENT: Record<ToastIntent, IntentCfg> = {
  info:     { Icon: InfoCircle,     iconColor: "text-info-600" },
  success:  { Icon: CheckCircle,    iconColor: "text-success-600" },
  // warning-600 fails WCAG 3:1 against white — bump to 700 for the icon stroke
  warning:  { Icon: AlertTriangle,  iconColor: "text-warning-700" },
  error:    { Icon: XCircle,        iconColor: "text-error-600" },
  neutral:  { Icon: null,           iconColor: "" },
};

/* ─── Container variants ─── */

const toastContainer = cva(
  [
    "relative flex items-stretch",
    "bg-white border border-gray-200 rounded-xl",
    "shadow-lg",
    "transition-opacity duration-150",
    "data-[state=closed]:opacity-0",
    "data-[swipe=move]:transition-none",
    "data-[swipe=end]:opacity-0",
    "data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:duration-200",
    "focus-visible:outline-none focus-visible:shadow-ring-brand",
  ].join(" "),
  {
    variants: {
      layout: {
        // Compact: self-sizes; the minimum guarantees the anatomy doesn't
        // squish, the max keeps long messages readable.
        compact: "min-w-[240px] max-w-[560px] w-max",
        // Full: fills the container width (viewport decides the cap).
        full:    "w-full",
      },
      // When elevated (live, newest), bump the shadow one step
      live: {
        true:  "shadow-xl",
        false: "",
      },
    },
    defaultVariants: {
      layout: "compact",
      live: false,
    },
  }
);

export type ToastLayout = NonNullable<VariantProps<typeof toastContainer>["layout"]>;

/* ─── Toast — the convenience component used by Toaster ─── */

export interface ToastProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ToastRoot>, "title" | "children" | "onPause" | "onResume"> {
  /** Visual intent — drives the leading icon + its color. `neutral` hides the icon. */
  intent?: ToastIntent;
  /** Bold leading phrase — e.g. "Saved." */
  subject?: React.ReactNode;
  /** Rest of the message — rendered in gray-600. */
  message?: React.ReactNode;
  /** Compact (default) hugs content; `full` expands to container width. */
  layout?: ToastLayout;
  /** Visual state — `loading` shows a spinner instead of the icon and hides the close. */
  state?: "default" | "loading" | "busy";
  /** Allow 2 lines of message; also forces icon to top-align. */
  wrap?: boolean;
  /** Small `×N` pill after the message (for deduped toasts). */
  count?: number;
  /** Elevate the shadow — the viewport sets this on the newest live toast. */
  live?: boolean;
  /** Divider-separated text button on the right. */
  action?: React.ReactNode;
  /** Variant of the action — `text` (default) or `primary` (filled gradient CTA). */
  actionVariant?: "text" | "primary";
  /** Fired when the user clicks the action. */
  onAction?: () => void | Promise<void>;
  /** Hide the close button — used by loading toasts. */
  hideClose?: boolean;
}

export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastRoot>,
  ToastProps
>(
  (
    {
      intent = "info",
      subject,
      message,
      layout = "compact",
      state = "default",
      wrap = false,
      count,
      live = false,
      action,
      actionVariant = "text",
      onAction,
      hideClose = false,
      className,
      ...props
    },
    ref
  ) => {
    const cfg = INTENT[intent];
    const IntentIcon = cfg.Icon;
    const isLoading = state === "loading";
    const isBusy = state === "busy";
    const showClose = !isLoading && !hideClose;
    // Padding: content rail is px-4 compact / px-5 full.
    const contentPadding = layout === "full" ? "px-5 py-3" : "px-4 py-3";
    // Icon color override for loading state (gray spinner regardless of intent).
    const iconColor = isLoading ? "text-gray-500" : cfg.iconColor;
    // Subject max width keeps long nouns from bulldozing the row.
    const subjectMaxW = layout === "full" ? "max-w-[280px]" : "max-w-[200px]";

    return (
      <ToastRoot
        ref={ref}
        className={cn(toastContainer({ layout, live }), className)}
        {...props}
      >
        {/* Content rail — icon + text + optional count pill */}
        <div className={cn("flex items-center gap-2.5 flex-1 min-w-0", contentPadding, wrap && "items-start")}>
          {/* Leading icon — hidden on `neutral`; spinner swap on `loading` */}
          {(isLoading || IntentIcon) && (
            <span
              className={cn(
                "shrink-0 inline-flex items-center justify-center",
                "[&_svg]:h-5 [&_svg]:w-5",
                iconColor,
                wrap && "mt-0.5",
                isLoading && "animate-spin"
              )}
              aria-hidden
            >
              {isLoading ? <Loading /> : IntentIcon ? <IntentIcon /> : null}
            </span>
          )}

          {/* Message column */}
          <div
            className={cn(
              "min-w-0 flex-1",
              "text-sm leading-5 text-gray-600",
              // Single-line truncation unless wrap is true
              wrap ? "line-clamp-2" : "truncate"
            )}
            // Title attribute — when truncated, the browser shows full text on hover
            title={typeof subject === "string" || typeof message === "string"
              ? [typeof subject === "string" ? subject : "", typeof message === "string" ? message : ""]
                  .filter(Boolean)
                  .join(" ")
              : undefined}
          >
            {subject && (
              <>
                <ToastTitle asChild>
                  <strong className={cn("font-semibold text-gray-900 inline-block truncate align-bottom", subjectMaxW)}>
                    {subject}
                  </strong>
                </ToastTitle>
                {message && " "}
              </>
            )}
            {message && (
              <ToastDescription asChild>
                <span>{message}</span>
              </ToastDescription>
            )}
          </div>

          {/* Count pill */}
          {typeof count === "number" && count > 1 && (
            <span
              className={cn(
                "shrink-0 inline-flex items-center justify-center",
                "rounded-full bg-gray-100 text-gray-700",
                "text-xs font-semibold px-2 h-5"
              )}
              aria-label={`${count} occurrences`}
            >
              ×{count}
            </span>
          )}
        </div>

        {/* Action — divider-separated text button, or inset primary CTA */}
        {action && (actionVariant === "primary" ? (
          <div className="shrink-0 flex items-center pr-1.5 py-1.5">
            <Button
              hierarchy="primary-gradient"
              size="sm"
              onClick={() => { void onAction?.(); }}
              loading={isBusy}
              disabled={isBusy}
            >
              {action}
            </Button>
          </div>
        ) : (
          <ToastAction
            altText={typeof action === "string" ? action : "Action"}
            onClick={(e) => {
              // Radix auto-closes on Action by default; stop that so the
              // parent can decide (dedupe/busy/etc.).
              e.preventDefault();
              void onAction?.();
            }}
            disabled={isBusy}
            className={cn(
              "shrink-0 inline-flex items-center justify-center",
              "border-l border-gray-200",
              "text-sm font-semibold text-gray-900 whitespace-nowrap",
              "hover:bg-gray-50 transition-colors",
              "focus-visible:outline-none focus-visible:bg-gray-50",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              layout === "full" ? "px-5" : "px-[18px]",
              // Last-item rounding — rounds the right edge to match the container
              !showClose && "rounded-r-xl"
            )}
          >
            {isBusy ? (
              <Loading className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              action
            )}
          </ToastAction>
        ))}

        {/* Close */}
        {showClose && (
          <div className="shrink-0 flex items-center pr-2 pl-1 border-l border-gray-200">
            <ToastClose asChild>
              <CloseButton size="sm" theme="ghost" aria-label="Dismiss" />
            </ToastClose>
          </div>
        )}
      </ToastRoot>
    );
  }
);
Toast.displayName = "Toast";
