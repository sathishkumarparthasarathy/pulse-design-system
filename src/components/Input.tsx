import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, HelpCircle } from "@/icons";
import { cn } from "@/lib/cn";

/**
 * Untitled UI Input.
 *
 * Signatures:
 *   - shadow-xs ring on every input
 *   - 4px focus ring at 24% opacity (brand or error)
 *   - 16px placeholder, 16px text (md), text-gray-900 on type
 *   - Optional leading/trailing icon, optional addon (e.g. "https://")
 *   - Optional hint icon trailing (info or alert on error)
 */

const inputStyles = cva(
  [
    "block w-full bg-white shadow-xs border",
    "text-gray-900 placeholder:text-gray-500",
    "transition duration-100",
    "focus:outline-none focus:shadow-ring-brand focus:border-brand-300",
    "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-9 px-3 text-sm rounded-md",
        md: "h-10 px-3.5 text-md rounded-md",
        lg: "h-11 px-3.5 text-md rounded-md",
      },
      invalid: {
        true: "border-error-300 focus:shadow-ring-error focus:border-error-300",
        false: "border-gray-300",
      },
    },
    defaultVariants: { size: "md", invalid: false },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputStyles> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** Left-side text addon, e.g. "https://" or "$" */
  leadingAddon?: React.ReactNode;
  /** Right-side text addon, e.g. ".com" */
  trailingAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, size, invalid, leadingIcon, trailingIcon, leadingAddon, trailingAddon, ...props },
    ref
  ) => {
    if (leadingAddon || trailingAddon) {
      // Group with text addons
      return (
        <div
          className={cn(
            "flex w-full rounded-md shadow-xs border bg-white",
            invalid ? "border-error-300 focus-within:shadow-ring-error" : "border-gray-300 focus-within:shadow-ring-brand focus-within:border-brand-300",
            "transition duration-100"
          )}
        >
          {leadingAddon && (
            <span className="inline-flex items-center px-3.5 text-md text-gray-600 bg-white border-r border-gray-300 rounded-l-md">
              {leadingAddon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              "flex-1 bg-transparent border-0 outline-none text-md text-gray-900 placeholder:text-gray-500",
              size === "sm" && "h-9 px-3 text-sm",
              size === "md" && "h-10 px-3.5",
              size === "lg" && "h-11 px-3.5",
              !size && "h-10 px-3.5",
              "disabled:cursor-not-allowed disabled:text-gray-500",
              className
            )}
            {...props}
          />
          {trailingAddon && (
            <span className="inline-flex items-center px-3.5 text-md text-gray-600 bg-white border-l border-gray-300 rounded-r-md">
              {trailingAddon}
            </span>
          )}
        </div>
      );
    }

    if (leadingIcon || trailingIcon) {
      return (
        <div className="relative w-full">
          {leadingIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 [&_svg]:h-5 [&_svg]:w-5 pointer-events-none">
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              inputStyles({ size, invalid }),
              leadingIcon && "pl-[42px]",
              trailingIcon && "pr-[42px]",
              className
            )}
            {...props}
          />
          {trailingIcon && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 [&_svg]:h-5 [&_svg]:w-5">
              {trailingIcon}
            </span>
          )}
        </div>
      );
    }

    return <input ref={ref} className={cn(inputStyles({ size, invalid }), className)} {...props} />;
  }
);
Input.displayName = "Input";

// Label — Untitled UI uses text-sm semibold gray-700
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  hint?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, hint, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-sm font-medium text-gray-700 inline-flex items-center gap-1 mb-1.5", className)}
      {...props}
    >
      {children}
      {required && <span className="text-brand-600">*</span>}
      {hint && (
        <span className="ml-1 text-gray-500 inline-flex items-center" title={hint}>
          <HelpCircle className="h-4 w-4" aria-hidden />
        </span>
      )}
    </label>
  )
);
Label.displayName = "Label";

export interface HelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  invalid?: boolean;
}

export const HelperText = React.forwardRef<HTMLParagraphElement, HelperTextProps>(
  ({ className, invalid, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "text-sm mt-1.5 flex items-start gap-1.5",
        invalid ? "text-error-600" : "text-gray-600",
        className
      )}
      {...props}
    >
      {invalid && <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />}
      <span>{children}</span>
    </p>
  )
);
HelperText.displayName = "HelperText";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  hint?: string;
  helper?: string;
  error?: string;
  htmlFor?: string;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ label, required, hint, helper, error, htmlFor, className, children, ...props }, ref) => (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {label && (
        <Label htmlFor={htmlFor} required={required} hint={hint}>
          {label}
        </Label>
      )}
      {children}
      {(error || helper) && <HelperText invalid={!!error}>{error ?? helper}</HelperText>}
    </div>
  )
);
Field.displayName = "Field";
