# Icons

The three OAuth provider marks the repository ships as standalone files, from `figma-export/icons/`. They are the Figma handoff copies of the inline components in `src/icons/brand.tsx`.

- **`GoogleColor.svg`** — four-colour Google G, 24×24.
- **`AppleColor.svg`** — Apple mark, 24×24.
- **`GitHubColor.svg`** — GitHub mark, 24×24.

All three are full-colour: the inks are fixed in the file and do not follow `currentColor`. That is a provider requirement — the marks must not be recoloured, monochromed, dimmed or placed on a ground that swallows them. Use them at 20px inside a `SocialButton` and 24px standalone.

The other four providers in `SocialButton` (X, Facebook, Microsoft, LinkedIn) exist only as inline React components in `src/icons/brand.tsx`; the repository ships no SVG files for them.

The product icon set is not here — it is Lucide, stroke-only and `currentColor`, re-exported from `@/icons` and shown on the Icons card.
