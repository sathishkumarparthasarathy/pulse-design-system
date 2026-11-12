import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  InfoCircle,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loading,
  XClose,
} from "@/icons";
import { Button } from "./Button";
import { cn } from "@/lib/cn";

/**
 * PULSE Toast — visual-only component.
 *
 * Renders the toast surface (icon · subject · message · optional count ·
 * optional action · optional close). Dismiss/timer/stacking live at the
 * app layer — pass `onClose` and `onAction` handlers from your own
 * notification manager.
 *
 * Intents: info · success · warning · error · neutral (no icon)
 * Layouts: compact (hugs content, max-w 560) · full (stretches)
 * States:  default · loading (spinner swap, close hidden) · busy
 *          (action shows spinner + disabled)
 */

const toastSurface = cva(
  [
    "relative flex items-stretch",
    "bg-white border border-gray-200 rounded-xl shadow-lg",
  ].join(" "),
  {
    variants: {
      layout: {
        compact: "min-w-[240px] max-w-[560px] w-max",
        full:    "w-full",
      },
    },
    defaultVariants: { layout: "compact" },
  }
);

export type ToastIntent = "info" | "success" | "warning" | "error" | "neutral";
export type ToastLayout = NonNullable<VariantProps<typeof toastSurface>["layout"]>;

type IntentCfg = {
  Icon: React.ElementType | null;
  iconColor: string;
};

const INTENT: Record<ToastIntent, IntentCfg> = {
  info:    { Icon: InfoCircle,    iconColor: "text-info-600" },
  success: { Icon: CheckCircle,   iconColor: "text-success-600" },
  // warning-600 fails WCAG 3:1 against white — 700 clears the bar
  warning: { Icon: AlertTriangle, iconColor: "text-warning-700" },
  error:   { Icon: XCircle,       iconColor: "text-error-600" },
  neutral: { Icon: null,          iconColor: "" },
};

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual intent — drives the leading icon + its color. `neutral` hides the icon. */
  intent?: ToastIntent;
  /** Bold leading phrase — e.g. "Saved." */
  subject?: React.ReactNode;
  /** Rest of the message — rendered in gray-600. */
  message?: React.ReactNode;
  /** Compact (default) hugs content; `full` expands to container width. */
  layout?: ToastLayout;
  /** Visual state — `loading` shows a spinner + hides close, `busy` disables the action. */
  state?: "default" | "loading" | "busy";
  /** Allow 2 lines of message; also forces icon to top-align. */
  wrap?: boolean;
  /** Small `×N` pill after the message (for deduped toasts). */
  count?: number;
  /** Divider-separated text button on the right. */
  action?: React.ReactNode;
  /** Shape of the action — `text` (default) is a divider-separated button;
   *  `primary` inlines the brand-gradient Button for time-sensitive CTAs. */
  actionVariant?: "text" | "primary";
  /** Fired when the user clicks the action. */
  onAction?: () => void;
  /** Fired when the user clicks the close button. Passing this makes the close button appear. */
  onClose?: () => void;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      intent = "info",
      subject,
      message,
      layout = "compact",
      state = "default",
      wrap = false,
      count,
      action,
      actionVariant = "text",
      onAction,
      onClose,
      className,
      ...rest
    },
    ref
  ) => {
    const cfg = INTENT[intent];
    const IntentIcon = cfg.Icon;
    const isLoading = state === "loading";
    const isBusy = state === "busy";
    const showClose = !isLoading && Boolean(onClose);
    const contentPad = layout === "full" ? "px-5 py-3" : "px-4 py-3";
    const iconColor = isLoading ? "text-gray-500" : cfg.iconColor;
    const subjectMaxW = layout === "full" ? "max-w-[280px]" : "max-w-[200px]";

    return (
      <div
        ref={ref}
        role="status"
        aria-live={intent === "error" ? "assertive" : "polite"}
        className={cn(toastSurface({ layout }), className)}
        {...rest}
      >
        {/* Content rail — icon + text + optional count pill */}
        <div className={cn("flex items-center gap-2.5 flex-1 min-w-0", contentPad, wrap && "items-start")}>
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

          <div
            className={cn(
              "min-w-0 flex-1 text-sm leading-5 text-gray-600",
              wrap ? "line-clamp-2" : "truncate"
            )}
          >
            {subject && (
              <>
                <strong className={cn("font-semibold text-gray-900 inline-block align-bottom truncate", subjectMaxW)}>
                  {subject}
                </strong>
                {message && " "}
              </>
            )}
            {message}
          </div>

          {typeof count === "number" && count > 1 && (
            <span
              className="shrink-0 inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-700 text-xs font-semibold px-2 h-5"
              aria-label={`${count} occurrences`}
            >
              ×{count}
            </span>
          )}
        </div>

        {action && actionVariant === "primary" ? (
          // Primary CTA — inset brand-gradient Button. 6px padding on three
          // sides, 8px between content and button (matches design spec).
          <div className="shrink-0 flex items-center pr-1.5 pl-2 py-1.5">
            <Button
              hierarchy="primary-gradient"
              size="sm"
              onClick={onAction}
              loading={isBusy}
              disabled={isBusy}
            >
              {action}
            </Button>
          </div>
        ) : action ? (
          <button
            type="button"
            onClick={onAction}
            disabled={isBusy}
            className={cn(
              "shrink-0 inline-flex items-center justify-center gap-2",
              "border-l border-gray-200",
              "text-sm font-semibold text-gray-900 whitespace-nowrap",
              "hover:bg-gray-50 transition-colors",
              "focus-visible:outline-none focus-visible:bg-gray-50",
              "disabled:text-gray-500 disabled:cursor-not-allowed",
              layout === "full" ? "px-5" : "px-[18px]",
              // Round the right edge when there's no close button after this
              !showClose && "rounded-r-xl"
            )}
          >
            {isBusy && <Loading className="h-4 w-4 animate-spin" aria-hidden />}
            {action}
          </button>
        ) : null}

        {showClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss"
            className={cn(
              "shrink-0 inline-flex items-center justify-center",
              "border-l border-gray-200 px-3",
              "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
              "focus-visible:outline-none focus-visible:bg-gray-50",
              "rounded-r-xl",
              "[&_svg]:h-4 [&_svg]:w-4"
            )}
          >
            <XClose aria-hidden />
          </button>
        )}
      </div>
    );
  }
);
Toast.displayName = "Toast";
