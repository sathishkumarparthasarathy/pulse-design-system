# Sharing PULSE with the engineering team

Three ways to share — from zero-effort to fully-hosted. Pick whichever fits.

---

## Option 1 · Push to GitHub, team clones (recommended for code review)

**Best when:** engineers want to read the code, file issues, and follow progress over time.

### Setup (one-time)

```bash
cd ~/design-system

# Already done if you ran the init step — otherwise:
git init -b main
git add .
git commit -m "Initial commit · PULSE Design System v0.2.0"

# Create the remote (replace with your org):
gh repo create scienaptic/pulse-design-system --private --source=. --remote=origin --push

# OR if you're not using the gh CLI:
# 1. Create an empty repo at github.com/scienaptic/pulse-design-system
# 2. git remote add origin git@github.com:scienaptic/pulse-design-system.git
# 3. git push -u origin main
```

### What team members do
```bash
git clone git@github.com:scienaptic/pulse-design-system.git
cd pulse-design-system

# View the static preview (zero dependencies — Python ships with macOS):
python3 -m http.server 5174 --directory preview
# → open http://localhost:5174

# Or run the full React Showcase:
npm install && npm run dev
```

---

## Option 2 · Deploy the static preview publicly (recommended for broad sharing)

**Best when:** designers, PMs, leadership want to browse without installing anything. Get a public URL in 2 minutes.

### A · Vercel (drag-and-drop, no account-link needed)
1. Go to <https://vercel.com/new>
2. Drag the `preview/` folder onto the page
3. Click "Deploy"
4. You get a URL like `https://pulse-design-system-abc.vercel.app` — share with anyone

### B · Netlify (drag-and-drop)
1. Go to <https://app.netlify.com/drop>
2. Drag the `preview/` folder onto the drop zone
3. Same instant public URL

### C · GitHub Pages (tied to the repo from Option 1)
After pushing to GitHub:
1. Settings → Pages → Source: "Deploy from a branch"
2. Branch: `main`, Folder: `/preview`
3. Save → wait ~1 minute
4. URL becomes `https://scienaptic.github.io/pulse-design-system/`

### D · Cloudflare Pages
1. <https://pages.cloudflare.com/>
2. Connect your GitHub repo
3. Build settings: leave empty, "Build output directory" = `preview`
4. Same instant deploy

---

## Option 3 · Send a zip (lowest friction, no infra)

**Best when:** sharing with one or two people, one-off review.

```bash
cd ~/design-system
zip -r ../pulse-design-system-v0.2.0.zip . -x "*.DS_Store" "node_modules/*" ".git/*"
# → produces ~/pulse-design-system-v0.2.0.zip
```

Send the zip via email / Slack / Drive. Team unzips and runs `python3 -m http.server 5174 --directory preview`.

---

## What the team will see

Three artifacts make this design system tangible:

| Surface | Where | What it is |
|---------|-------|------------|
| **Static preview** | `preview/index.html` | All 16 pages (foundations + components) in one self-contained HTML file. Zero dependencies. |
| **React Showcase** | `src/Showcase.tsx` + `src/components/*` | The actual React component source code. Requires Node 18+ to run. |
| **Figma export bundle** | `figma-export/` | Tokens Studio JSON · brand SVGs · Figma plugin to scaffold components inside any Figma file |

**Suggested order to walk through:** `README.md` → static preview at localhost → `CHANGELOG.md` → `src/components/Button.tsx` (canonical example) → `figma-export/FIGMA_SETUP.md` if they want to mirror to Figma.

---

## Live preview URL (fill in after deploy)

> **Production preview:** _https://__________________________________________________________________ _ (fill in after Option 2 deploy)

---

## Inviting feedback

Once the team has access, the lightweight feedback channels:

| Type | Where |
|------|-------|
| Component bugs / missing features | GitHub Issues on the repo |
| Token / color disagreements | Comment on the deployed Colors page (or open an issue tagged `tokens`) |
| Big design-direction questions | Async Slack thread / a doc tagged `pulse` |
| "Why did you choose X?" | Point them at `CHANGELOG.md` § "Key inflection points" |

---

## Maintenance after handoff

- **Updating tokens or components:** edit `src/tokens/` or `src/components/`, commit, push. The preview at `preview/index.html` updates separately — see `CHANGELOG.md` for the dual-deliverable pattern.
- **Adding a new component:** follow the steps in `README.md` § "Add a new component"
- **Re-deploying after changes:** if using Vercel/Netlify drag-drop, drag the updated `preview/` folder again. If using GitHub Pages, every push to `main` auto-redeploys.

---

**Quick links:**
- `README.md` — overview + inventory
- `CHANGELOG.md` — chronological progress
- `figma-export/FIGMA_SETUP.md` — Figma integration steps
