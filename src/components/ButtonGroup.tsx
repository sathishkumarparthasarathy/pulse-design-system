import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Untitled UI ButtonGroup.
 *
 * Joined buttons (segmented control). All segments share the same size.
 * Two modes:
 *   - mode="single"   — one selected at a time (radio-like)
 *   - mode="multiple" — independent toggles
 *
 * Children must be <ButtonGroupItem value="..."> with a stable value prop.
 *
 * Usage:
 *   <ButtonGroup defaultValue="day" mode="single">
 *     <ButtonGroupItem value="day">Day</ButtonGroupItem>
 *     <ButtonGroupItem value="week">Week</ButtonGroupItem>
 *     <ButtonGroupItem value="month">Month</ButtonGroupItem>
 *   </ButtonGroup>
 */

type GroupValue = string | string[];

interface GroupContextValue {
  size: "sm" | "md" | "lg" | "xl" | "2xl";
  value: GroupValue;
  mode: "single" | "multiple";
  onChange: (v: string) => void;
  disabled?: boolean;
}

const GroupContext = React.createContext<GroupContextValue | null>(null);

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  mode?: "single" | "multiple";
  /** Uncontrolled initial value */
  defaultValue?: GroupValue;
  /** Controlled value */
  value?: GroupValue;
  onValueChange?: (value: GroupValue) => void;
  disabled?: boolean;
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      className,
      size = "md",
      mode = "single",
      defaultValue,
      value: controlled,
      onValueChange,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = React.useState<GroupValue>(
      defaultValue ?? (mode === "multiple" ? [] : "")
    );
    const value = controlled ?? internal;

    const onChange = React.useCallback(
      (v: string) => {
        let next: GroupValue;
        if (mode === "multiple") {
          const arr = Array.isArray(value) ? value : [];
          next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
        } else {
          next = v;
        }
        if (controlled === undefined) setInternal(next);
        onValueChange?.(next);
      },
      [mode, value, controlled, onValueChange]
    );

    return (
      <GroupContext.Provider value={{ size, value, mode, onChange, disabled }}>
        <div
          ref={ref}
          role={mode === "single" ? "radiogroup" : "group"}
          className={cn("inline-flex shadow-xs rounded-md isolate", className)}
          {...props}
        >
          {children}
        </div>
      </GroupContext.Provider>
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";

const itemStyles = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "font-semibold whitespace-nowrap",
    "bg-white text-gray-700 border border-gray-300",
    "transition-colors duration-100",
    "hover:bg-gray-50 hover:text-gray-800",
    "focus-visible:z-10 focus-visible:outline-none focus-visible:shadow-ring-gray",
    "disabled:cursor-not-allowed disabled:bg-white disabled:text-gray-400",
    // Joined-edge styling
    "-ml-px first:ml-0",
    "first:rounded-l-md last:rounded-r-md",
    // Selected
    "data-[selected=true]:bg-gray-50 data-[selected=true]:text-gray-800 data-[selected=true]:z-10",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-[18px] text-base",
        xl: "h-12 px-5 text-base",
        "2xl": "h-[60px] px-7 text-lg",
      },
      iconOnly: {
        true: "p-0 aspect-square",
      },
    },
    compoundVariants: [
      { iconOnly: true, size: "sm", className: "w-9" },
      { iconOnly: true, size: "md", className: "w-10" },
      { iconOnly: true, size: "lg", className: "w-11" },
      { iconOnly: true, size: "xl", className: "w-12" },
      { iconOnly: true, size: "2xl", className: "w-[60px]" },
    ],
    defaultVariants: { size: "md" },
  }
);

export interface ButtonGroupItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value">,
    VariantProps<typeof itemStyles> {
  value: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const ButtonGroupItem = React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
  ({ className, value, iconOnly, leadingIcon, trailingIcon, children, disabled, ...props }, ref) => {
    const ctx = React.useContext(GroupContext);
    if (!ctx) {
      throw new Error("<ButtonGroupItem> must be a child of <ButtonGroup>");
    }
    const selected = Array.isArray(ctx.value) ? ctx.value.includes(value) : ctx.value === value;
    const isDisabled = disabled ?? ctx.disabled;
    return (
      <button
        ref={ref}
        type="button"
        role={ctx.mode === "single" ? "radio" : "checkbox"}
        aria-checked={selected}
        data-selected={selected}
        disabled={isDisabled}
        onClick={() => ctx.onChange(value)}
        className={cn(itemStyles({ size: ctx.size, iconOnly }), className)}
        {...props}
      >
        {leadingIcon && <span className="[&_svg]:h-4 [&_svg]:w-4 shrink-0">{leadingIcon}</span>}
        {children}
        {trailingIcon && <span className="[&_svg]:h-4 [&_svg]:w-4 shrink-0">{trailingIcon}</span>}
      </button>
    );
  }
);
ButtonGroupItem.displayName = "ButtonGroupItem";
