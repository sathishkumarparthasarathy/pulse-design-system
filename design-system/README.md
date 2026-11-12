# design-system — the PULSE artifact producer

Rebuilds every file the **PULSE design system** artifact on claude.ai holds, straight from this repository, into `design-system/dist/project/`.

Change a token or a component, run one command, and the design system Claude reads is current — without anyone re-deriving 368 colour tokens by hand.

```bash
npm install                              # once, at the repo root
npm --prefix design-system install       # once, here
npm --prefix design-system run build     # after any change to src/
npm --prefix design-system run check     # optional: render every preview headless
```

Then, in Claude: open the PULSE design system and say **"re-sync from the repo"**. It reads `design-system/dist/project/` and publishes those files as they are.

> **The build does not publish.** Writing to the artifact happens through a Claude session, not an API token — so CI can keep `dist/` current, but the last step is always a person (or a scheduled Claude task) saying "re-sync".

## What it builds

| Output | From |
|---|---|
| `dist/project/tokens.json` | `src/tokens/primitives/*.ts` + the `:root` / `.dark` blocks in `src/styles/globals.css` |
| `dist/project/components/bundle.js` | `src/components/` + `src/icons/`, bundled as one IIFE assigning `window.PULSE` |
| `dist/project/components/bundle.css` | `src/bundle.css` through this folder's `tailwind.config.ts` (the repo's theme, scanning the previews) |
| `dist/project/components/<Comp>/preview.html` | `design-system/previews/` |
| `dist/project/components/<Comp>/README.md`, `README.md`, `index.d.ts` | `design-system/docs/` |
| `dist/project/design-system.json` | `design-system/src/index.json`, stamped with the current commit |

## What it does not build

- **The asset uploads** — the two logos and three OAuth marks live in the artifact's own store and the index points at them by id. Replace artwork by asking Claude to upload the new file; the ids in `src/index.json` change then, so copy them back here.
- **`tokens.css`** — the artifact page compiles that from `tokens.json` itself. `src/rendercheck.mjs` compiles its own copy the same way, so the headless render matches what you see on the page.

## Editing

- **A token value** → change it in `src/tokens/primitives/`, rebuild. Never edit `dist/`.
- **A token's usage note** → `design-system/src/tokens.mjs`. The notes are the only prose in `tokens.json`, and they are what another agent reads to use the token correctly.
- **A preview** → `design-system/previews/<Comp>/preview.html`. Line 1 must stay the `<!-- @dsCard … -->` marker. Previews run on the artifact's origin with `tokens.css`, `bundle.css`, React 18 and the bundle preloaded — no network beyond Google Fonts.
- **Guidelines or the brand book** → `design-system/docs/`.

Run `npm --prefix design-system run check` after any preview change. It renders all 14 cards in both themes and fails on a blank, errored or unstyled one.

## CI

`.github/workflows/design-system.yml` builds and render-checks on every push to `main` that touches `src/` or this folder, and uploads `dist/` as a workflow artifact. It does not commit and it does not publish — it tells you whether a change broke a card.
