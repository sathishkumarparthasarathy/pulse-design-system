#!/usr/bin/env node
/**
 * Renders every built preview the way the artifact's frame does — React and
 * ReactDOM 18 as globals, tokens.css, bundle.css and bundle.js preloaded —
 * in both themes, and reports blank, errored or unstyled cards.
 *
 *   npm --prefix design-system run check
 *
 * Screenshots land in design-system/dist/shots/. Exits non-zero on any
 * problem, so it works as a CI gate.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PRODUCER = path.resolve(HERE, "..");
const DIST = path.resolve(PRODUCER, process.argv[2] ?? "dist");
const OUT = path.join(DIST, "project");
const SHOTS = path.join(DIST, "shots");
const COMP = path.join(OUT, "components");

if (!fs.existsSync(COMP)) {
  console.error("No build found. Run `npm --prefix design-system run build` first.");
  process.exit(1);
}
fs.mkdirSync(SHOTS, { recursive: true });

/* React UMD comes from the repository's own node_modules — the sandboxed
   frame has no network, so nothing is fetched. */
const umd = (p) => {
  const f = path.join(PRODUCER, "..", "node_modules", p);
  if (!fs.existsSync(f)) {
    console.error(`Missing ${p} — run \`npm install\` at the repo root first.`);
    process.exit(1);
  }
  return fs.readFileSync(f, "utf8");
};
const reactJs = umd("react/umd/react.production.min.js");
const reactDomJs = umd("react-dom/umd/react-dom.production.min.js");

/* tokens.css as the page compiles it from tokens.json. */
const tokensCss = compileTokensCss(JSON.parse(fs.readFileSync(path.join(OUT, "tokens.json"), "utf8")));
const bundleCss = fs.readFileSync(path.join(COMP, "bundle.css"), "utf8");
const bundleJs = fs.readFileSync(path.join(COMP, "bundle.js"), "utf8");

const names = fs
  .readdirSync(COMP, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(COMP, d.name, "preview.html")))
  .map((d) => d.name)
  .sort();

const browser = await chromium.launch();
const results = [];

for (const theme of ["light", "dark"]) {
  for (const name of names) {
    const src = fs.readFileSync(path.join(COMP, name, "preview.html"), "utf8");
    const body = (/<body[^>]*>([\s\S]*)<\/body>/i.exec(src) ?? [, src])[1];
    const head = (/<head[^>]*>([\s\S]*?)<\/head>/i.exec(src) ?? [, ""])[1]
      .replace(/<title>[\s\S]*?<\/title>/i, "");

    const page = await browser.newPage({ viewport: { width: 960, height: 700 } });
    const errors = [];
    const ignore = /fonts\.googleapis|ERR_TUNNEL|ERR_NAME_NOT_RESOLVED|ERR_INTERNET/;
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => {
      if (m.type() === "error" && !ignore.test(m.text())) errors.push(m.text());
    });

    await page.setContent(
      `<!doctype html><html data-theme="${theme}"><head><meta charset="utf-8">` +
      `<style>${tokensCss}</style><style>${bundleCss}</style>${head}` +
      `<script>${reactJs}<\/script><script>${reactDomJs}<\/script>` +
      `<script>${bundleJs}<\/script></head><body>${body}</body></html>`,
      { waitUntil: "load" }
    );
    await page.waitForTimeout(900);

    const s = await page.evaluate(() => ({
      textLen: (document.body.innerText || "").trim().length,
      els: document.body.querySelectorAll("*").length,
      svgs: document.body.querySelectorAll("svg").length,
      h: document.body.scrollHeight,
    }));

    await page.screenshot({ path: path.join(SHOTS, `${theme}-${name}.png`), fullPage: true });
    await page.close();

    results.push({
      theme, name, ...s,
      errors: errors.slice(0, 3),
      bad: errors.length > 0,
      thin: s.els < 8 || (s.textLen < 5 && s.svgs === 0),
    });
  }
}
await browser.close();

for (const r of results) {
  console.log(
    `${r.bad ? "ERROR" : r.thin ? "THIN " : "ok   "} ${r.theme.padEnd(5)} ` +
    `${r.name.padEnd(14)} els=${String(r.els).padStart(4)} svg=${String(r.svgs).padStart(3)} ` +
    `h=${String(r.h).padStart(4)}` +
    (r.errors.length ? `\n      ${r.errors.join("\n      ")}` : "")
  );
}

const problems = results.filter((r) => r.bad || r.thin).length;
console.log(`\n${results.length} renders, ${problems} with problems — screenshots in design-system/dist/shots/`);
process.exit(problems ? 1 : 0);

/* ── tokens.json → tokens.css, as the artifact page compiles it ── */

function compileTokensCss(t) {
  const out = [];
  const esc = (n) => n.replace(/\./g, "\\.");
  const themes = t.color.themes.map((x) => x.id);
  const first = themes[0];
  const pick = (v, theme) => (typeof v === "string" ? v : v[theme] ?? v[first]);
  const cssVal = (v) => (/^\{.+\}$/.test(v) ? `var(--${esc(v.slice(1, -1))})` : v);
  const block = (sel, lines) => out.push(`${sel} {\n${lines.join("\n")}\n}`);

  const forTheme = (theme) => {
    const lines = [];
    for (const tok of t.color.tokens) {
      const v = pick(tok.value, theme);
      if (v) lines.push(`  --${esc(tok.name)}: ${cssVal(v)};`);
    }
    for (const tok of t.shadow?.tokens ?? []) {
      const v = pick(tok.value, theme);
      if (v) lines.push(`  --${esc(tok.name)}: ${v};`);
    }
    return lines;
  };

  block(`:root, [data-theme="${first}"]`, forTheme(first));
  for (const th of themes.slice(1)) block(`[data-theme="${th}"]`, forTheme(th));

  const rest = [];
  for (const fam of ["spacing", "radius", "blur", "duration", "easing", "zIndex", "container"]) {
    for (const tok of t[fam]?.tokens ?? []) rest.push(`  --${esc(tok.name)}: ${tok.value};`);
  }
  for (const [k, v] of Object.entries(t.type.families)) rest.push(`  --font-${k}: ${v};`);
  block(":root", rest);

  for (const g of t.type.groups) {
    for (const s of g.styles) {
      const l = [
        `  font-family: var(--font-${s.family ?? g.family});`,
        `  font-size: ${s.fontSize};`,
      ];
      if (s.lineHeight) l.push(`  line-height: ${s.lineHeight};`);
      if (s.letterSpacing) l.push(`  letter-spacing: ${s.letterSpacing};`);
      if (s.fontWeight) l.push(`  font-weight: ${s.fontWeight};`);
      block(`.${esc(s.name)}`, l);
    }
  }

  return "/* PULSE — generated from tokens.json */\n" + out.join("\n") + "\n";
}
