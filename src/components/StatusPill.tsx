import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * StatusPill — domain-specific Untitled-UI-style pill for credit / decisioning workflows.
 * Uses `badge-modern` aesthetic: white surface, subtle ring, colored dot.
 */

export type StatusKind = "approved" | "declined" | "review" | "ai" | "neutral";

const map: Record<StatusKind, { label: string; dot: string; text: string }> = {
  approved: { label: "Approved", dot: "bg-success-500", text: "text-success-700" },
  declined: { label: "Declined", dot: "bg-error-500", text: "text-error-700" },
  review:   { label: "Review",   dot: "bg-warning-500", text: "text-warning-700" },
  ai:       { label: "AI Process", dot: "bg-aiProcess-500", text: "text-aiProcess-700" },
  neutral:  { label: "Neutral",  dot: "bg-gray-500", text: "text-gray-700" },
};

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusKind;
  label?: string;
  /** Modern (white surface) is the Untitled UI default. "soft" uses the tinted background. */
  variant?: "modern" | "soft";
  size?: "sm" | "md" | "lg";
}

const sizeCls: Record<string, string> = {
  sm: "h-[22px] px-2 text-xs",
  md: "h-6 px-2.5 text-xs",
  lg: "h-7 px-3 text-sm",
};

const softBg: Record<StatusKind, string> = {
  approved: "bg-success-50 border-success-200",
  declined: "bg-error-50 border-error-200",
  review: "bg-warning-50 border-warning-200",
  ai: "bg-aiProcess-50 border-aiProcess-200",
  neutral: "bg-gray-100 border-gray-200",
};

export const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(
  ({ status, label, variant = "modern", size = "md", className, ...props }, ref) => {
    const cfg = map[status];
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border font-medium",
          sizeCls[size],
          cfg.text,
          variant === "modern" ? "bg-white border-gray-300 shadow-xs" : softBg[status],
          className
        )}
        {...props}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} aria-hidden />
        {label ?? cfg.label}
      </span>
    );
  }
);
StatusPill.displayName = "StatusPill";
