# Using PULSE in your project

> A practical guide for engineers — get a PULSE component into your app in ~10 minutes.

---

## Approach: copy components into your project (shadcn-style)

Instead of installing PULSE as an npm package, you **copy the source files into your project** and own the code from there. You get full control to customize without waiting for upstream PRs.

This is the same pattern [shadcn/ui](https://ui.shadcn.com) popularized — the design system is a starting point, not a black box.

> A future v1.0 will ship an installable npm package (`@scienaptic/pulse`) for projects that want versioned updates. For now: copy.

---

## Prerequisites in your project

| What you need | Why |
|---|---|
| **React 18+** | Components use modern hooks + `forwardRef` |
| **Tailwind CSS 3.4+** | Components use Tailwind classes for styling |
| **TypeScript** (recommended) | Components are written in TS; works in JS too but you lose autocomplete |
| **Node 18+** | For your project's dev server / build |

If your project already uses Vite + React + Tailwind, you're set.

---

## Setup — one time per project (~10 min)

### 1. Install the runtime dependencies

```bash
# pick your package manager
npm install  lucide-react class-variance-authority clsx tailwind-merge \
             @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-popover \
             @radix-ui/react-tooltip @radix-ui/react-tabs @radix-ui/react-select \
             @radix-ui/react-dropdown-menu

# or pnpm / yarn — same package names
```

| Package | What it does |
|---|---|
| `lucide-react` | The icon library (1,982 icons) |
| `class-variance-authority` (`cva`) | Type-safe variant API for components |
| `clsx` + `tailwind-merge` | Helper for combining Tailwind classes safely |
| `@radix-ui/*` | Unstyled accessible primitives (used by `Button.asChild`, future `Dialog`, `Tooltip`, etc.) |

### 2. Copy source folders into your project

From the PULSE repo, copy these into your project:

```
PULSE repo                 →  Your project
─────────────────────────  →  ─────────────────────────
src/tokens/                →  src/tokens/
src/components/            →  src/components/ui/        (shadcn convention)
src/icons/                 →  src/icons/
src/lib/cn.ts              →  src/lib/cn.ts
```

> If you cloned the PULSE repo locally:
> ```bash
> cp -r ~/pulse-design-system/src/tokens     your-project/src/
> cp -r ~/pulse-design-system/src/components your-project/src/ui
> cp -r ~/pulse-design-system/src/icons      your-project/src/
> cp    ~/pulse-design-system/src/lib/cn.ts  your-project/src/lib/
> ```

### 3. Wire the design tokens into Tailwind

Open your project's `tailwind.config.ts` (or `.js`) and merge in PULSE's tokens.

Easiest path — copy `tailwind.config.ts` from the PULSE repo verbatim if you don't have one yet. Otherwise, add the relevant pieces:

```ts
import type { Config } from "tailwindcss";
import { colors } from "./src/tokens/colors";
import { typography } from "./src/tokens/typography";
import { radius, shadow, blur } from "./src/tokens/spacing";
import { gradients } from "./src/tokens/gradients";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize as never,
      fontWeight: typography.fontWeight,
      borderRadius: radius,
      boxShadow: shadow,
      blur,
      backdropBlur: blur,
      backgroundImage: gradients as unknown as Record<string, string>,
    },
  },
} satisfies Config;
```

### 4. (Optional) Set up the `@/` alias

If you used `@/components` in your imports above, configure the alias in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

And in `vite.config.ts`:

```ts
import path from "path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```

---

## Using components — examples

### Button

```tsx
import { Button } from "@/components/ui";
import { Plus, ArrowRight } from "@/icons";

<Button hierarchy="primary">Save changes</Button>
<Button hierarchy="secondary-gray" leadingIcon={<Plus />}>New project</Button>
<Button hierarchy="destructive-primary" size="lg">Delete account</Button>
<Button hierarchy="tertiary-color" trailingIcon={<ArrowRight />}>Learn more</Button>
<Button loading>Saving…</Button>
```

**Hierarchies:** `primary` · `secondary-gray` · `secondary-color` · `tertiary-gray` · `tertiary-color` · `link-gray` · `link-color` · `destructive-primary` · `destructive-secondary` · `destructive-tertiary`

**Sizes:** `sm` · `md` *(default)* · `lg` · `xl` · `2xl`

### Avatar

```tsx
import { Avatar, AvatarGroup, AvatarProfile } from "@/components/ui";

// Image with initials fallback
<Avatar src="https://..." name="Jane Doe" size="md" status="online" />

// No image → initials with stable color from name hash
<Avatar name="Jane Doe" />

// No name → user icon fallback
<Avatar />

// Stack of avatars with overflow pill
<AvatarGroup max={4} total={8}>
  {people.map(p => <Avatar key={p.id} src={p.src} name={p.name} />)}
</AvatarGroup>

// Avatar + name + subtitle
<AvatarProfile
  title="Jane Doe"
  subtitle="Product Designer"
  avatarProps={{ src, name: "Jane Doe", status: "online" }}
/>
```

### Badge & Status pill

```tsx
import { Badge, StatusPill } from "@/components/ui";

<Badge tone="success" dot>Active</Badge>
<Badge tone="brand" variant="pill-outline">New</Badge>
<Badge tone="error" variant="badge-modern">3 issues</Badge>

// Domain-specific (credit / decisioning)
<StatusPill status="approved" />
<StatusPill status="ai" />          // for AI/ML decisions
<StatusPill status="review" />
```

### Input + Field

```tsx
import { Input, Field } from "@/components/ui";
import { Mail } from "@/icons";

<Field label="Work email" required helper="We'll send a magic link">
  <Input type="email" leadingIcon={<Mail />} placeholder="you@scienaptic.ai" />
</Field>

<Field label="Domain" invalid error="That domain is taken">
  <Input leadingAddon="https://" trailingAddon=".scienaptic.ai" />
</Field>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui";
import { Button } from "@/components/ui";

<Card>
  <CardHeader>
    <CardTitle>Risk score</CardTitle>
    <CardDescription>Based on the last 90 days</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="text-display-md font-bold text-success-700">724</div>
    <div className="text-sm text-gray-600">Low risk</div>
  </CardContent>
  <CardFooter>
    <Button hierarchy="tertiary-gray" size="sm">View breakdown</Button>
  </CardFooter>
</Card>
```

### Icons

Use any of 1,982 Lucide icons via the centralized `@/icons` module — our semantic aliases take priority:

```tsx
import { ArrowRight, Mail, Search, Trash, AlertCircle, Stars01 } from "@/icons";
// or pick any direct Lucide name not in our alias list
import { Anchor, Banana, Pizza } from "@/icons";

<Mail className="h-5 w-5 text-gray-600" />
<Stars01 className="h-5 w-5 text-brand-600" />       // AI/decisioning context
```

---

## Customizing — the token system

Every component reads from `src/tokens/`. To change anything globally, edit the token:

| Want to change… | Edit… |
|---|---|
| Brand color | `src/tokens/colors.ts` → `brand` scale |
| Font family / sizes | `src/tokens/typography.ts` |
| Radius defaults (rounded buttons, cards) | `src/tokens/spacing.ts` → `radius` |
| Shadow stack | `src/tokens/spacing.ts` → `shadow` |
| Gradient palette | `src/tokens/gradients.ts` |

Tailwind re-reads tokens on next dev-server restart. Components pick up the changes automatically — no per-component edits required.

---

## What's there today (v0.2.0)

| Family | Components |
|---|---|
| **Action** | `Button`, `ButtonGroup`, `SocialButton`, `CloseButton` |
| **Identity** | `Avatar`, `AvatarGroup`, `AvatarProfile` |
| **Status** | `Badge`, `BadgeGroup`, `StatusPill` |
| **Form** | `Input`, `Field`, `Label`, `HelperText` |
| **Surface** | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |

See `CHANGELOG.md` for what's coming (Switch, Checkbox, Radio, Tooltip, Select, DatePicker, DataTable, Modal, Toast, …).

---

## FAQ

### Is this production-ready?
**v0.2.0 — early access.** Use in non-critical UIs first. The API surface is stable but breaking changes are possible until v1.0. The CHANGELOG flags any breakages.

### Do I have to use Tailwind?
**Yes**, for now. Components are styled with Tailwind utility classes. If your project doesn't use Tailwind, talk to Sathish — a token-only CSS variable build is possible but not prioritized yet.

### How do I report a bug or request a component?
Open an issue on the GitHub repo: `github.com/sathishkumarparthasarathy/pulse-design-system/issues`. Tag with `bug`, `feature`, or `question`.

### Can I modify a component locally?
**Yes — that's the point of the copy-in pattern.** The components live in *your* project now. Modify freely. If your changes would be useful for everyone, open a PR back to the PULSE repo.

### How do I stay up to date if the system improves?
Watch the repo (top-right of the GitHub page → "Watch" → "All Activity"). When new components land, you can `cp` them in. The CHANGELOG documents every release.

### Why Lucide icons instead of [Font Awesome / Material / our own set]?
- MIT-licensed (free, no attribution required)
- 1,982 icons (vs ~250 in most paid sets)
- Tree-shaken — only icons you actually use ship in your bundle (0 bytes if unused)
- Same library, same names in code and in the Lucide Figma plugin → designers and engineers see identical icons

### What about accessibility?
Components use Radix UI primitives where possible (which are WAI-ARIA compliant). Manual audits with axe-core are on the roadmap (Phase 8).

### How does this stay in sync with Figma?
A Figma export bundle lives in `figma-export/` — tokens.json (Tokens Studio import) + a plugin script that scaffolds components in any Figma file. See `figma-export/FIGMA_SETUP.md` for the 20-min setup.

---

## Quick links

- **Live preview:** <https://pulse-design-system-cq9rcz2cw-pulse-design-system.vercel.app> — browse what's there
- **Source code:** <https://github.com/sathishkumarparthasarathy/pulse-design-system>
- **What's built + roadmap:** [`CHANGELOG.md`](./CHANGELOG.md)
- **Figma setup:** [`figma-export/FIGMA_SETUP.md`](./figma-export/FIGMA_SETUP.md)
- **Sharing / deploy guide:** [`SHARING.md`](./SHARING.md)

---

**Need help?** Ping Sathish on Slack or open a `question`-tagged issue on the repo.
