/**
 * One-time helper: turns a SHORT-LIVED user token from Graph API Explorer into
 * a long-lived (non-expiring) Page token, and prints everything you need for .env.local
 *
 * Usage:
 *   node scripts/meta-token.mjs <APP_ID> <APP_SECRET> <SHORT_USER_TOKEN>
 */
const [appId, appSecret, shortToken] = process.argv.slice(2);
if (!appId || !appSecret || !shortToken) {
  console.error("Usage: node scripts/meta-token.mjs <APP_ID> <APP_SECRET> <SHORT_USER_TOKEN>");
  process.exit(1);
}
const G = "https://graph.facebook.com/v19.0";
const get = async (path) => {
  const r = await fetch(`${G}/${path}`);
  const j = await r.json();
  if (j.error) throw new Error(`${path.split("?")[0]} -> ${j.error.message}`);
  return j;
};

try {
  // 1) short-lived user token -> long-lived user token (60 days)
  const ll = await get(
    `oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`
  );
  // 2) pages you manage -> Page tokens derived from a long-lived user token never expire
  const pages = await get(`me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${ll.access_token}`);
  if (!pages.data?.length) throw new Error("No Facebook Page found on this account. Create a Page first and link Instagram to it.");

  for (const p of pages.data) {
    console.log("\n=============================================");
    console.log(`Page: ${p.name}`);
    console.log("Paste these into .env.local:\n");
    console.log(`FACEBOOK_PAGE_ID=${p.id}`);
    console.log(`FACEBOOK_PAGE_TOKEN=${p.access_token}`);
    if (p.instagram_business_account?.id) {
      console.log(`INSTAGRAM_USER_ID=${p.instagram_business_account.id}`);
    } else {
      console.log("INSTAGRAM_USER_ID=   <- no Instagram account linked to this Page yet");
    }
    // sanity check the token
    const dbg = await get(`debug_token?input_token=${p.access_token}&access_token=${ll.access_token}`);
    console.log(`\nToken expires: ${dbg.data.expires_at === 0 ? "never" : new Date(dbg.data.expires_at * 1000)}`);
  }
  console.log("\nDone. Restart `npm run dev` after editing .env.local.");
} catch (e) {
  console.error("\nFailed:", e.message);
  process.exit(1);
}
