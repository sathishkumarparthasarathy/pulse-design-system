#!/usr/bin/env node
/**
 * PULSE — design-system producer.
 *
 * Rebuilds every file the PULSE design system artifact holds, from this
 * repository, into design-system/dist/project/. Run it after changing
 * anything under src/tokens/, src/components/ or src/icons/:
 *
 *   npm --prefix design-system install
 *   npm --prefix design-system run build
 *
 * Then, in Claude, open the PULSE design system and say "re-sync from the
 * repo" — it reads design-system/dist/project/ and publishes it as-is,
 * instead of re-deriving everything.
 *
 * Nothing here publishes on its own: the artifact is written through a
 * Claude session, not an API token.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const DIST = path.join(HERE, "dist");
const OUT = path.join(DIST, "project");

const COMPONENTS = [
  "Button", "ButtonGroup", "SocialButton", "CloseButton",
  "Badge", "BadgeGroup", "StatusPill", "Input", "Card",
  "Avatar", "Tooltip",
];

const git = (...args) =>
  execFileSync("git", args, { cwd: REPO, encoding: "utf8" }).trim();

const log = (...a) => console.log("·", ...a);

/* ── 0 · clean ─────────────────────────────────────────────────── */

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "components"), { recursive: true });

let ref = "unknown";
try {
  ref = `${git("rev-parse", "--abbrev-ref", "HEAD")}@${git("rev-parse", "--short", "HEAD")}`;
} catch {
  log("not a git checkout — ref recorded as 'unknown'");
}
const synced = new Date().toISOString().slice(0, 10);

/* ── 1 · tokens.json ───────────────────────────────────────────── */

process.env.DS_REF = ref;
process.env.DS_SYNCED = synced;
const tokensOut = path.join(OUT, "tokens.json");
execFileSync(process.execPath, [path.join(HERE, "src/tokens.mjs"), tokensOut], {
  cwd: REPO,
  stdio: "inherit",
  env: process.env,
});

/* ── 2 · components/bundle.js ──────────────────────────────────── */

const globals = {
  react: "module.exports = globalThis.React;",
  "react-dom": "module.exports = globalThis.ReactDOM;",
  "react-dom/client": "module.exports = globalThis.ReactDOM;",
  "react/jsx-runtime": `const R = globalThis.React;
const jsx = (type, props, key) => {
  const { children, ...rest } = props || {};
  if (key !== undefined) rest.key = key;
  return children === undefined
    ? R.createElement(type, rest)
    : Array.isArray(children)
      ? R.createElement(type, rest, ...children)
      : R.createElement(type, rest, children);
};
module.exports = { Fragment: R.Fragment, jsx, jsxs: jsx, jsxDEV: jsx };`,
};
globals["react/jsx-dev-runtime"] = globals["react/jsx-runtime"];

const pageGlobals = {
  name: "page-globals",
  setup(build) {
    const filter = new RegExp(
      `^(${Object.keys(globals).map((n) => n.replace(/\//g, "\\/")).join("|")})$`
    );
    build.onResolve({ filter }, (a) => ({ path: a.path, namespace: "page-globals" }));
    build.onLoad({ filter: /.*/, namespace: "page-globals" }, (a) => ({
      contents: globals[a.path],
      loader: "js",
    }));
  },
};

const built = await esbuild.build({
  entryPoints: [path.join(HERE, "src/entry.ts")],
  bundle: true,
  minify: true,
  format: "iife",
  globalName: "__PULSE__",
  target: ["es2019"],
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [pageGlobals],
  alias: { "@": path.join(REPO, "src") },
  loader: { ".js": "jsx" },
  write: false,
  legalComments: "none",
  footer: { js: "window.PULSE = __PULSE__;" },
});

const header =
  "/* @ds-bundle: " +
  JSON.stringify({
    format: 4,
    namespace: "PULSE",
    components: COMPONENTS.map((name) => ({ name })),
  }) +
  " */\n";

// Consumers inline the bundle into a <script>; neutralise anything that
// would close or escape that element.
const js = built.outputFiles[0].text
  .replace(/<\/script/gi, "<\\/script")
  .replace(/<!--/g, "<\\!--");

fs.writeFileSync(path.join(OUT, "components/bundle.js"), header + js);
log("bundle.js", (header.length + js.length) + " bytes");

/* ── 3 · previews (before the stylesheet — Tailwind scans them) ── */

for (const dir of fs.readdirSync(path.join(HERE, "previews"))) {
  const src = path.join(HERE, "previews", dir, "preview.html");
  if (!fs.existsSync(src)) continue;
  fs.mkdirSync(path.join(OUT, "components", dir), { recursive: true });
  fs.copyFileSync(src, path.join(OUT, "components", dir, "preview.html"));
}
log("previews copied");

/* ── 4 · components/bundle.css ─────────────────────────────────── */

execFileSync(
  path.join(HERE, "node_modules/.bin/tailwindcss"),
  [
    "-c", path.join(HERE, "tailwind.config.ts"),
    "-i", path.join(HERE, "src/bundle.css"),
    "-o", path.join(OUT, "components/bundle.css"),
    "--minify",
  ],
  { cwd: REPO, stdio: "inherit" }
);

/* ── 5 · docs ──────────────────────────────────────────────────── */

const copyTree = (from, to) => {
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const f = path.join(from, e.name);
    const t = path.join(to, e.name);
    if (e.isDirectory()) {
      fs.mkdirSync(t, { recursive: true });
      copyTree(f, t);
    } else {
      fs.mkdirSync(path.dirname(t), { recursive: true });
      fs.copyFileSync(f, t);
    }
  }
};

fs.copyFileSync(path.join(HERE, "docs/README.md"), path.join(OUT, "README.md"));
fs.copyFileSync(path.join(HERE, "docs/index.d.ts"), path.join(OUT, "components/index.d.ts"));
copyTree(path.join(HERE, "docs/components"), path.join(OUT, "components"));
copyTree(path.join(HERE, "docs/assets"), path.join(OUT, "assets"));
log("docs copied");

/* ── 6 · the index ─────────────────────────────────────────────── */

const index = JSON.parse(fs.readFileSync(path.join(HERE, "src/index.json"), "utf8"));
index.lastChange = {
  by: process.env.DS_BY || "CI",
  at: new Date().toISOString(),
  via: `CI · sathishkumarparthasarathy/pulse-design-system@${ref.split("@").pop()}`,
  note: `Rebuilt by design-system/build.mjs from ${ref}.`,
};
fs.writeFileSync(path.join(OUT, "design-system.json"), JSON.stringify(index, null, 2) + "\n");

/* ── done ──────────────────────────────────────────────────────── */

const count = (function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).reduce(
    (n, e) => n + (e.isDirectory() ? walk(path.join(d, e.name)) : 1), 0);
})(OUT);

console.log(`\nBuilt ${count} files into design-system/dist/project/ from ${ref}.`);
console.log("The asset uploads (logos, OAuth marks) are not rebuilt — they are");
console.log("already in the artifact's store and the index points at them by id.");
console.log("\nNext: in Claude, open the PULSE design system and say \"re-sync from the repo\".");
