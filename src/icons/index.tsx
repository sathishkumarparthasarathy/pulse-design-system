/**
 * Icon library — backed by `lucide-react` (MIT-licensed).
 *
 * We re-export the icons with the names our existing components use, so
 * upgrading the icon set doesn't break consumers. A few of our names differ
 * from Lucide's (e.g. `XClose` → `X`, `Stars01` → `Sparkles`) — those are
 * mapped explicitly below.
 *
 * Brand / OAuth marks (Google, Apple, GitHub, etc.) stay in `./brand` since
 * Lucide is stroke-only and doesn't ship color brand marks.
 */

import * as React from "react";

/* ─── Direct re-exports (name unchanged) ─────────────────────────── */

export {
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ArrowUpRight, ArrowDownRight,
  ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Plus, Minus, Check, Search, Download, Upload, Copy, ExternalLink,
  Clock, Calendar, Mail, Phone, Bell,
  User, Users, Eye, EyeOff,
  Home, Settings, Menu, File, Folder, Brain,
} from "lucide-react";

/* ─── Renamed re-exports (keep our semantic names) ───────────────── */

export {
  X as XClose,
  ListFilter as FilterLines,
  Trash2 as Trash,
  Pencil as Edit,
  RefreshCw as Refresh,
  CircleAlert as AlertCircle,
  TriangleAlert as AlertTriangle,
  CircleCheck as CheckCircle,
  CircleX as XCircle,
  Info as InfoCircle,
  CircleHelp as HelpCircle,
  Loader2 as Loading,
  ChevronsUpDown as ChevronSelector,
  Grid3x3 as Grid,
  Sparkles as Stars01,
  Wand2 as MagicWand,
  Zap as Lightning,
  BarChart3 as BarChart,
  TrendingUp as TrendUp,
  TrendingDown as TrendDown,
  MoreHorizontal as DotsHorizontal,
  MoreVertical as DotsVertical,
} from "lucide-react";

/* ─── Icon registry — string → component lookup ──────────────────── */
/* Useful when the icon to render is data-driven (CMS, config, etc.).  */

import {
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ArrowUpRight, ArrowDownRight,
  ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Plus, Minus, Check, Search, Download, Upload, Copy, ExternalLink,
  Clock, Calendar, Mail, Phone, Bell,
  User, Users, Eye, EyeOff,
  Home, Settings, Menu, File, Folder, Brain,
  X, ListFilter, Trash2, Pencil, RefreshCw,
  CircleAlert, TriangleAlert, CircleCheck, CircleX, Info, CircleHelp,
  Loader2, ChevronsUpDown, Grid3x3, Sparkles, Wand2, Zap,
  BarChart3, TrendingUp, TrendingDown, MoreHorizontal, MoreVertical,
} from "lucide-react";

export const icons = {
  // Arrows
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ArrowUpRight, ArrowDownRight,
  // Chevrons
  ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  ChevronSelector: ChevronsUpDown,
  // Actions
  Plus, Minus, Check, Search, Download, Upload, Copy, ExternalLink,
  XClose: X,
  FilterLines: ListFilter,
  Trash: Trash2,
  Edit: Pencil,
  Refresh: RefreshCw,
  // Feedback
  AlertCircle: CircleAlert,
  AlertTriangle: TriangleAlert,
  CheckCircle: CircleCheck,
  XCircle: CircleX,
  InfoCircle: Info,
  HelpCircle: CircleHelp,
  Loading: Loader2,
  // Time
  Clock, Calendar,
  // Communication
  Mail, Phone, Bell,
  // Users
  User, Users, Eye, EyeOff,
  // Layout
  Home, Settings, Menu,
  Grid: Grid3x3,
  // Files
  File, Folder,
  // AI / Decisioning
  Stars01: Sparkles,
  MagicWand: Wand2,
  Brain,
  Lightning: Zap,
  // Data
  BarChart: BarChart3,
  TrendUp: TrendingUp,
  TrendDown: TrendingDown,
  // Misc
  DotsHorizontal: MoreHorizontal,
  DotsVertical: MoreVertical,
} as const;

export type IconName = keyof typeof icons;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
}

/**
 * Generic <Icon name="ArrowRight" /> for data-driven rendering.
 * Prefer the direct named import for static usage (tree-shakeable).
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(({ name, ...props }, ref) => {
  const Cmp = icons[name];
  return <Cmp ref={ref} {...props} />;
});
Icon.displayName = "Icon";

/* ─── Full Lucide library ─────────────────────────────────────────
   Re-export EVERYTHING else from lucide-react so any of the 1,500+
   icons is available via `@/icons` without a second import path.

   Our explicit named exports above take priority — e.g. importing
   `AlertCircle` from `@/icons` gives you our alias (which maps to
   Lucide's `CircleAlert`), NOT Lucide's deprecated `AlertCircle`.

   Tree-shaking ensures only the icons you actually use ship in the
   final bundle. Importing `@/icons` itself costs ~0 bytes.
   --------------------------------------------------------------- */

export * from "lucide-react";

/* ─── Brand / OAuth color marks (stay inline) ────────────────────── */
export * from "./brand";
