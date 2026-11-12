The icon set — Lucide (MIT), stroke-only and `currentColor`, re-exported under 54 stable semantic names.

## When to use

Import from `@/icons`, never from `lucide-react` directly. The aliases are the contract: `XClose`, `Trash`, `Edit`, `Loading`, `AlertCircle`, `Stars01` and the rest keep working when Lucide renames or deprecates the underlying glyph, which it has done before.

```tsx
import { ArrowRight, Stars01 } from "@/icons";   // the 54 aliases + all of Lucide
import { Icon } from "@/icons";                   // data-driven

<ArrowRight className="h-5 w-5" />
<Icon name="TrendUp" className="h-4 w-4" />
```

## What the consumer provides

A size class and nothing else — the icon takes its colour from the text around it. `icons` is a name-to-component registry for config- or CMS-driven rendering; `<Icon name="…" />` wraps it.

## Rules

- 16px inside `text-xs`/`text-sm`, 20px inside a button or input, 24px standalone. Components that take an icon slot size it themselves — pass `<Mail />` bare.
- Never set a fill or a hard-coded stroke colour. If an icon needs to stand out, change the text colour of its container.
- Any of the ~1,982 Lucide icons is available through the wildcard re-export, tree-shaken to zero if unused. The explicit aliases win over Lucide's own names where they collide.
- The OAuth marks in `src/icons/brand.tsx` are the exception: full-colour, fixed, and used only through `SocialButton`.
- This card shows the 54 aliases, which is what the bundle on this page carries. The wildcard is not in the bundle.
