/**
 * Turn a live website URL into a portfolio project:
 *   1. fetch the page (title, description, tech detection)
 *   2. capture desktop + mobile + full-page screenshots (microlink.io, free tier)
 *   3. upload screenshots to Sanity as permanent image assets
 *   4. create (or update) the `project` document in Sanity
 *
 * Because the screenshots are stored in Sanity, the portfolio keeps showing
 * YOUR design even if the client later redesigns the site or takes it offline.
 *
 * Used by:  scripts/add-project.mjs   (CLI)
 *           app/api/capture/route.ts  (HTTP, e.g. from a Sanity webhook)
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "i8n8hd39";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const API = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01`;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36 (portfolio-capture)";

/* ------------------------------------------------------------------ helpers */
const clean = (s = "") =>
  String(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/&ndash;/g, "–").replace(/&mdash;/g, "—")
    .replace(/\s+/g, " ")
    .trim();

const meta = (html, name) => {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]*content=["']([^"']*)["']`, "i");
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${name}["']`, "i");
  return clean((html.match(re) || html.match(re2) || [])[1] || "");
};

export const slugify = (s) =>
  clean(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);

/** Guess the tech stack from page HTML. */
export function detectTech(html = "") {
  const h = html.toLowerCase();
  const tech = [];
  const has = (...xs) => xs.some((x) => h.includes(x));
  if (has("wp-content", "wp-includes")) tech.push("WordPress");
  if (has("elementor")) tech.push("Elementor");
  if (has("woocommerce")) tech.push("WooCommerce");
  if (has("cdn.shopify", "shopify")) tech.push("Shopify");
  if (has("__next_data__", "/_next/")) tech.push("Next.js");
  else if (has("react", "data-reactroot")) tech.push("React");
  if (has("wix.com", "wixstatic")) tech.push("Wix");
  if (has("squarespace")) tech.push("Squarespace");
  if (has("bootstrap")) tech.push("Bootstrap");
  if (has("jquery")) tech.push("jQuery");
  if (has("tailwind")) tech.push("Tailwind CSS");
  if (tech.length === 0) tech.push("HTML", "CSS", "JavaScript");
  return [...new Set(tech)];
}

/** Guess a portfolio category from title/description keywords. */
export function guessCategory(text = "") {
  const t = text.toLowerCase();
  const rules = [
    [/shop|store|cart|product|buy|e-?commerce|woocommerce|shopify/, "E-commerce"],
    [/restaurant|cafe|food|dining|menu|kitchen/, "Restaurant"],
    [/ngo|foundation|trust|charity|welfare|donat/, "NGO / Non-profit"],
    [/school|academy|institute|coaching|college|education|course|classes/, "Education"],
    [/clinic|hospital|doctor|dental|health|care|wellness|yoga/, "Healthcare"],
    [/film|studio|production|media|news|magazine|journal/, "Media & Production"],
    [/real ?estate|property|builder|construction|interior|architect/, "Real Estate & Construction"],
    [/consult|agency|solutions|services|pvt|ltd|llp|industries|manufactur/, "Business / Corporate"],
    [/portfolio|photograph|artist|designer|freelanc/, "Portfolio"],
    [/spiritual|wisdom|retreat|temple|meditation|community/, "Community & Spiritual"],
    [/travel|tour|hotel|resort|holiday/, "Travel & Hospitality"],
  ];
  for (const [re, cat] of rules) if (re.test(t)) return cat;
  return "Business Website";
}

/** Fetch page HTML + basic meta directly (fast, no external service). */
export async function fetchPageInfo(url) {
  const headers = { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" };
  let res = await fetch(url, { headers, redirect: "follow" });
  if (!res.ok && /web\.archive\.org/i.test(url)) res = await fetch(url, { headers: { ...headers, Accept: "*/*" }, redirect: "follow" });
  if (!res.ok) throw new Error(`Site returned ${res.status}`);
  let html = await res.text();
  if (/web\.archive\.org/i.test(url)) html = html.replace(/<!-- BEGIN WAYBACK TOOLBAR INSERT -->[\s\S]*?<!-- END WAYBACK TOOLBAR INSERT -->/i, "");
  const title = clean((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
  if (html.length < 1500 && !title) {
    throw new Error(
      `This URL returned an almost empty page (${html.length} bytes, no title). Check the address – e.g. the real site may use a different spelling or domain.`
    );
  }
  const h1 = clean((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || "");
  // first real paragraph: long enough to be a sentence, short enough not to be a mega-menu dump
  const firstP = clean(
    ((html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [])
      .map((p) => clean(p))
      .find((p) => p.length > 60 && p.length < 400 && /[.!?]/.test(p)) || "")
  );
  return {
    html,
    title,
    h1,
    ogTitle: meta(html, "og:title"),
    siteName: meta(html, "og:site_name"),
    description: meta(html, "description") || meta(html, "og:description"),
    ogImage: meta(html, "og:image"),
    firstParagraph: firstP,
    tech: detectTech(html),
  };
}

/* ---------------- screenshots ----------------
 * 1) Local Chromium via Playwright (unlimited, best quality) – used when installed.
 * 2) Fallback: microlink.io (free tier ~50 requests/day, no key needed).
 */
let _browser = null;
async function getBrowser() {
  if (_browser) return _browser;
  try {
    const { chromium } = await import("playwright");
    _browser = await chromium.launch({ headless: true });
    return _browser;
  } catch {
    return null; // playwright not installed → microlink fallback
  }
}
export async function closeBrowser() {
  if (_browser) { await _browser.close().catch(() => {}); _browser = null; }
}

async function screenshotLocal(url, { width, height, mobile, fullPage, clipY }) {
  const browser = await getBrowser();
  if (!browser) return null;
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
    userAgent: mobile
      ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
      : UA,
  });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => page.goto(url, { waitUntil: "load", timeout: 60000 }));
    // dismiss common cookie / popup banners so they don't cover the design; hide the Wayback Machine toolbar
    await page.addStyleTag({ content: "[class*='cookie'],[id*='cookie'],[class*='popup'],[id*='popup'],.pum-overlay,#wm-ipp-base,#wm-ipp-print,#donato,.woocommerce-store-notice,[class*='store-notice'],[class*='currency-notice'],[class*='geo-notice'],[class*='gdpr'],[id*='gdpr'],[class*='consent']{display:none!important}" }).catch(() => {});
    if (/web\.archive\.org/i.test(url)) await page.waitForTimeout(4000); // archived assets load slowly
    if (fullPage) {
      // trigger lazy-loaded images/animations by scrolling through the page
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
        window.scrollTo(0, 0);
      }).catch(() => {});
    }
    await page.waitForTimeout(1500);
    if (clipY) return await page.screenshot({ type: "jpeg", quality: 82, fullPage: true, clip: { x: 0, y: clipY, width, height } });
    return await page.screenshot({ type: "jpeg", quality: 82, fullPage });
  } finally {
    await ctx.close().catch(() => {});
  }
}

export async function screenshot(url, { width = 1280, height = 800, mobile = false, fullPage = false, clipY = 0 } = {}) {
  const local = await screenshotLocal(url, { width, height, mobile, fullPage, clipY }).catch((e) => {
    console.warn("Local screenshot failed, using microlink:", e.message);
    return null;
  });
  if (local) return local;
  const q = new URLSearchParams({
    url,
    screenshot: "true",
    meta: "false",
    "viewport.width": String(width),
    "viewport.height": String(height),
    waitForTimeout: "2000",
    type: "jpeg",
    quality: "82",
    force: "true", // bypass microlink cache so desktop / mobile / full-page are captured separately
    "viewport.deviceScaleFactor": mobile ? "2" : "1",
  });
  if (mobile) q.set("viewport.isMobile", "true");
  if (fullPage) q.set("fullPage", "true");
  const r = await fetch(`https://api.microlink.io/?${q}`);
  const j = await r.json();
  if (j.status !== "success" || !j.data?.screenshot?.url) {
    throw new Error(`Screenshot failed: ${j.message || j.code || j.status}`);
  }
  const img = await fetch(j.data.screenshot.url);
  if (!img.ok) throw new Error(`Screenshot download failed: ${img.status}`);
  return Buffer.from(await img.arrayBuffer());
}

/** Upload an image buffer to Sanity and return the asset _id. */
export async function uploadImage(buffer, filename, token) {
  const r = await fetch(`${API}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}`, {
    method: "POST",
    headers: { "Content-Type": "image/jpeg", Authorization: `Bearer ${token}` },
    body: buffer,
  });
  const j = await r.json();
  if (!r.ok || !j.document?._id) throw new Error(`Sanity upload failed: ${JSON.stringify(j).slice(0, 200)}`);
  return j.document._id;
}

async function sanityQuery(groq, token) {
  const r = await fetch(`${API}/data/query/${DATASET}?query=${encodeURIComponent(groq)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const j = await r.json();
  if (j.error) throw new Error(JSON.stringify(j.error));
  return j.result;
}

async function sanityMutate(mutations, token) {
  const r = await fetch(`${API}/data/mutate/${DATASET}?returnIds=true`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ mutations }),
  });
  const j = await r.json();
  if (j.error) throw new Error(JSON.stringify(j.error));
  return j;
}

/**
 * Main entry.
 * @param {object} opts
 * @param {string} opts.url            live site URL (or a web.archive.org URL for old designs)
 * @param {string} [opts.demoUrl]      URL to show as "Live demo" (defaults to url, or the original site when using wayback)
 * @param {string} [opts.title]        override title
 * @param {string} [opts.clientName]   override client name
 * @param {string} [opts.category]     override category
 * @param {string} [opts.date]         e.g. "2024" or "Mar 2024"
 * @param {string[]} [opts.tech]       override tech stack
 * @param {boolean} [opts.dryRun]      don't write to Sanity; return what would be saved
 * @param {boolean} [opts.overwrite]   if the project already exists, replace its text too (default: only add screenshots)
 * @param {number}  [opts.heroOffset]  take the main (desktop) image from this Y position of the page instead of the top
 *                                     (useful when the hero is a video/slider that doesn't capture well)
 * @param {string} [opts.token]        Sanity write token (defaults to SANITY_API_TOKEN)
 * @param {(msg:string)=>void} [opts.log]
 */
export async function captureProject(opts) {
  const log = opts.log || (() => {});
  const token = opts.token || process.env.SANITY_API_TOKEN;
  if (!opts.dryRun && !token) throw new Error("SANITY_API_TOKEN (editor) is required");

  let url = opts.url.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  const isWayback = /web\.archive\.org\/web\//i.test(url);
  const originalUrl = isWayback ? url.replace(/^.*web\.archive\.org\/web\/\d+(?:id_)?\//i, "") : url;
  const demoUrl = opts.demoUrl || originalUrl;

  log(`Reading ${url} …`);
  const info = await fetchPageInfo(url);

  const rawTitle = opts.title || info.ogTitle || info.title || info.h1 || new URL(originalUrl).hostname;
  const clientName = opts.clientName || info.siteName || rawTitle.split(/\s[|–-]\s/)[0].trim();
  const category = opts.category || guessCategory(`${rawTitle} ${info.description} ${info.firstParagraph}`);
  const tech = opts.tech && opts.tech.length ? opts.tech : info.tech;
  const catLabel = category.replace(/\s*website$/i, "");
  const title = opts.title || `${clientName} – ${catLabel} Website`;
  let blurb = info.description || info.firstParagraph || "";
  if (blurb.length > 240) blurb = blurb.slice(0, 240).replace(/\s+\S*$/, "") + "…"; // keep card text short
  const description =
    `${catLabel} website designed and developed for ${clientName}. ` +
    (blurb ? `${blurb.replace(/\.$/, "")}. ` : "") +
    `Built with ${tech.join(", ")}, fully responsive and optimised for speed and search engines.`;

  log("Capturing screenshots (desktop, mobile, full page) …");
  const desktop = await screenshot(url, { width: 1280, height: 800, clipY: Number(opts.heroOffset) || 0 });
  const mobile = await screenshot(url, { width: 390, height: 844, mobile: true });
  const full = await screenshot(url, { width: 1280, height: 800, fullPage: true }).catch(() => null);

  const base = slugify(clientName || rawTitle) || "project";
  const stamp = new Date().toISOString().slice(0, 10);
  const result = {
    url,
    demoUrl,
    title,
    slug: slugify(title),
    clientName,
    category,
    tech,
    description,
    date: opts.date || String(new Date().getFullYear()),
    screenshots: { desktop, mobile, full },
    files: { desktop: `${base}-desktop-${stamp}.jpg`, mobile: `${base}-mobile-${stamp}.jpg`, full: `${base}-full-${stamp}.jpg` },
  };
  if (opts.dryRun) { await closeBrowser(); return { ...result, dryRun: true }; }

  log("Uploading screenshots to Sanity …");
  const desktopId = await uploadImage(desktop, result.files.desktop, token);
  const mobileId = await uploadImage(mobile, result.files.mobile, token);
  const fullId = full ? await uploadImage(full, result.files.full, token) : null;

  const img = (id, key) => ({ _type: "image", _key: key, asset: { _type: "reference", _ref: id } });
  const extraImages = [img(mobileId, "mobile"), ...(fullId ? [img(fullId, "full")] : [])];

  // match the existing project regardless of trailing slash / http vs https / www
  const bare = demoUrl.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/+$/, "");
  const variants = [...new Set([`https://${bare}`, `https://${bare}/`, `http://${bare}`, `http://${bare}/`, `https://www.${bare}`, `https://www.${bare}/`])];
  const existing = await sanityQuery(`*[_type=="project" && demo in ${JSON.stringify(variants)}][0]{_id, demo}`, token);
  if (existing?.demo) log(`Matched existing project by URL: ${existing.demo}`);
  const doc = {
    _type: "project",
    title,
    slug: { _type: "slug", current: result.slug },
    description,
    clientName,
    date: result.date,
    category: [category],
    techStack: tech,
    demo: demoUrl,
    image: { _type: "image", asset: { _type: "reference", _ref: desktopId } },
    extraImages,
    capturedAt: new Date().toISOString(),
    captureSource: url,
  };

  let id;
  if (existing?._id) {
    id = existing._id;
    if (opts.overwrite) {
      log(`Existing project found – overwriting text and images (--overwrite) …`);
      await sanityMutate([{ patch: { id, set: doc } }], token);
    } else {
      // SAFE MODE: never touch the text you wrote. Only add the new screenshots
      // (appended to Extra Images, keyed by date so re-runs don't duplicate)
      // and set the main image if the project has none yet.
      log(`Existing project found – keeping your title/description, adding screenshots only …`);
      // include the desktop shot too, since the existing main image is kept as-is
      const keyed = [img(desktopId, "desktop"), ...extraImages].map((im) => ({ ...im, _key: `${im._key}-${stamp}` }));
      await sanityMutate(
        [
          {
            patch: {
              id,
              setIfMissing: { extraImages: [], image: doc.image, clientName, date: result.date, techStack: tech },
              set: { capturedAt: doc.capturedAt, captureSource: url },
              insert: { after: "extraImages[-1]", items: keyed },
            },
          },
        ],
        token
      );
    }
  } else {
    log("Creating project …");
    const r = await sanityMutate([{ create: { _id: `project-${result.slug}`, ...doc } }], token);
    id = r.results[0].id;
  }
  await closeBrowser();
  return { ...result, id, studioUrl: `http://localhost:3333/structure/project;${id}` };
}
