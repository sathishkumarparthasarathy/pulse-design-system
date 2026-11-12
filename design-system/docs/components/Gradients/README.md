The 24 gradient compositions, each a complete CSS `background-image` string.

They are not in `tokens.json` — the token format takes single values, and a mesh gradient is four stacked radial functions. The card shows each one with its exact CSS, and Tailwind exposes them as `bg-{name}` through `backgroundImage` in `tailwind.config.ts`.

## When to use

Sparingly, and never behind text that has to be read. Gradients are for marketing surfaces, empty states, illustration grounds and decorative blurs — not for product chrome.

- **Brand** (`brand-vertical`, `brand-horizontal`, `brand-diagonal`, `brand-soft`, `brand-deep`, `brand-fade`) — single-hue brand progressions. `brand-vertical` is the one the `primary-gradient` Button uses.
- **Warm multi-colour** (`sunset`, `sunrise`, `ember`, `peach`) — hero backgrounds that stay on the brand's temperature.
- **Cool multi-colour** (`aurora`, `ocean`, `twilight`, `midnight`) — the AI and data-viz side. `midnight` is the only dark one.
- **Mesh** (`mesh-warm`, `mesh-cool`, `mesh-mono`) — soft four-corner fields for a full-bleed section ground.
- **Radial** (`spot-brand`, `spot-cool`, `halo-brand`) — a spotlight at the top of a card or hero, or a halo behind a mark.
- **Fades** (`bg-warm`, `bg-cool`, `bg-neutral`) — a tint settling into white down the page. The safest of the set.
- **Conic** (`conic-brand`, `conic-warm`) — loaders, decorative discs, avatar rings.

## Rules

- One gradient per screen. Two compete and neither reads as brand.
- Text over a gradient goes on a solid panel, not straight on the gradient. None of these clear 4.5:1 across their whole span.
- Don't recolour a gradient by hand. If the stop you want doesn't exist, it isn't in the system yet.
- `brand-fade` and the three `bg-*` fades end transparent or white — they need a white ground beneath them.
