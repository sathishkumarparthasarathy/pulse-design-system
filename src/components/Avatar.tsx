import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { User } from "@/icons";
import { cn } from "@/lib/cn";

/**
 * Avatar — image / initials / icon fallback, 7 sizes, optional status dot.
 *
 * Fallback waterfall:
 *   1. `src` provided AND loads          → show image
 *   2. image fails OR no `src` BUT `name` → show initials (stable color from name hash)
 *   3. otherwise                          → show generic User icon
 *
 * Usage:
 *   <Avatar src="..." name="Jane Doe" size="md" status="online" />
 *   <Avatar name="Jane Doe" />          // initials → "JD" on a colored bg
 *   <Avatar />                          // anonymous → user icon
 */

/* ─── Initials helpers ─────────────────────────────────────────────── */

const INITIAL_PALETTE = [
  "#6172F3", // indigo
  "#7A5AF8", // purple
  "#EE46BC", // pink
  "#F63D68", // rose
  "#FF7918", // brand orange (we use this sparingly so it doesn't clash)
  "#EAB308", // amber
  "#10B981", // emerald
  "#15B79E", // teal
  "#06AED4", // cyan
  "#2E90FA", // blue
];

function stableColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return INITIAL_PALETTE[h % INITIAL_PALETTE.length]!;
}

function getInitials(name?: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/* ─── Variants ─────────────────────────────────────────────────────── */

const avatarStyles = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-gray-100 text-gray-600 font-semibold select-none",
  {
    variants: {
      size: {
        xs:   "h-6 w-6 text-[10px]",
        sm:   "h-8 w-8 text-xs",
        md:   "h-10 w-10 text-sm",
        lg:   "h-12 w-12 text-base",
        xl:   "h-14 w-14 text-lg",
        "2xl":"h-16 w-16 text-xl",
        "3xl":"h-24 w-24 text-3xl",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-md",
      },
      bordered: {
        true: "ring-2 ring-white",
        false: "",
      },
    },
    defaultVariants: { size: "md", shape: "circle", bordered: false },
  }
);

const statusDotStyles = cva(
  "absolute block rounded-full ring-2 ring-white",
  {
    variants: {
      state: {
        online:  "bg-success-500",
        busy:    "bg-error-500",
        away:    "bg-warning-500",
        offline: "bg-gray-400",
      },
      size: {
        xs:   "h-1.5 w-1.5 right-0 bottom-0",
        sm:   "h-2 w-2 right-0 bottom-0",
        md:   "h-2.5 w-2.5 right-0 bottom-0",
        lg:   "h-3 w-3 right-0 bottom-0",
        xl:   "h-3.5 w-3.5 right-0 bottom-0",
        "2xl":"h-4 w-4 right-0 bottom-0",
        "3xl":"h-5 w-5 right-1 bottom-1",
      },
    },
  }
);

const iconSizeClass: Record<NonNullable<VariantProps<typeof avatarStyles>["size"]>, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-7 w-7",
  "2xl": "h-8 w-8",
  "3xl": "h-12 w-12",
};

/* ─── Avatar ───────────────────────────────────────────────────────── */

export type AvatarSize = NonNullable<VariantProps<typeof avatarStyles>["size"]>;
export type AvatarShape = NonNullable<VariantProps<typeof avatarStyles>["shape"]>;
export type AvatarStatus = NonNullable<VariantProps<typeof statusDotStyles>["state"]>;

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof avatarStyles> {
  src?: string;
  alt?: string;
  /** Person's name — used for initials fallback + aria-label */
  name?: string;
  /** Optional status dot in the bottom-right */
  status?: AvatarStatus;
  /** When true, draws a 2px white ring (use on colored backgrounds / in AvatarGroup) */
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size = "md", shape, bordered, src, alt, name, status, ...props }, ref) => {
    const [imgFailed, setImgFailed] = React.useState(false);
    const showImage = !!src && !imgFailed;
    const initials = !showImage ? getInitials(name) : "";
    const showInitials = !showImage && initials.length > 0;
    const showIcon = !showImage && !showInitials;

    return (
      // OUTER wrapper — positioning context for the status dot.
      // NO overflow:hidden here, so the dot is not clipped.
      <span
        ref={ref}
        role="img"
        aria-label={alt ?? name ?? "User avatar"}
        className={cn("relative inline-flex shrink-0", className)}
        {...props}
      >
        {/* INNER visual — the avatar itself. This is the element with rounded
            shape + overflow:hidden so the image is clipped to the circle. */}
        <span
          className={avatarStyles({ size, shape, bordered })}
          style={
            showInitials
              ? { background: stableColor(name ?? "anon"), color: "#FFFFFF" }
              : undefined
          }
        >
          {showImage && (
            <img
              src={src}
              alt={alt ?? name ?? ""}
              className="h-full w-full object-cover"
              onError={() => setImgFailed(true)}
            />
          )}
          {showInitials && <span aria-hidden>{initials}</span>}
          {showIcon && <User className={cn(iconSizeClass[size!], "text-gray-500")} aria-hidden />}
        </span>
        {/* Status dot — sibling of the visual, NOT a child. Positioned against
            the outer wrapper so it can sit at the edge without being clipped. */}
        {status && (
          <span
            className={statusDotStyles({ state: status, size })}
            aria-label={`Status: ${status}`}
          />
        )}
      </span>
    );
  }
);
Avatar.displayName = "Avatar";

/* ─── AvatarGroup ──────────────────────────────────────────────────── */

const groupOverlapBySize: Record<AvatarSize, string> = {
  xs:   "-ml-1.5",
  sm:   "-ml-2",
  md:   "-ml-2.5",
  lg:   "-ml-3",
  xl:   "-ml-3.5",
  "2xl":"-ml-4",
  "3xl":"-ml-6",
};

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
  /** Max number of avatars to render before the "+N more" pill */
  max?: number;
  /** When > max, a trailing pill with "+N" appears */
  total?: number;
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, size = "md", max = 4, total, children, ...props }, ref) => {
    const childrenArr = React.Children.toArray(children).filter(Boolean);
    const allCount = total ?? childrenArr.length;
    const visibleChildren = childrenArr.slice(0, max);
    const overflow = allCount - visibleChildren.length;

    return (
      <div ref={ref} className={cn("inline-flex items-center", className)} {...props}>
        {visibleChildren.map((child, i) => (
          <span key={i} className={i === 0 ? "" : groupOverlapBySize[size]}>
            {React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement<AvatarProps>, {
                  size,
                  bordered: true,
                })
              : child}
          </span>
        ))}
        {overflow > 0 && (
          <span
            className={cn(
              avatarStyles({ size, shape: "circle", bordered: true }),
              "bg-gray-100 text-gray-700",
              groupOverlapBySize[size]
            )}
            aria-label={`${overflow} more`}
          >
            +{overflow}
          </span>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

/* ─── AvatarProfile (avatar + name + subtitle) ─────────────────────── */

export interface AvatarProfileProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  avatarProps?: AvatarProps;
  /** Bold heading line — the person's name */
  title: React.ReactNode;
  /** Smaller, gray subtitle line — role, email, etc. */
  subtitle?: React.ReactNode;
  /** Optional trailing slot (e.g. menu button, badge) */
  trailing?: React.ReactNode;
  size?: AvatarSize;
}

export const AvatarProfile = React.forwardRef<HTMLDivElement, AvatarProfileProps>(
  ({ className, avatarProps, title, subtitle, trailing, size = "md", ...props }, ref) => {
    const titleSize =
      size === "xs" || size === "sm"
        ? "text-xs"
        : size === "md" || size === "lg"
        ? "text-sm"
        : "text-base";
    const subtitleSize =
      size === "xs" || size === "sm"
        ? "text-[10px]"
        : "text-xs";
    return (
      <div ref={ref} className={cn("inline-flex items-center gap-3", className)} {...props}>
        <Avatar size={size} {...avatarProps} />
        <div className="min-w-0 flex-1">
          <div className={cn(titleSize, "font-semibold text-gray-900 truncate")}>{title}</div>
          {subtitle && (
            <div className={cn(subtitleSize, "text-gray-600 truncate")}>{subtitle}</div>
          )}
        </div>
        {trailing && <div className="shrink-0">{trailing}</div>}
      </div>
    );
  }
);
AvatarProfile.displayName = "AvatarProfile";
