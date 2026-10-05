import * as React from "react";
import {
  Button,
  ButtonGroup,
  ButtonGroupItem,
  SocialButton,
  CloseButton,
  Badge,
  BadgeGroup,
  StatusPill,
  Input,
  Field,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Avatar,
  AvatarGroup,
  AvatarProfile,
  Tooltip,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipRich,
  ArrowRight,
  Search,
  Mail,
  Download,
  Upload,
  Plus,
  Trash,
  ChevronDown,
  ChevronUp,
  Grid,
  Menu,
  BarChart,
  Stars01,
  ExternalLink,
  // Nav icons
  Home,
  MagicWand,
  Eye,
  File,
  HelpCircle,
  Users,
  XClose,
  User,
  CheckCircle,
  InfoCircle,
  Edit,
  Folder,
  icons as iconRegistry,
  type IconName,
} from "@/components";
import { colors } from "@/tokens";

/* =========================================================================
   Sidebar layout
   ========================================================================= */

type PageId =
  | "overview"
  | "colors" | "shadows-blurs" | "spacing-grids" | "typography" | "icons"
  | "buttons" | "button-group" | "social-buttons" | "close-button"
  | "badges" | "badge-groups" | "status-pills" | "forms" | "cards"
  | "avatars" | "tooltips";

type IconCmp = React.ComponentType<React.SVGProps<SVGSVGElement>>;
type NavItem =
  | { kind: "group"; label: string }
  | { kind: "link"; id: PageId; label: string; icon: IconCmp };

const NAV: NavItem[] = [
  { kind: "link", id: "overview",       label: "Overview",        icon: Home },
  { kind: "group", label: "Foundations" },
  { kind: "link", id: "colors",         label: "Colors",          icon: Stars01 },
  { kind: "link", id: "shadows-blurs",  label: "Shadows & blurs", icon: Eye },
  { kind: "link", id: "spacing-grids",  label: "Spacing & grids", icon: Grid },
  { kind: "link", id: "typography",     label: "Typography",      icon: File },
  { kind: "link", id: "icons",          label: "Icons",           icon: HelpCircle },
  { kind: "group", label: "Components" },
  { kind: "link", id: "buttons",        label: "Buttons",         icon: Plus },
  { kind: "link", id: "button-group",   label: "Button group",    icon: Menu },
  { kind: "link", id: "social-buttons", label: "Social buttons",  icon: Users },
  { kind: "link", id: "close-button",   label: "Close button",    icon: XClose },
  { kind: "link", id: "avatars",        label: "Avatars",         icon: User },
  { kind: "link", id: "badges",         label: "Badges",          icon: CheckCircle },
  { kind: "link", id: "badge-groups",   label: "Badge groups",    icon: CheckCircle },
  { kind: "link", id: "status-pills",   label: "Status pills",    icon: InfoCircle },
  { kind: "link", id: "forms",          label: "Forms & inputs",  icon: Edit },
  { kind: "link", id: "cards",          label: "Cards",           icon: Folder },
  { kind: "link", id: "tooltips",       label: "Tooltips",        icon: InfoCircle },
];

// Adapt the `usePageRoute` validator below to read from the new shape
const SAMPLE_USER = {
  name: "Sathish Kumar",
  avatar: "https://i.pravatar.cc/120?img=14",
};

function usePageRoute(): [PageId, (p: PageId) => void] {
  const valid = React.useMemo(
    () =>
      new Set(
        NAV.filter((n): n is Extract<NavItem, { kind: "link" }> => n.kind === "link").map(
          (n) => n.id
        )
      ),
    []
  );
  const initial = (() => {
    const h = location.hash.slice(1) as PageId;
    return valid.has(h) ? h : ("overview" as PageId);
  })();
  const [page, setPage] = React.useState<PageId>(initial);

  React.useEffect(() => {
    const onHash = () => {
      const h = location.hash.slice(1) as PageId;
      setPage(valid.has(h) ? h : "overview");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [valid]);

  const set = (p: PageId) => {
    setPage(p);
    history.replaceState(null, "", "#" + p);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };
  return [page, set];
}

function Sidebar({ active, onChange }: { active: PageId; onChange: (p: PageId) => void }) {
  const [query, setQuery] = React.useState("");
  const q = query.trim().toLowerCase();

  // Filter & collapse orphan group labels when their items are all hidden.
  // A group label is kept iff at least one link with a matching label appears
  // AFTER it (before the next group label or end of list).
  const filtered = React.useMemo<NavItem[]>(() => {
    if (!q) return NAV;
    const matchedLinks: Array<{ index: number; item: NavItem }> = [];
    NAV.forEach((item, i) => {
      if (item.kind === "link" && item.label.toLowerCase().includes(q)) {
        matchedLinks.push({ index: i, item });
      }
    });
    if (matchedLinks.length === 0) return [];

    // Find which group labels still have at least one matched link beneath them
    const result: NavItem[] = [];
    NAV.forEach((item, i) => {
      if (item.kind === "group") {
        // Look ahead until the next group label
        const nextGroupIdx = NAV.findIndex((n, j) => j > i && n.kind === "group");
        const end = nextGroupIdx === -1 ? NAV.length : nextGroupIdx;
        const hasMatch = matchedLinks.some(m => m.index > i && m.index < end);
        if (hasMatch) result.push(item);
      } else if (item.kind === "link" && item.label.toLowerCase().includes(q)) {
        result.push(item);
      }
    });
    return result;
  }, [q]);

  return (
    <aside
      className="w-[260px] shrink-0 bg-white flex flex-col sticky top-0 h-screen z-10"
      style={{
        boxShadow:
          "4px 0 16px -2px rgba(16, 24, 40, 0.06), 1px 0 0 0 rgba(16, 24, 40, 0.05)",
      }}
    >
      {/* Brand mark · scienaptic wordmark + PULSE Design System caption */}
      <div className="px-[18px] pt-6 pb-4">
        <img src="/scienaptic-logo.png" alt="Scienaptic" className="h-7 w-auto block" />
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-base font-bold text-gray-900 tracking-tight leading-tight">PULSE</div>
          <div className="text-[11px] text-gray-500 leading-tight mt-1 uppercase tracking-wider font-medium">Design System</div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search here"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-[13px] bg-white border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-400 outline-none focus:border-brand-200 focus:shadow-[0_0_0_3px_rgba(255,121,24,0.18)] transition-shadow"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {filtered.map((item, i) => {
          if (item.kind === "group") {
            return (
              <div
                key={`g-${i}`}
                className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 px-2.5 pt-4 pb-1.5"
              >
                {item.label}
              </div>
            );
          }
          const isActive = item.id === active;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={
                "w-full flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-sm text-left transition-colors " +
                (isActive
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "font-medium text-gray-700 hover:bg-gray-50")
              }
            >
              <Icon className={"h-[18px] w-[18px] shrink-0 " + (isActive ? "text-gray-700" : "text-gray-500")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User profile pinned at bottom */}
      <div className="border-t border-gray-200 p-3 shrink-0">
        <button
          type="button"
          className="w-full flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
        >
          <img
            src={SAMPLE_USER.avatar}
            alt=""
            className="h-8 w-8 rounded-full shrink-0 object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{SAMPLE_USER.name}</div>
          </div>
          <span className="shrink-0 inline-flex flex-col items-center text-gray-400" aria-hidden>
            <ChevronUp className="h-3 w-3" />
            <ChevronDown className="h-3 w-3 -mt-1" />
          </span>
        </button>
      </div>
    </aside>
  );
}

/* =========================================================================
   Building blocks
   ========================================================================= */

function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-display-sm font-semibold text-gray-900 tracking-tight">{title}</h1>
      {subtitle && <p className="text-md text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );
}

function Block({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      {title && (
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

function Swatch({ hex, step }: { hex: string; step: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-full aspect-square rounded-md"
        style={{ background: hex, boxShadow: "inset 0 0 0 1px rgba(16,24,40,0.04)" }}
      />
      <span className="text-2xs text-gray-500 font-mono">{step}</span>
    </div>
  );
}

function ColorRow({ name, scale }: { name: string; scale: Record<string, string> }) {
  const steps = Object.keys(scale);
  return (
    <div className="grid items-center gap-4 py-2.5" style={{ gridTemplateColumns: "140px 1fr" }}>
      <div className="text-sm font-semibold text-gray-700">{name}</div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0,1fr))` }}>
        {steps.map((s) => <Swatch key={s} hex={scale[s]} step={s} />)}
      </div>
    </div>
  );
}

/* =========================================================================
   Page components — one per nav entry
   ========================================================================= */

function OverviewPage({ go }: { go: (p: PageId) => void }) {
  return (
    <section data-page="overview">
      <Badge tone="brand" dot className="mb-5">v0.2.0 · Untitled UI inspired</Badge>
      <h1 className="text-display-xl font-semibold text-gray-900 mb-5 max-w-3xl">
        A modern design system for B2B SaaS
      </h1>
      <p className="text-text-xl text-gray-600 max-w-2xl mb-10">
        Built on Untitled UI's conventions — semantic tokens, the signature ring shadow, focus rings at 24% opacity, and Inter at its best. Themed with your brand tangerine.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <Card interactive elevation="xs" onClick={() => go("colors")}>
          <CardContent>
            <div className="text-sm font-semibold text-gray-900">Start with foundations</div>
            <div className="text-sm text-gray-600 mt-1">Colors, typography, icons</div>
          </CardContent>
        </Card>
        <Card interactive elevation="xs" onClick={() => go("buttons")}>
          <CardContent>
            <div className="text-sm font-semibold text-gray-900">Browse components</div>
            <div className="text-sm text-gray-600 mt-1">10 hierarchies of buttons, badges, forms</div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ColorsPage() {
  const scales = [
    { name: "Brand", key: "brand" }, { name: "Gray (modern)", key: "gray" },
    { name: "Error", key: "error" }, { name: "Warning", key: "warning" }, { name: "Success", key: "success" },
    { name: "Blue", key: "blue" }, { name: "Indigo", key: "indigo" }, { name: "Purple", key: "purple" },
    { name: "Pink", key: "pink" }, { name: "Teal", key: "teal" }, { name: "AI Process", key: "aiProcess" },
  ] as const;
  return (
    <section data-page="colors">
      <PageHeader title="Color foundations" subtitle="Untitled UI naming · 12-step scales (25 → 950)" />
      <Card>
        <CardContent>
          {scales.map((s) => (
            <ColorRow key={s.key} name={s.name} scale={colors[s.key] as Record<string, string>} />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

/* ============================================================
   Typography page — Ag specimen + weight cards + per-size rows
   ============================================================ */

type TypeRowData = {
  name: string;
  sizePx: number;
  lhPx: number;
  /** Letter spacing in percent (e.g. -2 = -2%). null = none */
  lsPct: number | null;
};

const TYPE_SCALE: TypeRowData[] = [
  { name: "Display 2xl", sizePx: 72, lhPx: 90, lsPct: -2 },
  { name: "Display xl",  sizePx: 60, lhPx: 72, lsPct: -2 },
  { name: "Display lg",  sizePx: 48, lhPx: 60, lsPct: -2 },
  { name: "Display md",  sizePx: 36, lhPx: 44, lsPct: -2 },
  { name: "Display sm",  sizePx: 30, lhPx: 38, lsPct: null },
  { name: "Display xs",  sizePx: 24, lhPx: 32, lsPct: null },
  { name: "Text xl",     sizePx: 20, lhPx: 30, lsPct: null },
  { name: "Text lg",     sizePx: 18, lhPx: 28, lsPct: null },
  { name: "Text md",     sizePx: 16, lhPx: 24, lsPct: null },
  { name: "Text sm",     sizePx: 14, lhPx: 20, lsPct: null },
  { name: "Text xs",     sizePx: 12, lhPx: 18, lsPct: null },
];

const WEIGHTS: ReadonlyArray<{ name: string; value: 400 | 500 | 600 | 700 }> = [
  { name: "Regular",  value: 400 },
  { name: "Medium",   value: 500 },
  { name: "Semibold", value: 600 },
  { name: "Bold",     value: 700 },
];

function formatRem(px: number): string {
  return (px / 16).toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function TypeSpecimenCell({
  text,
  weight,
  weightLabel,
  sizePx,
  lhPx,
  letterSpacing,
}: {
  text: string;
  weight: 400 | 500 | 600 | 700;
  weightLabel: string;
  sizePx: number;
  lhPx: number;
  letterSpacing: string;
}) {
  const base: React.CSSProperties = {
    fontSize: `${sizePx}px`,
    lineHeight: `${lhPx}px`,
    letterSpacing,
    fontWeight: weight,
    color: "#121926",
    wordBreak: "break-word",
  };
  return (
    <div className="min-w-0 overflow-hidden">
      <div style={base}>{text}</div>
      <div style={{ ...base, marginTop: Math.max(8, lhPx * 0.1) }}>{weightLabel}</div>
    </div>
  );
}

function TypeRow({ row, isFirst }: { row: TypeRowData; isFirst: boolean }) {
  const { name, sizePx, lhPx, lsPct } = row;
  const specs = [
    `Font size: ${sizePx}px / ${formatRem(sizePx)}rem`,
    `Line height: ${lhPx}px / ${formatRem(lhPx)}rem`,
    lsPct != null ? `Letter spacing: ${lsPct}%` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  const letterSpacing = lsPct != null ? `${lsPct / 100}em` : "0";

  return (
    <>
      <div
        className={`${isFirst ? "pt-2" : "pt-12"} pb-4 border-b border-gray-200 flex items-baseline justify-between gap-4`}
      >
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <span className="text-xs text-gray-500 font-mono">{specs}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-10 gap-y-4 pt-8 pb-2">
        {WEIGHTS.map((w) => (
          <TypeSpecimenCell
            key={w.value}
            text={name}
            weight={w.value}
            weightLabel={w.name}
            sizePx={sizePx}
            lhPx={lhPx}
            letterSpacing={letterSpacing}
          />
        ))}
      </div>
    </>
  );
}

function WeightCard({
  label,
  weight,
}: {
  label: string;
  weight: 400 | 500 | 600 | 700;
}) {
  return (
    <div className="flex items-center gap-4">
      <span
        className="w-12 text-3xl text-gray-900"
        style={{ fontWeight: weight }}
      >
        Aa
      </span>
      <div>
        <div className="text-sm font-semibold text-gray-900">{label}</div>
        <div className="text-xs text-gray-500">Font weight: {weight}</div>
      </div>
    </div>
  );
}

/* ============================================================
   Spacing & Grids page
   ============================================================ */

const SPACING_SCALE: ReadonlyArray<readonly [string, number, string]> = [
  ["0",   0,   "0"],        ["px",  1,   "1px"],
  ["0.5", 2,   "0.125rem"], ["1",   4,   "0.25rem"],
  ["1.5", 6,   "0.375rem"], ["2",   8,   "0.5rem"],
  ["2.5", 10,  "0.625rem"], ["3",   12,  "0.75rem"],
  ["3.5", 14,  "0.875rem"], ["4",   16,  "1rem"],
  ["5",   20,  "1.25rem"],  ["6",   24,  "1.5rem"],
  ["7",   28,  "1.75rem"],  ["8",   32,  "2rem"],
  ["10",  40,  "2.5rem"],   ["12",  48,  "3rem"],
  ["14",  56,  "3.5rem"],   ["16",  64,  "4rem"],
  ["20",  80,  "5rem"],     ["24",  96,  "6rem"],
  ["32",  128, "8rem"],     ["40",  160, "10rem"],
  ["48",  192, "12rem"],
] as const;

const RADIUS_SCALE: ReadonlyArray<readonly [string, number, string]> = [
  ["none", 0,    "0"],         ["xxs",  2,    "0.125rem"],
  ["xs",   4,    "0.25rem"],   ["sm",   6,    "0.375rem"],
  ["md",   8,    "0.5rem"],    ["lg",   10,   "0.625rem"],
  ["xl",   12,   "0.75rem"],   ["2xl",  16,   "1rem"],
  ["3xl",  20,   "1.25rem"],   ["4xl",  24,   "1.5rem"],
  ["full", 9999, "9999px"],
] as const;

const CONTAINER_SCALE: ReadonlyArray<readonly [string, number, string]> = [
  ["xs",  480,  "Narrow modal, single-column form"],
  ["sm",  640,  "Mobile-only marketing pages"],
  ["md",  768,  "Tablet portrait, dialog"],
  ["lg",  1024, "Tablet landscape, compact dashboard"],
  ["xl",  1280, "Narrow desktop, classic 12-col layout"],
  ["2xl", 1440, "Standard desktop dashboard"],
  ["3xl", 1600, "Wide desktop — used by this design system"],
  ["4xl", 1920, "Ultra-wide / TV displays"],
] as const;

const SPACING_RECIPES: ReadonlyArray<readonly [string, string, string]> = [
  ["Card padding",        "px-6 py-5",    "24px / 20px"],
  ["Card inner gap",      "gap-4",        "16px"],
  ["Tight icon gap",      "gap-1.5",      "6px"],
  ["Default text gap",    "gap-2",        "8px"],
  ["Button padding (md)", "px-4 h-10",    "16px / 40px"],
  ["Input padding (md)",  "px-3.5 h-10",  "14px / 40px"],
  ["Form field gap",      "gap-1.5",      "6px (label↔input)"],
  ["Form fields gap",     "gap-6",        "24px (between fields)"],
  ["Section margin",      "mb-20",        "80px"],
  ["Section internal",    "mb-6",         "24px (heading↔body)"],
  ["Modal padding",       "p-6",          "24px"],
  ["Page margin",         "px-10 py-10",  "40px (desktop)"],
] as const;

function copyText(text: string) {
  navigator.clipboard?.writeText(text);
}

function SpacingScaleRow({ token, px, rem }: { token: string; px: number; rem: string }) {
  const widthPct = Math.min(100, (px / 192) * 100);
  const isAnchor = [4, 8, 16, 24].includes(px);
  return (
    <button
      type="button"
      className="group w-full flex items-center gap-4 py-2.5 px-2 -mx-2 rounded-md text-left hover:bg-gray-50 transition-colors focus:outline-none"
      onClick={() => copyText(`${px}px`)}
      title={`Copy ${px}px`}
    >
      <span className="w-16 shrink-0 text-sm font-mono font-semibold text-gray-800">{token}</span>
      <span className="w-20 shrink-0 text-xs font-mono text-gray-600">{px}px</span>
      <span className="w-24 shrink-0 text-xs font-mono text-gray-500">{rem}</span>
      <span className="flex-1 relative" style={{ height: 14 }}>
        <span
          className={`absolute inset-y-0 left-0 rounded-sm ${isAnchor ? "bg-brand-500" : "bg-gray-300"}`}
          style={{ width: `${widthPct}%`, minWidth: 1 }}
        />
      </span>
    </button>
  );
}

function RadiusCard({ token, px, rem }: { token: string; px: number; rem: string }) {
  const isDefault = token === "md" || token === "xl";
  return (
    <button
      type="button"
      className="group flex flex-col items-center gap-3 transition-transform hover:-translate-y-0.5 focus:outline-none"
      onClick={() => copyText(rem)}
      title={`Copy ${rem}`}
    >
      <span
        className={`block w-20 h-20 bg-brand-500 ${isDefault ? "ring-2 ring-offset-2 ring-brand-500/40" : ""}`}
        style={{ borderRadius: `${px}px` }}
      />
      <span className="text-center">
        <span className="block text-sm font-mono font-semibold text-gray-800 leading-none">{token}</span>
        <span className="block text-xs text-gray-500 mt-1">{px === 9999 ? "pill" : `${px}px`}</span>
        {isDefault && (
          <span className="block text-[10px] text-brand-700 font-mono mt-0.5">default</span>
        )}
      </span>
    </button>
  );
}

function ContainerRow({ token, px, desc }: { token: string; px: number; desc: string }) {
  const widthPct = Math.min(100, (px / 1920) * 100);
  const isDefault = token === "3xl";
  return (
    <button
      type="button"
      className="group w-full flex items-center gap-4 py-2.5 px-2 -mx-2 rounded-md text-left hover:bg-gray-50 transition-colors focus:outline-none"
      onClick={() => copyText(`${px}px`)}
      title={`Copy ${px}px`}
    >
      <span className={`w-16 shrink-0 text-sm font-mono font-semibold ${isDefault ? "text-brand-700" : "text-gray-800"}`}>
        {token}
      </span>
      <span className="w-20 shrink-0 text-xs font-mono text-gray-600">{px}px</span>
      <span className="flex-1 relative" style={{ height: 18 }}>
        <span
          className={`absolute inset-y-0 left-0 rounded-sm ${isDefault ? "bg-brand-500" : "bg-gray-300"}`}
          style={{ width: `${widthPct}%` }}
        />
      </span>
      <span className="w-72 shrink-0 text-xs text-gray-600 truncate">{desc}</span>
    </button>
  );
}

function GridDemo({ label, spans }: { label: string; spans: ReadonlyArray<{ span: number; label?: string; dashed?: boolean; tone?: "brand" | "gray-100" | "gray-200" }> }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-2 font-mono">{label}</div>
      <div className="grid grid-cols-12 gap-2">
        {spans.map((cell, i) => {
          const cls =
            cell.dashed
              ? "rounded-md border border-dashed border-gray-300"
              : cell.tone === "brand"
              ? "bg-brand-100 border border-brand-200 rounded-md flex items-center justify-center text-xs font-mono text-brand-700"
              : cell.tone === "gray-200"
              ? "bg-gray-200 border border-gray-300 rounded-md flex items-center justify-center text-xs font-mono text-gray-800"
              : "bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center text-xs font-mono text-gray-700";
          return (
            <div key={i} className={`h-12 ${cls}`} style={{ gridColumn: `span ${cell.span} / span ${cell.span}` }}>
              {cell.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SpacingGridsPage() {
  return (
    <section data-page="spacing-grids">
      <PageHeader
        title="Spacing & grids"
        subtitle="4px base unit · 23-step scale · 11-step radius · 12-column grid · 8 container widths"
      />

      {/* Rationale */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-6 mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Design principle</div>
        <p className="text-base text-gray-700 max-w-3xl">
          Everything is built on a <strong>4px atomic unit</strong>. Most production work uses multiples of{" "}
          <strong>8px</strong> for the rhythm. Two principles: (1) consistent spacing creates visual hierarchy
          without extra ink; (2) the 4px unit gives enough granularity for tight UI (icon paddings, badges)
          while 8px increments dominate for breathing room (card padding, gaps, sections).
        </p>
      </div>

      {/* Base unit */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Base unit</div>
        </div>
        <div className="px-8 py-8 flex items-end gap-6 flex-wrap">
          {[
            { px: 4,  token: "spacing-1", rem: "0.25rem" },
            { px: 8,  token: "spacing-2", rem: "0.5rem" },
            { px: 16, token: "spacing-4", rem: "1rem" },
            { px: 24, token: "spacing-6", rem: "1.5rem" },
          ].map((u) => (
            <div key={u.px} className="flex flex-col items-center gap-2">
              <div className="bg-brand-500 rounded-sm" style={{ width: u.px, height: 48 }} />
              <div className="text-sm font-mono font-semibold text-gray-900">{u.px}px</div>
              <div className="text-xs text-gray-500">{u.rem}</div>
              <div className="text-xs text-gray-500 font-mono">{u.token}</div>
            </div>
          ))}
          <div className="ml-4 max-w-md text-sm text-gray-600">
            <strong className="text-gray-900">Anchors:</strong> 4 (gap between adjacent text), 8 (default gap),
            16 (body padding), 24 (card padding). Use these whenever possible.
          </div>
        </div>
      </div>

      {/* Spacing scale */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Spacing scale · 23 steps</div>
          <div className="text-sm text-gray-600 mt-1">Each bar's width equals the spacing value · click to copy</div>
        </div>
        <div className="px-8 py-6">
          {SPACING_SCALE.map(([t, px, rem]) => (
            <SpacingScaleRow key={t} token={t} px={px} rem={rem} />
          ))}
        </div>
      </div>

      {/* Radius scale */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Radius · 11 steps</div>
          <div className="text-sm text-gray-600 mt-1">From sharp (none) to pill (full) · md (8px) is the default for buttons + inputs, xl (12px) for cards</div>
        </div>
        <div className="px-8 py-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {RADIUS_SCALE.map(([t, px, rem]) => (
            <RadiusCard key={t} token={t} px={px} rem={rem} />
          ))}
        </div>
      </div>

      {/* Container widths */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Container widths · 8 sizes</div>
          <div className="text-sm text-gray-600 mt-1">
            Max-widths for centered page layouts · this design system uses{" "}
            <code className="font-mono text-xs">3xl (1600px)</code> as the outer cap
          </div>
        </div>
        <div className="px-8 py-6">
          {CONTAINER_SCALE.map(([t, px, desc]) => (
            <ContainerRow key={t} token={t} px={px} desc={desc} />
          ))}
        </div>
      </div>

      {/* 12-column grid */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">12-column grid</div>
          <div className="text-sm text-gray-600 mt-1">12 fluid columns · 16px gutters · 32px outer margin · typical layout patterns below</div>
        </div>
        <div className="px-8 py-8 space-y-6">
          <GridDemo
            label="12 cols"
            spans={Array.from({ length: 12 }, (_, i) => ({ span: 1, label: String(i + 1), tone: "brand" }))}
          />
          <GridDemo
            label="8 + 4 — content + sidebar"
            spans={[
              { span: 8, label: "8 (content)", tone: "gray-100" },
              { span: 4, label: "4 (sidebar)", tone: "gray-200" },
            ]}
          />
          <GridDemo
            label="3 × 4 — three equal cards"
            spans={[
              { span: 4, label: "4", tone: "gray-100" },
              { span: 4, label: "4", tone: "gray-100" },
              { span: 4, label: "4", tone: "gray-100" },
            ]}
          />
          <GridDemo
            label="6 + 6 — two equal columns"
            spans={[
              { span: 6, label: "6", tone: "gray-100" },
              { span: 6, label: "6", tone: "gray-100" },
            ]}
          />
          <GridDemo
            label="2 + 8 + 2 — centered form"
            spans={[
              { span: 2, dashed: true },
              { span: 8, label: "8 (form)", tone: "brand" },
              { span: 2, dashed: true },
            ]}
          />
        </div>
      </div>

      {/* Recipes */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Spacing recipes</div>
          <div className="text-sm text-gray-600 mt-1">Memorize these so you stop guessing</div>
        </div>
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 text-sm">
            {SPACING_RECIPES.map(([label, cls, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-700">{label}</span>
                <div className="flex items-center gap-3">
                  <code className="font-mono text-xs text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded">{cls}</code>
                  <span className="text-xs font-mono text-gray-500 w-32 text-right">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TypographyPage() {
  return (
    <section data-page="typography">
      <PageHeader
        title="Typography"
        subtitle="Inter · Display + Text scales · 4 weights · -2% letter-spacing on display"
      />

      {/* Hero specimen card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 items-start">
          <div>
            <div className="text-sm font-medium text-gray-900 mb-3">Inter</div>
            <div
              className="leading-none font-semibold text-gray-900 tracking-tight mb-6"
              style={{ fontSize: 120 }}
            >
              Ag
            </div>
            <div className="font-mono text-sm text-gray-800 leading-relaxed space-y-0.5">
              <div>ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
              <div>abcdefghijklmnopqrstuvwxyz</div>
              <div>0123456789 !@#$%^&amp;*()</div>
            </div>
          </div>
          <div className="space-y-4">
            <WeightCard label="Regular" weight={400} />
            <WeightCard label="Medium" weight={500} />
            <WeightCard label="Semibold" weight={600} />
            <WeightCard label="Bold" weight={700} />
          </div>
        </div>
      </div>

      {/* Size scale */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs px-8 py-2">
        {TYPE_SCALE.map((row, i) => (
          <TypeRow key={row.name} row={row} isFirst={i === 0} />
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   Shadows & Blurs page — 8 elevations + 4 inner + 5 glows + 5 rings + 8 blurs
   ============================================================ */

const ELEVATION_SHADOWS: ReadonlyArray<readonly [string, string, string]> = [
  ["none", "none", "Flat — no depth at all."],
  ["xs",   "0 1px 2px 0 rgba(16, 24, 40, 0.05)", "Subtle ring. Table rows, dense lists."],
  ["sm",   "0 1px 2px 0 rgba(16, 24, 40, 0.06), 0 1px 3px 0 rgba(16, 24, 40, 0.10)", "Cards at rest, secondary surfaces."],
  ["md",   "0 2px 4px -2px rgba(16, 24, 40, 0.06), 0 4px 8px -2px rgba(16, 24, 40, 0.10)", "Default card, table hover, dropdown trigger."],
  ["lg",   "0 4px 6px -2px rgba(16, 24, 40, 0.03), 0 12px 16px -4px rgba(16, 24, 40, 0.08)", "Open dropdown, popover, tooltip."],
  ["xl",   "0 8px 8px -4px rgba(16, 24, 40, 0.03), 0 20px 24px -4px rgba(16, 24, 40, 0.08)", "Modal at center, command palette."],
  ["2xl",  "0 24px 48px -12px rgba(16, 24, 40, 0.18)", "Large modal, slide-over drawer."],
  ["3xl",  "0 32px 64px -12px rgba(16, 24, 40, 0.14)", "Full-screen overlay, lightbox, hero."],
  ["skeu", "inset 0 -2px 0 0 rgba(16, 24, 40, 0.12), 0 1px 2px 0 rgba(16, 24, 40, 0.08)", "Tactile filled-button depth."],
] as const;

const INNER_SHADOWS: ReadonlyArray<readonly [string, string, string]> = [
  ["inner-xs", "inset 0 1px 2px 0 rgba(16, 24, 40, 0.05)", "Subtle 1px inset · scroll edge."],
  ["inner-sm", "inset 0 2px 4px 0 rgba(16, 24, 40, 0.06)", "Light inset · inset divider."],
  ["inner-md", "inset 0 4px 8px 0 rgba(16, 24, 40, 0.08)", "Pressed button · active toggle."],
  ["inner-lg", "inset 0 8px 16px -4px rgba(16, 24, 40, 0.10)", "Deep inset · hero panel."],
] as const;

const GLOW_SHADOWS: ReadonlyArray<readonly [string, string, string, string]> = [
  ["glow-brand",   "0 0 24px 0 rgba(255, 121, 24, 0.35)",  "#FF7918", "Primary CTA halo"],
  ["glow-error",   "0 0 24px 0 rgba(239, 68, 68, 0.30)",   "#EF4444", "Error emphasis"],
  ["glow-success", "0 0 24px 0 rgba(16, 185, 129, 0.30)",  "#10B981", "Success state"],
  ["glow-warning", "0 0 24px 0 rgba(234, 179, 8, 0.30)",   "#EAB308", "Warning highlight"],
  ["glow-info",    "0 0 24px 0 rgba(46, 144, 250, 0.30)",  "#2E90FA", "AI thinking / info"],
] as const;

const FOCUS_RINGS: ReadonlyArray<readonly [string, string, string, string]> = [
  ["ring-brand",   "0 0 0 4px rgba(255, 121, 24, 0.24)",   "#FF7918", "Default focus on brand controls"],
  ["ring-gray",    "0 0 0 4px rgba(152, 162, 179, 0.14)",  "#9AA4B2", "Secondary / outlined controls"],
  ["ring-error",   "0 0 0 4px rgba(239, 68, 68, 0.24)",    "#EF4444", "Invalid inputs"],
  ["ring-success", "0 0 0 4px rgba(16, 185, 129, 0.24)",   "#10B981", "Valid / confirmed state"],
  ["ring-warning", "0 0 0 4px rgba(234, 179, 8, 0.24)",    "#EAB308", "Caution state"],
] as const;

const BLUR_SCALE: ReadonlyArray<readonly [string, string, string]> = [
  ["blur-none", "0",    "No blur"],
  ["blur-xs",   "2px",  "Subtle softening"],
  ["blur-sm",   "4px",  "Tooltip backdrop"],
  ["blur-md",   "8px",  "Default glass effect"],
  ["blur-lg",   "16px", "Modal backdrop"],
  ["blur-xl",   "24px", "Hero blur behind content"],
  ["blur-2xl",  "40px", "Decorative blob"],
  ["blur-3xl",  "64px", "Maximum — almost color-only"],
] as const;

function ShadowCard({ name, css, desc }: { name: string; css: string; desc: string }) {
  return (
    <button
      type="button"
      className="group flex flex-col text-left transition-transform hover:-translate-y-0.5 focus:outline-none"
      onClick={() => navigator.clipboard?.writeText(css)}
      title={`Copy: ${css}`}
    >
      <span
        className="block h-24 w-full rounded-xl bg-white"
        style={{ boxShadow: css, border: "1px solid rgba(16,24,40,0.04)" }}
      />
      <span className="mt-3 px-0.5 space-y-1">
        <span className="block text-sm font-mono font-semibold text-gray-800 leading-none">{name}</span>
        <span className="block text-xs text-gray-600 leading-tight">{desc}</span>
      </span>
    </button>
  );
}

function GlowCard({ name, css, hex, desc }: { name: string; css: string; hex: string; desc: string }) {
  return (
    <button
      type="button"
      className="group flex flex-col text-left p-3 transition-transform hover:-translate-y-0.5 focus:outline-none"
      onClick={() => navigator.clipboard?.writeText(css)}
      title={`Copy: ${css}`}
    >
      <span className="block h-20 w-full rounded-xl" style={{ background: hex, boxShadow: css }} />
      <span className="mt-4 px-0.5 space-y-1">
        <span className="block text-sm font-mono font-semibold text-gray-800 leading-none">{name}</span>
        <span className="block text-xs text-gray-600 leading-tight">{desc}</span>
      </span>
    </button>
  );
}

function RingCard({ name, css, hex, desc }: { name: string; css: string; hex: string; desc: string }) {
  return (
    <button
      type="button"
      className="group flex flex-col text-left p-3 transition-transform hover:-translate-y-0.5 focus:outline-none"
      onClick={() => navigator.clipboard?.writeText(css)}
      title={`Copy: ${css}`}
    >
      <span className="flex items-center justify-center h-20 w-full">
        <span
          className="inline-block h-10 w-32 rounded-md bg-white border"
          style={{ borderColor: hex, boxShadow: css }}
        />
      </span>
      <span className="mt-3 px-0.5 space-y-1">
        <span className="block text-sm font-mono font-semibold text-gray-800 leading-none">{name}</span>
        <span className="block text-xs text-gray-600 leading-tight">{desc}</span>
      </span>
    </button>
  );
}

function FilterBlurCard({ name, value, desc }: { name: string; value: string; desc: string }) {
  return (
    <button
      type="button"
      className="group flex flex-col text-left transition-transform hover:-translate-y-0.5 focus:outline-none"
      onClick={() => navigator.clipboard?.writeText(`filter: blur(${value});`)}
      title={`filter: blur(${value})`}
    >
      <span className="relative block h-28 w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
        <span
          className="absolute inset-3 rounded-full"
          style={{
            background: "linear-gradient(135deg, #FF7918 0%, #DD2590 100%)",
            filter: `blur(${value})`,
          }}
        />
      </span>
      <span className="mt-3 px-0.5 space-y-1">
        <span className="block text-sm font-mono font-semibold text-gray-800 leading-none">
          {name} <span className="text-gray-500">· {value}</span>
        </span>
        <span className="block text-xs text-gray-600 leading-tight">{desc}</span>
      </span>
    </button>
  );
}

function BackdropBlurCard({ name, value, desc }: { name: string; value: string; desc: string }) {
  return (
    <button
      type="button"
      className="group flex flex-col text-left transition-transform hover:-translate-y-0.5 focus:outline-none"
      onClick={() => navigator.clipboard?.writeText(`backdrop-filter: blur(${value});`)}
      title={`backdrop-filter: blur(${value})`}
    >
      <span className="flex items-center justify-center h-28 w-full">
        <span
          className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white/30 border border-white/40 text-xs font-mono font-semibold text-white"
          style={{
            backdropFilter: `blur(${value})`,
            WebkitBackdropFilter: `blur(${value})`,
          }}
        >
          {value}
        </span>
      </span>
      <span className="mt-3 px-0.5 space-y-1">
        <span className="block text-sm font-mono font-semibold text-white/95 leading-none">{name}</span>
        <span className="block text-xs text-white/80 leading-tight">{desc}</span>
      </span>
    </button>
  );
}

function ShadowsBlursPage() {
  return (
    <section data-page="shadows-blurs">
      <PageHeader
        title="Shadows & blurs"
        subtitle="8 elevation levels · 4 inner · 5 colored glows · 5 focus rings · 8 blurs · click any to copy CSS"
      />

      {/* Rationale */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-6 mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Design principle</div>
        <p className="text-base text-gray-700 max-w-3xl">
          Every elevation shadow is a <strong>two-layer stack</strong> — a sharp close-shadow that grounds the
          element + a soft ambient shadow that simulates light bleed. Together they produce natural depth that
          single-shadow systems can't match. Bump up exactly <strong>one level</strong> on hover.
        </p>
      </div>

      {/* Elevation */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Elevation · 8 levels</div>
          <div className="text-sm text-gray-600 mt-1">From flat (none) to maximum overlay (3xl) · plus skeu for tactile button feel</div>
        </div>
        <div className="px-8 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {ELEVATION_SHADOWS.map(([name, css, desc]) => (
            <ShadowCard key={name} name={name} css={css} desc={desc} />
          ))}
        </div>
      </div>

      {/* Inner */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs mt-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Inner shadows · 4 levels</div>
          <div className="text-sm text-gray-600 mt-1">For pressed states, inset wells, scroll indicators, divided panels</div>
        </div>
        <div className="px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8">
          {INNER_SHADOWS.map(([name, css, desc]) => (
            <ShadowCard key={name} name={name} css={css} desc={desc} />
          ))}
        </div>
      </div>

      {/* Colored glows */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs mt-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Colored glows · for emphasis</div>
          <div className="text-sm text-gray-600 mt-1">Use sparingly on primary CTAs, error states, AI-thinking indicators</div>
        </div>
        <div className="px-8 py-10 grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-8">
          {GLOW_SHADOWS.map(([name, css, hex, desc]) => (
            <GlowCard key={name} name={name} css={css} hex={hex} desc={desc} />
          ))}
        </div>
      </div>

      {/* Focus rings */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs mt-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Focus rings · 4px @ 24% opacity</div>
          <div className="text-sm text-gray-600 mt-1">
            Applied on <code className="font-mono text-xs">:focus-visible</code> for keyboard navigation
          </div>
        </div>
        <div className="px-8 py-10 grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-8">
          {FOCUS_RINGS.map(([name, css, hex, desc]) => (
            <RingCard key={name} name={name} css={css} hex={hex} desc={desc} />
          ))}
        </div>
      </div>

      {/* Filter blurs */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs mt-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Filter blurs · 8 levels</div>
          <div className="text-sm text-gray-600 mt-1">
            Applied via <code className="font-mono text-xs">filter: blur(…)</code> — blurs the element itself
          </div>
        </div>
        <div className="px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {BLUR_SCALE.map(([name, value, desc]) => (
            <FilterBlurCard key={name} name={name} value={value} desc={desc} />
          ))}
        </div>
      </div>

      {/* Backdrop blurs */}
      <div
        className="rounded-xl shadow-xs mt-6 overflow-hidden border border-gray-200"
        style={{ background: "linear-gradient(135deg, #FACC15 0%, #FF7918 50%, #EE46BC 100%)" }}
      >
        <div className="px-6 py-5 border-b border-white/20 bg-white/10 backdrop-blur-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/90">Backdrop blurs · glass morphism</div>
          <div className="text-sm text-white/80 mt-1">
            Applied via <code className="font-mono text-xs">backdrop-filter: blur(…)</code> — blurs the layer
            behind the element. Background shown is intentionally vibrant so the effect is visible.
          </div>
        </div>
        <div className="px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {BLUR_SCALE.map(([name, value, desc]) => (
            <BackdropBlurCard key={name} name={name} value={value} desc={desc} />
          ))}
        </div>
      </div>
    </section>
  );
}

function IconsPage() {
  return (
    <section data-page="icons">
      <PageHeader title="Icons" subtitle={`Lucide (MIT) · ${Object.keys(iconRegistry).length} curated below + all 1,500 available via @/icons or lucide-react · 2px stroke · 24×24`} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-6 md:grid-cols-10 gap-3">
            {(Object.keys(iconRegistry) as IconName[]).map((name) => {
              const Cmp = iconRegistry[name];
              return (
                <div
                  key={name}
                  className="group flex flex-col items-center gap-2 p-3 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  title={name}
                >
                  <Cmp className="h-5 w-5 text-gray-700 group-hover:text-gray-900" />
                  <span className="text-2xs text-gray-500 font-mono truncate w-full text-center">{name}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

const BTN_SIZES = ["sm", "md", "lg", "xl", "2xl"] as const;
const BTN_SIZE_LABEL: Record<(typeof BTN_SIZES)[number], string> = {
  sm: "Small", md: "Medium", lg: "Large", xl: "Extra Large", "2xl": "2XL",
};

type BtnUsage = { doItems: string[]; dontItems: string[] };

const CheckMini = () => (
  <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
);
const XMini = () => (
  <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
);

function UsageGuide({ doItems, dontItems }: BtnUsage) {
  return (
    <details className="mt-5 group">
      <summary className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 select-none list-none [&::-webkit-details-marker]:hidden">
        <svg className="h-3.5 w-3.5 shrink-0 transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        Usage guidance
        <span className="text-gray-400 font-normal">· {doItems.length} use · {dontItems.length} avoid</span>
      </summary>
      <div className="grid md:grid-cols-2 gap-3 mt-3">
        <div className="rounded-lg bg-success-25 border border-success-200 px-4 py-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-success-700 mb-2">
            <CheckMini /> Use when
          </div>
          <ul className="space-y-1.5 text-xs text-gray-700 leading-relaxed">
            {doItems.map((t, i) => (
              <li key={i} className="flex gap-2">
                <span className="bg-success-500 mt-1.5 h-1 w-1 rounded-full shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-error-25 border border-error-200 px-4 py-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-error-700 mb-2">
            <XMini /> Avoid when
          </div>
          <ul className="space-y-1.5 text-xs text-gray-700 leading-relaxed">
            {dontItems.map((t, i) => (
              <li key={i} className="flex gap-2">
                <span className="bg-error-500 mt-1.5 h-1 w-1 rounded-full shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}

function NumberedSection({ num, title, description, usage, children }: {
  num: number; title: string; description: string; usage?: BtnUsage; children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xs px-6 py-6">
      <div className="flex items-baseline gap-3 mb-4 pb-3 border-b border-gray-100">
        <span className="font-mono text-xs font-semibold text-brand-600">{num.toString().padStart(2, "0")}</span>
        <span className="text-base font-semibold text-gray-900">{title}</span>
        <span className="text-xs text-gray-500 ml-auto text-right">{description}</span>
      </div>
      {children}
      {usage && <UsageGuide {...usage} />}
    </div>
  );
}

function BtnRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

function SubGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="text-xs font-medium text-gray-500 mb-2">{label}</div>
      <BtnRow>{children}</BtnRow>
    </div>
  );
}

const BTN_USAGE: Record<number, BtnUsage> = {
  1: {
    doItems: [
      "Solid: Save, Submit, Continue in tables, forms, dialogs",
      "Gradient: hero CTAs on landing / marketing pages only",
      'One primary per view — reserve for the "go" action',
    ],
    dontItems: [
      "Two primaries side-by-side (they weaken each other)",
      "Gradient inside data tables or dense forms",
      "Destructive actions — use destructive-primary instead",
    ],
  },
  2: {
    doItems: [
      "Alternate to a primary (Cancel next to Save)",
      "Toolbar actions with equal weight",
      "secondary-color inside brand-heavy panels",
    ],
    dontItems: [
      "As the main call-to-action",
      "Multiple secondary-color in the same row (visual noise)",
      "Destructive actions — use destructive-secondary",
    ],
  },
  3: {
    doItems: [
      "Low-stakes actions in dense tables",
      "Row-level actions (Edit, Duplicate, More)",
      "Alongside a primary when hierarchy matters",
    ],
    dontItems: [
      "The single/main affordance in a critical flow",
      "Destructive actions — use destructive-tertiary",
      "Places where the user needs high visibility",
    ],
  },
  4: {
    doItems: [
      'Inline text actions ("Learn more", "View details")',
      "Promotional or highlighted secondary paths",
      "Inside cards/rows as a subtle CTA",
    ],
    dontItems: [
      "Critical or irreversible actions",
      "Chaining several in a row (looks like navigation)",
      "When the surrounding text is already brand-colored",
    ],
  },
  5: {
    doItems: [
      "Cancel next to a link-color action",
      "Footer or help-text links",
      "Skip · Not now · Maybe later flows",
    ],
    dontItems: [
      "Where the action needs to catch attention",
      "As the confirming action in a form",
      "Against gray backgrounds (contrast too low)",
    ],
  },
  6: {
    doItems: [
      'Create/add flows (Plus + "New project")',
      "Import/export with recognizable glyphs",
      "Actions where the icon reinforces the label",
    ],
    dontItems: [
      "Decorative icons unrelated to the action",
      "Very long labels — icon impact drops",
      "Two leading icons on the same button",
    ],
  },
  7: {
    doItems: [
      'Navigation or progression ("Continue" + arrow)',
      "Reveal patterns (dropdown chevron, expand)",
      "External links (arrow-up-right)",
    ],
    dontItems: [
      "Save/Submit — hints at a next step that isn't there",
      "Destructive actions — trailing arrow implies continuity",
      "Combining with a leading icon (visually cluttered)",
    ],
  },
  8: {
    doItems: [
      "Toolbar controls with universal glyphs (Search, Menu)",
      "Dense table row actions (Edit, Delete, More)",
      "When space is limited and meaning is obvious",
    ],
    dontItems: [
      "Without an aria-label (screen readers can't parse)",
      "Ambiguous glyphs (Gear, Layers) — use a text button",
      "Destructive icon-only without a confirmation dialog",
    ],
  },
  9: {
    doItems: [
      "Async actions that exceed ~200 ms",
      "Form submissions with API calls",
      "Bulk operations (Export CSV, Send invites)",
    ],
    dontItems: [
      "Button width shifting between states",
      'Hiding the label — use "Saving…" not just a spinner',
      "Loading state that never times out",
    ],
  },
  10: {
    doItems: [
      "Action blocked by an unmet requirement",
      "Paired with helper text explaining why",
      "On step-forward when required fields are empty",
    ],
    dontItems: [
      "To permanently hide a feature — remove it instead",
      "Disabled-only feedback without an explanation",
      "On the primary CTA without a validation hint",
    ],
  },
  11: {
    doItems: [
      "Confirming an irreversible action inside a modal",
      '"Delete permanently" · "Wipe data" · "Erase account"',
      "Once per confirmation flow, paired with Cancel",
    ],
    dontItems: [
      "As the entry point to a delete flow",
      "Outside of a confirmation dialog",
      "For soft deletes — use destructive-secondary",
    ],
  },
  12: {
    doItems: [
      "Reversible dangerous actions (Archive, Remove, Unpublish)",
      "Table row actions where delete is optional",
      "Entry point that opens a confirm modal",
    ],
    dontItems: [
      "Irreversible actions — use destructive-primary",
      "Same row as a destructive-primary (mixed signals)",
      "Where a plain secondary would suffice",
    ],
  },
  13: {
    doItems: [
      "Trash icon in every row of a table",
      "Ghost delete inside a card or list item",
      "Alongside other ghost row-level actions",
    ],
    dontItems: [
      "As the only path to an irreversible action",
      "Without a confirmation dialog",
      'Where the icon alone isn\'t universally read as "delete"',
    ],
  },
};

function ButtonsPage() {
  return (
    <section data-page="buttons">
      <PageHeader
        title="Buttons"
        subtitle="13 patterns · 10 hierarchies × 5 sizes · leading/trailing icons · loading + disabled · destructive trio"
      />
      <div className="space-y-4">
          {/* 01 · Primary buttons — solid (default) + gradient (opt-in for hero CTAs) */}
          <NumberedSection num={1} title="Primary buttons" description="Solid for everyday · gradient for hero CTAs" usage={BTN_USAGE[1]}>
            <SubGroup label="Solid · default for tables, forms, dialogs">
              {BTN_SIZES.map((s) => (
                <Button key={s} hierarchy="primary" size={s}>{BTN_SIZE_LABEL[s]}</Button>
              ))}
            </SubGroup>
            <SubGroup label="Gradient · opt-in for hero/landing CTAs · #FF7918 → #E5610A">
              {BTN_SIZES.map((s) => (
                <Button key={s} hierarchy="primary-gradient" size={s}>{BTN_SIZE_LABEL[s]}</Button>
              ))}
            </SubGroup>
          </NumberedSection>

          {/* 02 · Secondary buttons */}
          <NumberedSection num={2} title="Secondary buttons" description="Gray for cancel · brand-tint for on-brand emphasis" usage={BTN_USAGE[2]}>
            <SubGroup label="Secondary gray">
              {BTN_SIZES.map((s) => (
                <Button key={s} hierarchy="secondary-gray" size={s}>{BTN_SIZE_LABEL[s]}</Button>
              ))}
            </SubGroup>
            <SubGroup label="Secondary color">
              {BTN_SIZES.map((s) => (
                <Button key={s} hierarchy="secondary-color" size={s}>{BTN_SIZE_LABEL[s]}</Button>
              ))}
            </SubGroup>
          </NumberedSection>

          {/* 03 · Tertiary buttons */}
          <NumberedSection num={3} title="Tertiary buttons" description="Ghost · low-emphasis actions" usage={BTN_USAGE[3]}>
            <SubGroup label="Tertiary gray">
              {BTN_SIZES.map((s) => (
                <Button key={s} hierarchy="tertiary-gray" size={s}>{BTN_SIZE_LABEL[s]}</Button>
              ))}
            </SubGroup>
            <SubGroup label="Tertiary color">
              {BTN_SIZES.map((s) => (
                <Button key={s} hierarchy="tertiary-color" size={s}>{BTN_SIZE_LABEL[s]}</Button>
              ))}
            </SubGroup>
          </NumberedSection>

          {/* 04 · Link color */}
          <NumberedSection num={4} title="Link color buttons" description="Inline brand-colored text actions" usage={BTN_USAGE[4]}>
            <BtnRow>
              {BTN_SIZES.map((s) => (
                <Button key={s} hierarchy="link-color" size={s}>{BTN_SIZE_LABEL[s]}</Button>
              ))}
            </BtnRow>
          </NumberedSection>

          {/* 05 · Link gray */}
          <NumberedSection num={5} title="Link gray buttons" description="Inline gray-colored text actions" usage={BTN_USAGE[5]}>
            <BtnRow>
              {BTN_SIZES.map((s) => (
                <Button key={s} hierarchy="link-gray" size={s}>{BTN_SIZE_LABEL[s]}</Button>
              ))}
            </BtnRow>
          </NumberedSection>

          {/* 06 · Icon leading */}
          <NumberedSection num={6} title="Icon leading buttons" description="Icon on the left · label on the right" usage={BTN_USAGE[6]}>
            <SubGroup label="All sizes (primary)">
              {BTN_SIZES.map((s) => (
                <Button key={s} hierarchy="primary" size={s} leadingIcon={<Plus />}>{BTN_SIZE_LABEL[s]}</Button>
              ))}
            </SubGroup>
            <SubGroup label="Across hierarchies">
              <Button hierarchy="primary"         leadingIcon={<Plus />}>New application</Button>
              <Button hierarchy="secondary-gray"  leadingIcon={<Download />}>Export CSV</Button>
              <Button hierarchy="secondary-color" leadingIcon={<Stars01 />}>Run AI Decision</Button>
              <Button hierarchy="tertiary-gray"   leadingIcon={<ArrowRight />}>Continue</Button>
              <Button hierarchy="link-color"      leadingIcon={<Plus />}>Add project</Button>
            </SubGroup>
          </NumberedSection>

          {/* 07 · Icon trailing */}
          <NumberedSection num={7} title="Icon trailing buttons" description="Label on the left · icon on the right" usage={BTN_USAGE[7]}>
            <SubGroup label="All sizes (primary)">
              {BTN_SIZES.map((s) => (
                <Button key={s} hierarchy="primary" size={s} trailingIcon={<ArrowRight />}>{BTN_SIZE_LABEL[s]}</Button>
              ))}
            </SubGroup>
            <SubGroup label="Across hierarchies">
              <Button hierarchy="primary"         trailingIcon={<ArrowRight />}>Continue</Button>
              <Button hierarchy="secondary-gray"  trailingIcon={<ArrowRight />}>Learn more</Button>
              <Button hierarchy="secondary-color" trailingIcon={<ArrowRight />}>See details</Button>
              <Button hierarchy="tertiary-color"  trailingIcon={<ArrowRight />}>Next step</Button>
              <Button hierarchy="link-color"      trailingIcon={<ArrowRight />}>View report</Button>
            </SubGroup>
          </NumberedSection>

          {/* 08 · Icon only */}
          <NumberedSection num={8} title="Icon only buttons" description="Compact · square · matches size across sm → 2xl" usage={BTN_USAGE[8]}>
            <SubGroup label="All sizes (primary)">
              {BTN_SIZES.map((s) => (
                <Button key={s} hierarchy="primary" size={s} iconOnly aria-label="Add"><Plus /></Button>
              ))}
            </SubGroup>
            <SubGroup label="Across hierarchies">
              <Button hierarchy="primary"             iconOnly aria-label="Add"><Plus /></Button>
              <Button hierarchy="secondary-gray"      iconOnly aria-label="Add"><Plus /></Button>
              <Button hierarchy="secondary-color"     iconOnly aria-label="Run"><Stars01 /></Button>
              <Button hierarchy="tertiary-gray"       iconOnly aria-label="Add"><Plus /></Button>
              <Button hierarchy="destructive-primary" iconOnly aria-label="Delete"><Trash /></Button>
            </SubGroup>
          </NumberedSection>

          {/* 09 · Loading */}
          <NumberedSection num={9} title="Loading buttons" description="Spinner replaces the icon · button stays same width" usage={BTN_USAGE[9]}>
            <SubGroup label="All sizes (primary)">
              {BTN_SIZES.map((s) => (
                <Button key={s} hierarchy="primary" size={s} loading>{BTN_SIZE_LABEL[s]}</Button>
              ))}
            </SubGroup>
            <SubGroup label="Across hierarchies">
              <Button hierarchy="primary"             loading>Saving…</Button>
              <Button hierarchy="secondary-gray"      loading>Loading…</Button>
              <Button hierarchy="secondary-color"     loading>Running…</Button>
              <Button hierarchy="tertiary-gray"       loading>Loading…</Button>
              <Button hierarchy="destructive-primary" loading>Deleting…</Button>
            </SubGroup>
          </NumberedSection>

          {/* 10 · Disabled */}
          <NumberedSection num={10} title="Disabled buttons" description="Non-interactive · reduced contrast · same layout as enabled" usage={BTN_USAGE[10]}>
            <SubGroup label="All sizes (primary)">
              {BTN_SIZES.map((s) => (
                <Button key={s} hierarchy="primary" size={s} disabled>{BTN_SIZE_LABEL[s]}</Button>
              ))}
            </SubGroup>
            <SubGroup label="Across hierarchies">
              <Button hierarchy="primary"             disabled>Save</Button>
              <Button hierarchy="secondary-gray"      disabled>Cancel</Button>
              <Button hierarchy="secondary-color"     disabled>Continue</Button>
              <Button hierarchy="tertiary-gray"       disabled>More</Button>
              <Button hierarchy="destructive-primary" disabled>Delete</Button>
              <Button hierarchy="link-color"          disabled>Skip</Button>
            </SubGroup>
          </NumberedSection>

          {/* 11 · Destructive primary */}
          <NumberedSection num={11} title="Destructive primary" description="Filled red · irreversible actions like delete" usage={BTN_USAGE[11]}>
            <BtnRow>
              {BTN_SIZES.map((s) => (
                <Button key={s} hierarchy="destructive-primary" size={s}>Delete</Button>
              ))}
            </BtnRow>
          </NumberedSection>

          {/* 12 · Destructive secondary */}
          <NumberedSection num={12} title="Destructive secondary" description="Outlined red · dangerous but reversible" usage={BTN_USAGE[12]}>
            <BtnRow>
              {BTN_SIZES.map((s) => (
                <Button key={s} hierarchy="destructive-secondary" size={s}>Delete</Button>
              ))}
            </BtnRow>
          </NumberedSection>

          {/* 13 · Destructive tertiary */}
          <NumberedSection num={13} title="Destructive tertiary" description="Ghost red · low-emphasis destructive action" usage={BTN_USAGE[13]}>
            <BtnRow>
              {BTN_SIZES.map((s) => (
                <Button key={s} hierarchy="destructive-tertiary" size={s}>Delete</Button>
              ))}
            </BtnRow>
          </NumberedSection>
      </div>
    </section>
  );
}

function ButtonGroupPage() {
  return (
    <section data-page="button-group">
      <PageHeader title="Button group" subtitle="Joined / segmented buttons — for view toggles, filters, date ranges" />
      <Card>
        <CardContent className="space-y-8">
          <Block title="Text labels">
            <ButtonGroup defaultValue="month">
              <ButtonGroupItem value="day">Day</ButtonGroupItem>
              <ButtonGroupItem value="week">Week</ButtonGroupItem>
              <ButtonGroupItem value="month">Month</ButtonGroupItem>
              <ButtonGroupItem value="quarter">Quarter</ButtonGroupItem>
              <ButtonGroupItem value="year">Year</ButtonGroupItem>
            </ButtonGroup>
          </Block>
          <Block title="With leading icons">
            <ButtonGroup defaultValue="grid">
              <ButtonGroupItem value="grid" leadingIcon={<Grid />}>Grid</ButtonGroupItem>
              <ButtonGroupItem value="list" leadingIcon={<Menu />}>List</ButtonGroupItem>
              <ButtonGroupItem value="chart" leadingIcon={<BarChart />}>Chart</ButtonGroupItem>
            </ButtonGroup>
          </Block>
          <Block title="Icon-only">
            <ButtonGroup defaultValue="grid">
              <ButtonGroupItem value="grid" iconOnly aria-label="Grid"><Grid /></ButtonGroupItem>
              <ButtonGroupItem value="list" iconOnly aria-label="List"><Menu /></ButtonGroupItem>
              <ButtonGroupItem value="chart" iconOnly aria-label="Chart"><BarChart /></ButtonGroupItem>
            </ButtonGroup>
          </Block>
        </CardContent>
      </Card>
    </section>
  );
}

function SocialButtonsPage() {
  return (
    <section data-page="social-buttons">
      <PageHeader title="Social buttons" subtitle="For OAuth sign-in flows · brand icons preserved in color" />
      <Card>
        <CardContent className="space-y-8">
          <Block title="Default mode">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
              {(["google","apple","github","microsoft","x","facebook","linkedin"] as const).map((p) => (
                <SocialButton key={p} provider={p} />
              ))}
            </div>
          </Block>
          <Block title="Brand mode">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
              {(["google","apple","github","microsoft","x","facebook","linkedin"] as const).map((p) => (
                <SocialButton key={p} mode="brand" provider={p} />
              ))}
            </div>
          </Block>
        </CardContent>
      </Card>
    </section>
  );
}

function CloseButtonPage() {
  return (
    <section data-page="close-button">
      <PageHeader title="Close button" subtitle="Dedicated X for modals, drawers, toasts, dismissible badges" />
      <Card>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <CloseButton size="sm" />
            <CloseButton size="md" />
            <CloseButton size="lg" />
            <CloseButton size="xl" />
            <span className="text-sm text-gray-500 mx-3">/</span>
            <CloseButton theme="brand" />
            <CloseButton theme="ghost" />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

/* ============================================================
   Avatars page
   ============================================================ */

const SAMPLE_PEOPLE = [
  { name: "Olivia Reyna",    title: "Product Designer",  src: "https://i.pravatar.cc/120?img=47" },
  { name: "Marcus Chen",     title: "Engineering Lead",  src: "https://i.pravatar.cc/120?img=12" },
  { name: "Priya Sharma",    title: "Data Scientist",    src: "https://i.pravatar.cc/120?img=49" },
  { name: "Liam Anderson",   title: "Customer Success",  src: "https://i.pravatar.cc/120?img=33" },
  { name: "Zara Okonkwo",    title: "Marketing",         src: "https://i.pravatar.cc/120?img=44" },
  { name: "Hiroshi Tanaka",  title: "Backend Engineer",  src: "https://i.pravatar.cc/120?img=68" },
  { name: "Sofia Russo",     title: "QA Engineer",       src: "https://i.pravatar.cc/120?img=45" },
  { name: "Kai Patel",       title: "DevOps",            src: "https://i.pravatar.cc/120?img=14" },
];

const AVATAR_SIZES: ReadonlyArray<{ size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"; px: number }> = [
  { size: "xs",  px: 24 },
  { size: "sm",  px: 32 },
  { size: "md",  px: 40 },
  { size: "lg",  px: 48 },
  { size: "xl",  px: 56 },
  { size: "2xl", px: 64 },
  { size: "3xl", px: 96 },
];

function AvatarsPage() {
  return (
    <section data-page="avatars">
      <PageHeader
        title="Avatars"
        subtitle="7 sizes · 3-tier fallback (image → initials → icon) · status dots · groups · profile"
      />

      {/* Sizes */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sizes</CardTitle>
          <CardDescription>From 24px (xs) compact lists to 96px (3xl) profile hero</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end flex-wrap gap-x-8 gap-y-4">
            {AVATAR_SIZES.map(({ size, px }) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Avatar size={size} src={SAMPLE_PEOPLE[0]!.src} name={SAMPLE_PEOPLE[0]!.name} />
                <div className="text-xs font-mono font-semibold text-gray-800 leading-none">{size}</div>
                <div className="text-xs text-gray-500 leading-none">{px}px</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fallback waterfall */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Fallback waterfall</CardTitle>
          <CardDescription>
            <code className="font-mono text-xs">src</code> loads → image · loading fails OR no src → initials with
            stable color from name hash · no name → user icon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar size="xl" src={SAMPLE_PEOPLE[1]!.src} name={SAMPLE_PEOPLE[1]!.name} />
              <div className="text-xs font-mono text-gray-700">image</div>
              <div className="text-xs text-gray-500">src loads</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar size="xl" name="Olivia Reyna" />
              <div className="text-xs font-mono text-gray-700">initials</div>
              <div className="text-xs text-gray-500">"OR" · stable color</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar size="xl" src="https://broken-url.example/x.jpg" name="Liam Anderson" />
              <div className="text-xs font-mono text-gray-700">image fails</div>
              <div className="text-xs text-gray-500">→ falls to initials</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar size="xl" />
              <div className="text-xs font-mono text-gray-700">anonymous</div>
              <div className="text-xs text-gray-500">no name → icon</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shapes */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Shapes</CardTitle>
          <CardDescription>Circle (default for people) · square (rounded-md, for orgs/teams)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-8">
            <div className="flex flex-col items-center gap-2">
              <Avatar size="xl" src={SAMPLE_PEOPLE[2]!.src} name={SAMPLE_PEOPLE[2]!.name} shape="circle" />
              <div className="text-xs font-mono text-gray-700">circle</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar size="xl" src={SAMPLE_PEOPLE[2]!.src} name={SAMPLE_PEOPLE[2]!.name} shape="square" />
              <div className="text-xs font-mono text-gray-700">square</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar size="xl" name="Acme Inc" shape="square" />
              <div className="text-xs font-mono text-gray-700">square · initials</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status dots */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Status dots</CardTitle>
          <CardDescription>Bottom-right indicator with 2px white ring · sized proportionally</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-8">
            {(["online", "busy", "away", "offline"] as const).map((status) => (
              <div key={status} className="flex flex-col items-center gap-2">
                <Avatar
                  size="xl"
                  src={SAMPLE_PEOPLE[0]!.src}
                  name={SAMPLE_PEOPLE[0]!.name}
                  status={status}
                />
                <div className="text-xs font-mono text-gray-700 capitalize">{status}</div>
              </div>
            ))}
            <div className="flex flex-col items-center gap-2">
              <Avatar size="xl" name="Marcus Chen" status="online" />
              <div className="text-xs font-mono text-gray-700">initials + status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avatar Group */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Avatar group</CardTitle>
          <CardDescription>
            Stack with negative-margin overlap + 2px white ring · automatic "+N" overflow pill
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              4 visible
            </div>
            <AvatarGroup size="md">
              {SAMPLE_PEOPLE.slice(0, 4).map((p) => (
                <Avatar key={p.name} src={p.src} name={p.name} />
              ))}
            </AvatarGroup>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              4 + 4 hidden = +4 pill
            </div>
            <AvatarGroup size="md" max={4} total={8}>
              {SAMPLE_PEOPLE.map((p) => (
                <Avatar key={p.name} src={p.src} name={p.name} />
              ))}
            </AvatarGroup>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Sizes — sm / md / lg
            </div>
            <div className="flex items-center gap-8">
              <AvatarGroup size="sm" max={3} total={6}>
                {SAMPLE_PEOPLE.map((p) => (
                  <Avatar key={p.name} src={p.src} name={p.name} />
                ))}
              </AvatarGroup>
              <AvatarGroup size="md" max={3} total={6}>
                {SAMPLE_PEOPLE.map((p) => (
                  <Avatar key={p.name} src={p.src} name={p.name} />
                ))}
              </AvatarGroup>
              <AvatarGroup size="lg" max={3} total={6}>
                {SAMPLE_PEOPLE.map((p) => (
                  <Avatar key={p.name} src={p.src} name={p.name} />
                ))}
              </AvatarGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AvatarProfile */}
      <Card>
        <CardHeader>
          <CardTitle>Avatar profile</CardTitle>
          <CardDescription>
            Avatar + name + subtitle composition — for menu dropdowns, headers, comment lines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SAMPLE_PEOPLE.slice(0, 4).map((p) => (
              <AvatarProfile
                key={p.name}
                size="md"
                title={p.name}
                subtitle={`${p.title} · ${p.name.toLowerCase().replace(/\s+/g, ".")}@scienaptic.com`}
                avatarProps={{ src: p.src, name: p.name, status: "online" }}
              />
            ))}
          </div>
          <div className="pt-6 border-t border-gray-200">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              Sizes — sm / md / lg
            </div>
            <div className="space-y-4">
              <AvatarProfile
                size="sm"
                title="Olivia Reyna"
                subtitle="Product Designer"
                avatarProps={{ src: SAMPLE_PEOPLE[0]!.src, name: SAMPLE_PEOPLE[0]!.name }}
              />
              <AvatarProfile
                size="md"
                title="Olivia Reyna"
                subtitle="Product Designer · olivia@scienaptic.com"
                avatarProps={{ src: SAMPLE_PEOPLE[0]!.src, name: SAMPLE_PEOPLE[0]!.name }}
              />
              <AvatarProfile
                size="lg"
                title="Olivia Reyna"
                subtitle="Product Designer · olivia@scienaptic.com"
                avatarProps={{ src: SAMPLE_PEOPLE[0]!.src, name: SAMPLE_PEOPLE[0]!.name }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function BadgesPage() {
  const tones = ["gray","brand","success","warning","error","blue","indigo","purple","pink","ai"] as const;
  return (
    <section data-page="badges">
      <PageHeader title="Badges" subtitle="4 variants × 10 tones × 3 sizes" />
      <Card>
        <CardContent className="space-y-6">
          <Block title="Pill · color">
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => <Badge key={t} tone={t} dot>{t}</Badge>)}
            </div>
          </Block>
          <Block title="Pill · outline">
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => <Badge key={t} variant="pill-outline" tone={t}>{t}</Badge>)}
            </div>
          </Block>
          <Block title="Badge · color (squared)">
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => <Badge key={t} variant="badge-color" tone={t}>{t}</Badge>)}
            </div>
          </Block>
          <Block title="Badge · modern (white surface + dot)">
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => <Badge key={t} variant="badge-modern" tone={t} dot>{t}</Badge>)}
            </div>
          </Block>
        </CardContent>
      </Card>
    </section>
  );
}

function BadgeGroupsPage() {
  return (
    <section data-page="badge-groups">
      <PageHeader title="Badge groups" subtitle="Composite badge with leading pill + trailing message" />
      <Card>
        <CardContent className="space-y-6">
          <Block title="Pill · color">
            <div className="flex flex-wrap gap-3">
              <BadgeGroup theme="brand" addonText="New" trailingIcon={<ArrowRight />}>
                AI Decisioning v2 just shipped
              </BadgeGroup>
              <BadgeGroup theme="success" addonText="Live" trailingIcon={<ArrowRight />}>
                Real-time scoring is GA
              </BadgeGroup>
              <BadgeGroup theme="warning" addonText="Action" trailingIcon={<ArrowRight />}>
                7 applications need review
              </BadgeGroup>
              <BadgeGroup theme="ai" addonText="AI" trailingIcon={<ArrowRight />}>
                Try the new fraud model
              </BadgeGroup>
            </div>
          </Block>
          <Block title="Modern · with colored dot">
            <div className="flex flex-wrap gap-3">
              <BadgeGroup variant="modern" theme="brand" addonText="New" dot trailingIcon={<ArrowRight />}>
                Faster decisioning is here
              </BadgeGroup>
              <BadgeGroup variant="modern" theme="success" addonText="Live" dot>
                Auto-scoring 1,932 applications today
              </BadgeGroup>
              <BadgeGroup variant="modern" theme="ai" addonText="AI" dot trailingIcon={<ArrowRight />}>
                Run an AI-powered audit
              </BadgeGroup>
            </div>
          </Block>
        </CardContent>
      </Card>
    </section>
  );
}

function StatusPillsPage() {
  return (
    <section data-page="status-pills">
      <PageHeader title="Status pills" subtitle="Domain-specific for credit / decisioning workflows" />
      <Card>
        <CardContent className="space-y-4">
          <Block title="Modern (Untitled UI signature)">
            <div className="flex flex-wrap gap-3">
              <StatusPill status="approved" />
              <StatusPill status="declined" />
              <StatusPill status="review" />
              <StatusPill status="ai" />
              <StatusPill status="neutral" />
            </div>
          </Block>
          <Block title="Soft">
            <div className="flex flex-wrap gap-3">
              <StatusPill status="approved" variant="soft" />
              <StatusPill status="declined" variant="soft" />
              <StatusPill status="review" variant="soft" />
              <StatusPill status="ai" variant="soft" />
              <StatusPill status="neutral" variant="soft" />
            </div>
          </Block>
        </CardContent>
      </Card>
    </section>
  );
}

function FormsPage() {
  return (
    <section data-page="forms">
      <PageHeader title="Forms & inputs" subtitle="Labels, helper text, validation states, addons" />
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Email" required helper="We'll never share your email." htmlFor="email">
              <Input id="email" type="email" placeholder="you@scienaptic.com" leadingIcon={<Mail />} />
            </Field>
            <Field label="Search" htmlFor="search">
              <Input id="search" placeholder="Search applications..." leadingIcon={<Search />} />
            </Field>
            <Field label="Website" htmlFor="website">
              <Input id="website" leadingAddon="https://" placeholder="scienaptic.com" />
            </Field>
            <Field label="API key" htmlFor="apikey" error="This key has expired.">
              <Input id="apikey" defaultValue="sk_live_••••••••••••" invalid />
            </Field>
            <Field label="Disabled" htmlFor="disabled" helper="Read-only field">
              <Input id="disabled" defaultValue="Locked value" disabled />
            </Field>
            <Field label="Small" htmlFor="small">
              <Input id="small" size="sm" placeholder="Small input" />
            </Field>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function CardsPage() {
  return (
    <section data-page="cards">
      <PageHeader title="Cards" subtitle="Composable surfaces with header / content / footer" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Applications today</CardTitle>
            <CardDescription>Last 24h activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-display-md font-semibold text-gray-900 tracking-tight">2,847</div>
            <div className="text-sm text-success-700 mt-2 font-medium">↑ 12.3% vs yesterday</div>
          </CardContent>
          <CardFooter>
            <Button hierarchy="link-color" trailingIcon={<ArrowRight />}>View all</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>AI Decisioning</CardTitle>
              <Badge tone="ai" variant="badge-modern" dot>Live</Badge>
            </div>
            <CardDescription>Real-time scoring engine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-600">Auto-approved</span><span className="font-medium">1,932</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Sent to review</span><span className="font-medium">487</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Declined</span><span className="font-medium">428</span></div>
          </CardContent>
          <CardFooter>
            <span className="text-xs text-gray-600 font-mono">Accuracy: 98.2%</span>
          </CardFooter>
        </Card>
        <Card interactive>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Click to expand</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center justify-between"><span className="text-sm text-gray-700">App #2891</span><StatusPill status="approved" /></li>
              <li className="flex items-center justify-between"><span className="text-sm text-gray-700">App #2890</span><StatusPill status="review" /></li>
              <li className="flex items-center justify-between"><span className="text-sm text-gray-700">App #2889</span><StatusPill status="declined" /></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/* =========================================================================
   Tooltips
   ========================================================================= */

const TT_USAGE: BtnUsage = {
  doItems: [
    "Explain the purpose of an icon-only button",
    "Reveal a keyboard shortcut or hidden detail",
    "Add a short label to a non-obvious control",
  ],
  dontItems: [
    "Convey critical or must-see information",
    "Hide primary content that should always be visible",
    "On mobile touch devices (there's no reliable hover)",
  ],
};

function TooltipDemoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[80px] flex flex-wrap items-center justify-center gap-6 px-4 py-8 bg-gray-50 border border-gray-100 rounded-lg">
      {children}
    </div>
  );
}

function TooltipsPage() {
  return (
    <section data-page="tooltips">
      <PageHeader
        title="Tooltips"
        subtitle="8 patterns · dark + light · 12 positions (4 sides × 3 alignments) · sm/md/lg · rich mode with title / description / shortcut · Radix-backed"
      />
      <div className="space-y-4">

        {/* 01 · Basic */}
        <NumberedSection num={1} title="Basic tooltip" description='Hover to reveal · single-line hint' usage={TT_USAGE}>
          <TooltipDemoBox>
            <Tooltip content="Save your changes">
              <Button hierarchy="secondary-gray">Save</Button>
            </Tooltip>
            <Tooltip content="Duplicate this record">
              <Button hierarchy="tertiary-gray" iconOnly aria-label="Duplicate"><Plus /></Button>
            </Tooltip>
            <Tooltip content="Learn more about this metric">
              <span className="inline-flex items-center gap-1 text-xs text-gray-600 border-b border-dotted border-gray-400 cursor-help">
                Approval rate <InfoCircle className="h-3.5 w-3.5" />
              </span>
            </Tooltip>
          </TooltipDemoBox>
        </NumberedSection>

        {/* 02 · Positions */}
        <NumberedSection num={2} title="Positions" description="side · top · bottom · left · right">
          <TooltipDemoBox>
            <Tooltip content="Appears on top" side="top">
              <Button hierarchy="secondary-gray" size="sm">Top</Button>
            </Tooltip>
            <Tooltip content="Appears on bottom" side="bottom">
              <Button hierarchy="secondary-gray" size="sm">Bottom</Button>
            </Tooltip>
            <Tooltip content="Appears on left" side="left">
              <Button hierarchy="secondary-gray" size="sm">Left</Button>
            </Tooltip>
            <Tooltip content="Appears on right" side="right">
              <Button hierarchy="secondary-gray" size="sm">Right</Button>
            </Tooltip>
          </TooltipDemoBox>
        </NumberedSection>

        {/* 03 · Alignment — align within a side (start / center / end) */}
        <NumberedSection num={3} title="Alignment" description="Within each side · align=start · center · end · 12 positions total">
          <SubGroup label="Top (align start · center · end)">
            <TooltipDemoBox>
              <Tooltip content="align=start" side="top" align="start">
                <Button hierarchy="secondary-gray" className="min-w-[200px]">A wider top button</Button>
              </Tooltip>
              <Tooltip content="align=center (default)" side="top" align="center">
                <Button hierarchy="secondary-gray" className="min-w-[200px]">A wider top button</Button>
              </Tooltip>
              <Tooltip content="align=end" side="top" align="end">
                <Button hierarchy="secondary-gray" className="min-w-[200px]">A wider top button</Button>
              </Tooltip>
            </TooltipDemoBox>
          </SubGroup>
          <SubGroup label="Bottom (align start · center · end)">
            <TooltipDemoBox>
              <Tooltip content="align=start" side="bottom" align="start">
                <Button hierarchy="secondary-gray" className="min-w-[200px]">A wider bottom button</Button>
              </Tooltip>
              <Tooltip content="align=center" side="bottom" align="center">
                <Button hierarchy="secondary-gray" className="min-w-[200px]">A wider bottom button</Button>
              </Tooltip>
              <Tooltip content="align=end" side="bottom" align="end">
                <Button hierarchy="secondary-gray" className="min-w-[200px]">A wider bottom button</Button>
              </Tooltip>
            </TooltipDemoBox>
          </SubGroup>
          <SubGroup label="Right · Left (align start · center · end)">
            <TooltipDemoBox>
              <Tooltip content="right · start" side="right" align="start">
                <Button hierarchy="secondary-gray" size="lg">Right</Button>
              </Tooltip>
              <Tooltip content="right · end" side="right" align="end">
                <Button hierarchy="secondary-gray" size="lg">Right</Button>
              </Tooltip>
              <Tooltip content="left · start" side="left" align="start">
                <Button hierarchy="secondary-gray" size="lg">Left</Button>
              </Tooltip>
              <Tooltip content="left · end" side="left" align="end">
                <Button hierarchy="secondary-gray" size="lg">Left</Button>
              </Tooltip>
            </TooltipDemoBox>
          </SubGroup>
        </NumberedSection>

        {/* 04 · Dark vs Light */}
        <NumberedSection num={4} title="Variants" description="Dark for content · light for marketing / airy surfaces">
          <SubGroup label="Dark (default)">
            <TooltipDemoBox>
              <Tooltip content="Dark tooltip on gray-900" variant="dark">
                <Button hierarchy="secondary-gray">Hover me</Button>
              </Tooltip>
              <Tooltip content="Also dark" variant="dark">
                <Button hierarchy="primary">Save</Button>
              </Tooltip>
            </TooltipDemoBox>
          </SubGroup>
          <SubGroup label="Light">
            <TooltipDemoBox>
              <Tooltip content="Light tooltip with border + shadow" variant="light">
                <Button hierarchy="secondary-gray">Hover me</Button>
              </Tooltip>
              <Tooltip content="Also light" variant="light">
                <Button hierarchy="primary">Save</Button>
              </Tooltip>
            </TooltipDemoBox>
          </SubGroup>
        </NumberedSection>

        {/* 05 · Sizes */}
        <NumberedSection num={5} title="Sizes" description="sm · compact · md · default · lg · marketing / critical hints">
          <TooltipDemoBox>
            <Tooltip content="Small tooltip" size="sm">
              <Button hierarchy="secondary-gray" size="sm">sm</Button>
            </Tooltip>
            <Tooltip content="Medium tooltip (default)" size="md">
              <Button hierarchy="secondary-gray">md</Button>
            </Tooltip>
            <Tooltip content="Larger tooltip · more padding · body text size" size="lg">
              <Button hierarchy="secondary-gray" size="lg">lg</Button>
            </Tooltip>
          </TooltipDemoBox>
        </NumberedSection>

        {/* 06 · Arrow toggle */}
        <NumberedSection num={6} title="Arrow" description="On by default · turn off for a floating pill look">
          <TooltipDemoBox>
            <Tooltip content="With arrow (default)">
              <Button hierarchy="secondary-gray">With arrow</Button>
            </Tooltip>
            <Tooltip content="No arrow — free-floating" arrow={false}>
              <Button hierarchy="secondary-gray">No arrow</Button>
            </Tooltip>
          </TooltipDemoBox>
        </NumberedSection>

        {/* 07 · Rich — title + description + shortcut */}
        <NumberedSection num={7} title="Rich content" description="Title · optional description · optional shortcut chips">
          <SubGroup label="Title + description">
            <TooltipDemoBox>
              <TooltipRich
                title="Save changes"
                description="Persists to draft. You can still discard before publishing."
              >
                <Button hierarchy="primary">Save</Button>
              </TooltipRich>
              <TooltipRich
                title="Auto-refresh disabled"
                description="Click to enable live updates every 30 seconds."
                variant="light"
              >
                <Button hierarchy="secondary-gray" iconOnly aria-label="Refresh"><ArrowRight /></Button>
              </TooltipRich>
            </TooltipDemoBox>
          </SubGroup>
          <SubGroup label="With keyboard shortcut">
            <TooltipDemoBox>
              <TooltipRich
                title="Save changes"
                shortcut={["⌘", "S"]}
              >
                <Button hierarchy="primary">Save</Button>
              </TooltipRich>
              <TooltipRich
                title="Search"
                description="Find files, actions, or people"
                shortcut={["⌘", "K"]}
              >
                <Button hierarchy="secondary-gray" leadingIcon={<Search />}>Search</Button>
              </TooltipRich>
              <TooltipRich
                title="Delete"
                description="Permanently removes this record. This cannot be undone."
                shortcut={["⇧", "⌫"]}
                variant="light"
              >
                <Button hierarchy="destructive-secondary" iconOnly aria-label="Delete"><Trash /></Button>
              </TooltipRich>
            </TooltipDemoBox>
          </SubGroup>
        </NumberedSection>

        {/* 07 · In-context */}
        <NumberedSection num={8} title="In-context" description="Real UI · icon-only toolbar · metric explainer · disabled action">
          <TooltipDemoBox>
            <div className="inline-flex items-center gap-0.5 p-1 bg-white rounded-md border border-gray-200 shadow-xs">
              <Tooltip content="Bold" size="sm"><Button hierarchy="tertiary-gray" size="sm" iconOnly aria-label="Bold"><span className="text-sm font-bold">B</span></Button></Tooltip>
              <Tooltip content="Italic" size="sm"><Button hierarchy="tertiary-gray" size="sm" iconOnly aria-label="Italic"><span className="text-sm italic">I</span></Button></Tooltip>
              <Tooltip content="Underline" size="sm"><Button hierarchy="tertiary-gray" size="sm" iconOnly aria-label="Underline"><span className="text-sm underline">U</span></Button></Tooltip>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <Tooltip content="Add link" size="sm"><Button hierarchy="tertiary-gray" size="sm" iconOnly aria-label="Add link"><ExternalLink /></Button></Tooltip>
            </div>
            <TooltipRich
              title="Auto-approve threshold"
              description="Applications scoring above this value skip manual review and go straight to funding."
            >
              <span className="inline-flex items-center gap-1 text-sm text-gray-700 border-b border-dotted border-gray-400 cursor-help">
                Threshold <InfoCircle className="h-3.5 w-3.5 text-gray-500" />
              </span>
            </TooltipRich>
            <Tooltip content="You need admin permission to delete this record">
              <span className="inline-block"><Button hierarchy="destructive-secondary" disabled>Delete</Button></span>
            </Tooltip>
          </TooltipDemoBox>
        </NumberedSection>

      </div>
    </section>
  );
}

/* =========================================================================
   Root
   ========================================================================= */

export function Showcase() {
  const [page, setPage] = usePageRoute();
  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={0}>
      <div className="min-h-screen bg-white">
        {/* Top header removed — brand identity now lives in the sidebar. */}

        <div className="flex">
          <Sidebar active={page} onChange={setPage} />
          <main className="flex-1 px-10 py-10 min-w-0">
            {page === "overview" && <OverviewPage go={setPage} />}
            {page === "colors" && <ColorsPage />}
            {page === "shadows-blurs" && <ShadowsBlursPage />}
            {page === "spacing-grids" && <SpacingGridsPage />}
            {page === "typography" && <TypographyPage />}
            {page === "icons" && <IconsPage />}
            {page === "buttons" && <ButtonsPage />}
            {page === "button-group" && <ButtonGroupPage />}
            {page === "social-buttons" && <SocialButtonsPage />}
            {page === "close-button" && <CloseButtonPage />}
            {page === "avatars" && <AvatarsPage />}
            {page === "badges" && <BadgesPage />}
            {page === "badge-groups" && <BadgeGroupsPage />}
            {page === "status-pills" && <StatusPillsPage />}
            {page === "forms" && <FormsPage />}
            {page === "cards" && <CardsPage />}
            {page === "tooltips" && <TooltipsPage />}
          </main>
        </div>

        <footer className="border-t border-gray-200 py-6 bg-white">
          <div className="max-w-[1600px] mx-auto px-6 text-sm text-gray-600 flex items-center justify-between">
            <span>PULSE Design System · v0.2.0 · Powered by scienaptic.ai</span>
            <span className="font-mono text-xs text-gray-500">React · TS · Tailwind · Radix</span>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
