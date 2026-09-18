/**
 * Make a short "scroll-through" video of a website for YouTube / Instagram – no screen recording needed.
 *
 *   npm run site-video -- https://client-site.com
 *   npm run site-video -- https://client-site.com --mobile        (9:16 vertical, for Shorts / Reels)
 *   npm run site-video -- https://client-site.com --seconds 30    (length, default 24)
 *
 * Output: site-videos/<name>-desktop.mp4  (1280x720)  or  <name>-mobile.mp4 (720x1280)
 * Upload it to YouTube with a title like "Restaurant Website Design | Bombay Velvet | Portfolio".
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { chromium } from "playwright";

const args = process.argv.slice(2);
let url = args.find((a) => !a.startsWith("--"));
if (!url) {
  console.error("Usage: npm run site-video -- <url> [--mobile] [--seconds 24]");
  process.exit(1);
}
if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
const mobile = args.includes("--mobile");
const secIdx = args.indexOf("--seconds");
const totalSeconds = secIdx >= 0 ? Number(args[secIdx + 1]) || 24 : 24;

const size = mobile ? { width: 720, height: 1280 } : { width: 1280, height: 720 };
const name = new URL(url).hostname.replace(/^www\./, "").replace(/[^a-z0-9]+/gi, "-");
const outDir = path.resolve("site-videos");
fs.mkdirSync(outDir, { recursive: true });
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "site-video-"));

const findFfmpeg = async () => {
  // 1) full ffmpeg (with H.264) bundled via the ffmpeg-static npm package
  try {
    const m = await import("ffmpeg-static");
    if (m.default && fs.existsSync(m.default)) return m.default;
  } catch {}
  // 2) Playwright's ffmpeg (WebM only) / PATH
  const base = path.join(process.env.LOCALAPPDATA || "", "ms-playwright");
  try {
    const dir = fs.readdirSync(base).find((d) => d.startsWith("ffmpeg"));
    if (dir) {
      const exe = fs.readdirSync(path.join(base, dir)).find((f) => f.startsWith("ffmpeg"));
      if (exe) return path.join(base, dir, exe);
    }
  } catch {}
  return "ffmpeg"; // hope it's on PATH
};

console.log(`• Recording ${url} (${mobile ? "mobile 9:16" : "desktop 16:9"}, ~${totalSeconds}s) …`);
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: size,
  deviceScaleFactor: 1,
  isMobile: mobile,
  hasTouch: mobile,
  recordVideo: { dir: tmpDir, size },
  userAgent: mobile
    ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    : undefined,
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => page.goto(url, { waitUntil: "load", timeout: 60000 }));
await page.addStyleTag({ content: "[class*='cookie'],[id*='cookie'],[class*='popup'],[id*='popup'],.pum-overlay{display:none!important} html{scroll-behavior:auto!important}" }).catch(() => {});
await page.waitForTimeout(2500); // let the hero animate in

// smooth scroll to the bottom and back up, timed to fill the video length
const total = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - window.innerHeight));
const downMs = Math.max(4000, totalSeconds * 1000 * 0.62);
const upMs = Math.max(2500, totalSeconds * 1000 * 0.22);
const steps = Math.max(40, Math.round(downMs / 40));
for (let i = 1; i <= steps; i++) {
  const t = i / steps;
  const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // ease-in-out
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * eased));
  await page.waitForTimeout(downMs / steps);
}
await page.waitForTimeout(1200);
const upSteps = Math.max(25, Math.round(upMs / 40));
for (let i = 1; i <= upSteps; i++) {
  const t = 1 - i / upSteps;
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * t * t));
  await page.waitForTimeout(upMs / upSteps);
}
await page.waitForTimeout(1500);

const video = page.video();
await ctx.close();
await browser.close();
const webm = await video.path();

const out = path.join(outDir, `${name}-${mobile ? "mobile" : "desktop"}.mp4`);
console.log("• Converting to MP4 …");
const ff = await findFfmpeg();
const r = spawnSync(ff, ["-y", "-i", webm, "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30", "-movflags", "+faststart", "-an", out], { stdio: "ignore" });
if (r.status !== 0) {
  const fallback = out.replace(/\.mp4$/, ".webm");
  fs.copyFileSync(webm, fallback);
  console.log(`MP4 conversion failed (ffmpeg not found). Saved WebM instead: ${fallback}`);
} else {
  const mb = (fs.statSync(out).size / 1024 / 1024).toFixed(1);
  console.log(`\nDone: ${out}  (${mb} MB)`);
  console.log("Upload it to YouTube / Instagram. Suggested title: \"<Type> Website Design | <Client> | Portfolio\"");
}
fs.rmSync(tmpDir, { recursive: true, force: true });
