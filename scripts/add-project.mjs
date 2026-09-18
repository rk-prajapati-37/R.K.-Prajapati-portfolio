/**
 * Add a portfolio project from a live URL – no manual writing or screenshots.
 *
 *   npm run add-project -- https://client-site.com
 *   npm run add-project -- https://client-site.com --client "Bombay Velvet" --category Restaurant --date 2024
 *   npm run add-project -- https://client-site.com --dry-run          (preview only, saves screenshots to ./tmp-capture)
 *
 * Hero is a video/slider that captures blank? Take the main image from lower on the page:
 *   npm run add-project -- https://client-site.com --hero-offset 800     (pixels from the top)
 *
 * If the project already exists in Sanity (same Live Demo URL), your title/description are KEPT and
 * only the new screenshots are added. Use --overwrite to replace the text as well.
 *
 * Old design that the client has since changed? Capture it from the Wayback Machine:
 *   npm run add-project -- "https://web.archive.org/web/2023id_/https://client-site.com" --demo https://client-site.com --date 2023
 */
import fs from "node:fs";
import path from "node:path";
import { captureProject } from "../lib/captureProject.mjs";

// load .env.local without extra deps
try {
  const env = fs.readFileSync(path.resolve(".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--"));
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const has = (name) => args.includes(`--${name}`);

if (!url) {
  console.error("Usage: npm run add-project -- <url> [--client NAME] [--category CAT] [--date 2024] [--title T] [--tech \"WordPress,Elementor\"] [--demo URL] [--dry-run] [--overwrite] [--hero-offset 800]");
  process.exit(1);
}

const dryRun = has("dry-run");
try {
  const r = await captureProject({
    url,
    demoUrl: flag("demo"),
    title: flag("title"),
    clientName: flag("client"),
    category: flag("category"),
    date: flag("date"),
    tech: flag("tech")?.split(",").map((s) => s.trim()).filter(Boolean),
    dryRun,
    overwrite: has("overwrite"),
    heroOffset: flag("hero-offset"),
    log: (m) => console.log("•", m),
  });

  console.log("\n=========== PROJECT ===========");
  console.log("Title      :", r.title);
  console.log("Client     :", r.clientName);
  console.log("Category   :", r.category);
  console.log("Tech       :", r.tech.join(", "));
  console.log("Date       :", r.date);
  console.log("Live demo  :", r.demoUrl);
  console.log("Description:", r.description);

  if (dryRun) {
    const dir = path.resolve("tmp-capture");
    fs.mkdirSync(dir, { recursive: true });
    for (const k of ["desktop", "mobile", "full"]) {
      if (r.screenshots[k]) fs.writeFileSync(path.join(dir, r.files[k]), r.screenshots[k]);
    }
    console.log(`\nDry run: nothing saved to Sanity. Screenshots written to ${dir}\\`);
  } else {
    console.log("\nSaved to Sanity:", r.id);
    console.log("Open in Studio :", r.studioUrl);
    console.log("It will appear on the website within a minute.");
  }
} catch (e) {
  console.error("\nFailed:", e.message);
  process.exit(1);
}
