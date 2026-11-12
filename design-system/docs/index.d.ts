/**
 * PULSE Design System — component API.
 *
 * Mirrors the exported surface of `src/components/index.ts` in
 * sathishkumarparthasarathy/pulse-design-system at main@f7f496d.
 * Documentation, not a type-check target.
 */

import * as React from "react";

/* ─── Button ──────────────────────────────────────────────────────── */

export type ButtonHierarchy =
  | "primary"
  | "primary-gradient"
  | "secondary-navy"
  | "secondary-gray"
  | "secondary-color"
  | "tertiary-gray"
  | "tertiary-color"
  | "link-gray"
  | "link-color"
  | "destructive-primary"
  | "destructive-secondary"
  | "destructive-tertiary";

export type ButtonSize = "sm" | "md" | "lg" | "xl" | "2xl";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Commitment level. Default: "primary". */
  hierarchy?: ButtonHierarchy;
  /** Heights 36 / 40 / 44 / 48 / 60px. Default: "md". */
  size?: ButtonSize;
  /** Square button with no label — supply an aria-label. */
  iconOnly?: boolean;
  fullWidth?: boolean;
  /** Render through Radix Slot onto the single child element. */
  asChild?: boolean;
  /** Replaces the leading slot with a spinner and disables the button. */
  loading?: boolean;
  /** Icon element; sized to 20px by the button. */
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}
export declare const Button: React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
>;
/** The raw cva recipe, for composing the same look onto another element. */
export declare const buttonVariants: (opts?: {
  hierarchy?: ButtonHierarchy;
  size?: ButtonSize;
  iconOnly?: boolean;
  fullWidth?: boolean;
  className?: string;
}) => string;

/* ─── ButtonGroup ─────────────────────────────────────────────────── */

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ButtonSize;
  /** "single" behaves as a radiogroup, "multiple" as checkboxes. Default: "single". */
  mode?: "single" | "multiple";
  /** Uncontrolled initial value. An array when mode is "multiple". */
  defaultValue?: string | string[];
  /** Controlled value. */
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  disabled?: boolean;
}
export declare const ButtonGroup: React.ForwardRefExoticComponent<
  ButtonGroupProps & React.RefAttributes<HTMLDivElement>
>;

export interface ButtonGroupItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** Stable identity within the group. Required. */
  value: string;
  iconOnly?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}
/** Throws outside a ButtonGroup — size, mode and selection come from context. */
export declare const ButtonGroupItem: React.ForwardRefExoticComponent<
  ButtonGroupItemProps & React.RefAttributes<HTMLButtonElement>
>;

/* ─── SocialButton ────────────────────────────────────────────────── */

export type SocialProvider =
  | "google" | "apple" | "github" | "x" | "facebook" | "microsoft" | "linkedin";

export interface SocialButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  provider: SocialProvider;
  /** "default" = white surface; "brand" = the provider's own ground. Default: "default". */
  mode?: "default" | "brand";
  size?: "sm" | "md" | "lg" | "xl";
  /** Renders an <a> instead of a <button>, for an OAuth redirect. */
  href?: string;
  /** Overrides the default "Sign in with <Provider>" label. */
  children?: React.ReactNode;
  fullWidth?: boolean;
}
export declare const SocialButton: React.ForwardRefExoticComponent<
  SocialButtonProps & React.RefAttributes<HTMLButtonElement>
>;

/* ─── CloseButton ─────────────────────────────────────────────────── */

export interface CloseButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Heights 32 / 36 / 40 / 44px. Default: "md". */
  size?: "sm" | "md" | "lg" | "xl";
  /** Default: "gray". "brand" for brand-tinted grounds, "ghost" drops the hover fill. */
  theme?: "gray" | "brand" | "ghost";
  /** Default: "Close". */
  "aria-label"?: string;
}
export declare const CloseButton: React.ForwardRefExoticComponent<
  CloseButtonProps & React.RefAttributes<HTMLButtonElement>
>;

/* ─── Badge ───────────────────────────────────────────────────────── */

export type BadgeTone =
  | "gray" | "brand" | "error" | "warning" | "success"
  | "blue" | "indigo" | "purple" | "pink" | "ai";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Default: "pill-color". */
  variant?: "pill-color" | "pill-outline" | "badge-color" | "badge-modern";
  /** Default: "gray". */
  tone?: BadgeTone;
  /** Heights 22 / 24 / 28px. Default: "md". */
  size?: "sm" | "md" | "lg";
  /** Leading dot in the tone's 500 step. */
  dot?: boolean;
  /** Icon element; sized to 12px by the badge. */
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}
export declare const Badge: React.ForwardRefExoticComponent<
  BadgeProps & React.RefAttributes<HTMLSpanElement>
>;

/* ─── BadgeGroup ──────────────────────────────────────────────────── */

export type BadgeGroupTheme = BadgeTone;
export type BadgeGroupSize = "md" | "lg";
export type BadgeGroupVariant = "pill-color" | "pill-outline" | "badge-color" | "modern";

export interface BadgeGroupProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** Default: "pill-color". */
  variant?: BadgeGroupVariant;
  /** Default: "brand". */
  theme?: BadgeGroupTheme;
  /** Heights 28 / 36px. Default: "md". */
  size?: BadgeGroupSize;
  /** Text inside the addon pill. Required. */
  addonText: React.ReactNode;
  /** The message beside the addon. Required. */
  children: React.ReactNode;
  /** Which side the addon sits on. Default: "leading". */
  align?: "leading" | "trailing";
  trailingIcon?: React.ReactNode;
  /** Dot inside the addon — only rendered by the "modern" variant. */
  dot?: boolean;
  /** Renders the whole group as an anchor. */
  href?: string;
  as?: "div" | "a" | "button";
}
export declare const BadgeGroup: React.ForwardRefExoticComponent<
  BadgeGroupProps & React.RefAttributes<HTMLElement>
>;

/* ─── StatusPill ──────────────────────────────────────────────────── */

export type StatusKind = "approved" | "declined" | "review" | "ai" | "neutral";

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusKind;
  /** Overrides the status's own label. Add detail; never rename the state. */
  label?: string;
  /** Default: "modern" (white surface). "soft" uses the tinted ground. */
  variant?: "modern" | "soft";
  /** Default: "md". */
  size?: "sm" | "md" | "lg";
}
export declare const StatusPill: React.ForwardRefExoticComponent<
  StatusPillProps & React.RefAttributes<HTMLSpanElement>
>;

/* ─── Input, Label, HelperText, Field ─────────────────────────────── */

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Heights 36 / 40 / 44px. Default: "md". */
  size?: "sm" | "md" | "lg";
  /** Switches the border and focus ring to the error intent. */
  invalid?: boolean;
  /** Icon element, positioned and sized to 20px. Mutually exclusive with the addons. */
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** Text chip on the left, e.g. "https://" or "$". Takes precedence over the icons. */
  leadingAddon?: React.ReactNode;
  trailingAddon?: React.ReactNode;
}
export declare const Input: React.ForwardRefExoticComponent<
  InputProps & React.RefAttributes<HTMLInputElement>
>;

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Appends a brand-600 asterisk. */
  required?: boolean;
  /** Adds a HelpCircle whose title attribute carries this text. */
  hint?: string;
}
export declare const Label: React.ForwardRefExoticComponent<
  LabelProps & React.RefAttributes<HTMLLabelElement>
>;

export interface HelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Switches to error-600 and prefixes an AlertCircle. */
  invalid?: boolean;
}
export declare const HelperText: React.ForwardRefExoticComponent<
  HelperTextProps & React.RefAttributes<HTMLParagraphElement>
>;

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  hint?: string;
  /** Shown as neutral helper text. */
  helper?: string;
  /** Shown instead of `helper`, as invalid helper text. */
  error?: string;
  htmlFor?: string;
}
export declare const Field: React.ForwardRefExoticComponent<
  FieldProps & React.RefAttributes<HTMLDivElement>
>;

/* ─── Card ────────────────────────────────────────────────────────── */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Default: "xs". */
  elevation?: "flat" | "xs" | "sm" | "md" | "lg";
  /** Default: "xl" (12px). */
  radius?: "md" | "lg" | "xl" | "2xl";
  /** Adds a hover lift and a pointer cursor. */
  interactive?: boolean;
}
export declare const Card: React.ForwardRefExoticComponent<
  CardProps & React.RefAttributes<HTMLDivElement>
>;
/** px-6 py-5, bottom hairline. */
export declare const CardHeader: React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
>;
/** Renders an <h3> at text-lg semibold. */
export declare const CardTitle: React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>
>;
export declare const CardDescription: React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>
>;
/** px-6 py-5. */
export declare const CardContent: React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
>;
/** px-6 py-4, top hairline, gray-50 ground. */
export declare const CardFooter: React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
>;

/* ─── Avatar ──────────────────────────────────────────────────────── */

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type AvatarShape = "circle" | "square";
export type AvatarStatus = "online" | "busy" | "away" | "offline";

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** 24 / 32 / 40 / 48 / 56 / 64 / 96px. Default: "md". */
  size?: AvatarSize;
  /** Default: "circle". */
  shape?: AvatarShape;
  /** Draws a 2px white ring. AvatarGroup sets this on its children. */
  bordered?: boolean;
  src?: string;
  alt?: string;
  /** Drives the initials, the hashed background colour and the aria-label. */
  name?: string;
  /** Status dot at the bottom-right. */
  status?: AvatarStatus;
}
export declare const Avatar: React.ForwardRefExoticComponent<
  AvatarProps & React.RefAttributes<HTMLSpanElement>
>;

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Applied to every child. Default: "md". */
  size?: AvatarSize;
  /** Avatars rendered before the overflow pill. Default: 4. */
  max?: number;
  /** Real total, when it exceeds the children rendered. Drives the "+N" pill. */
  total?: number;
}
export declare const AvatarGroup: React.ForwardRefExoticComponent<
  AvatarGroupProps & React.RefAttributes<HTMLDivElement>
>;

export interface AvatarProfileProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  avatarProps?: AvatarProps;
  /** The name line. Required. */
  title: React.ReactNode;
  /** Role, email or other supporting line. */
  subtitle?: React.ReactNode;
  /** Trailing slot — a menu button, a badge. */
  trailing?: React.ReactNode;
  size?: AvatarSize;
}
export declare const AvatarProfile: React.ForwardRefExoticComponent<
  AvatarProfileProps & React.RefAttributes<HTMLDivElement>
>;

/* ─── Tooltip ─────────────────────────────────────────────────────── */

export type TooltipVariant = "dark" | "light";
export type TooltipSize = "sm" | "md" | "lg";

export interface TooltipContentProps {
  /** Default: "dark". */
  variant?: TooltipVariant;
  /** Default: "md". */
  size?: TooltipSize;
  /** Default: true. */
  arrow?: boolean;
  /** Default: 8. */
  sideOffset?: number;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
  children?: React.ReactNode;
}

export interface TooltipProps extends Omit<TooltipContentProps, "children"> {
  /** The trigger, rendered via Radix asChild — one element that forwards a ref. */
  children: React.ReactNode;
  /** The body. Falsy renders the trigger with no tooltip at all. */
  content?: React.ReactNode;
  /** Default: 200. */
  delayDuration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}
export declare const Tooltip: (props: TooltipProps) => JSX.Element;

export interface TooltipRichProps extends Omit<TooltipProps, "content" | "size"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Keyboard chips at the top right, e.g. ["⌘", "S"]. */
  shortcut?: React.ReactNode[];
}
export declare const TooltipRich: (props: TooltipRichProps) => JSX.Element;

/** Required once near the root of the app. */
export declare const TooltipProvider: React.FC<{
  delayDuration?: number;
  skipDelayDuration?: number;
  children?: React.ReactNode;
}>;
export declare const TooltipRoot: React.FC<any>;
export declare const TooltipTrigger: React.FC<any>;
export declare const TooltipContent: React.ForwardRefExoticComponent<any>;
export declare const TooltipArrow: React.FC<any>;

/* ─── Icons ───────────────────────────────────────────────────────── */

export type IconName = keyof typeof icons;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
}
/** Data-driven icon rendering. Prefer a direct named import for static use. */
export declare const Icon: React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
>;
/** Name-to-component registry of the 54 semantic aliases. */
export declare const icons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>>;

/** Full-colour OAuth marks. Not currentColor — never recoloured. */
export declare const GoogleColor: React.FC<React.SVGProps<SVGSVGElement>>;
export declare const AppleColor: React.FC<React.SVGProps<SVGSVGElement>>;
export declare const GitHubColor: React.FC<React.SVGProps<SVGSVGElement>>;
export declare const XColor: React.FC<React.SVGProps<SVGSVGElement>>;
export declare const FacebookColor: React.FC<React.SVGProps<SVGSVGElement>>;
export declare const MicrosoftColor: React.FC<React.SVGProps<SVGSVGElement>>;
export declare const LinkedInColor: React.FC<React.SVGProps<SVGSVGElement>>;
