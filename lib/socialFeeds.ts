/**
 * Server-side social feed fetchers.
 *
 * - YouTube:   public RSS feed, no API key needed.  Set YOUTUBE_CHANNEL_ID.
 * - Instagram: Instagram Graph API (Business/Creator account). Set INSTAGRAM_ACCESS_TOKEN.
 * - Facebook:  Facebook Page posts via Graph API.   Set FACEBOOK_PAGE_ID + FACEBOOK_PAGE_TOKEN.
 *
 * Each source is optional: if its env vars are missing, it simply returns [].
 * Results are cached by Next.js for REVALIDATE_SECONDS.
 */

export type FeedPlatform = "youtube" | "instagram" | "facebook";

export type FeedPost = {
  id: string;
  platform: FeedPlatform;
  title?: string;
  text?: string;
  image?: string;
  url: string;
  date: string; // ISO
  isVideo?: boolean;
};

export const REVALIDATE_SECONDS = 3600; // refresh feeds once an hour

const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .trim();

const tag = (xml: string, name: string) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : undefined;
};

/* ---------------- YouTube (RSS, free) ---------------- */
export async function getYouTubeVideos(limit = 12): Promise<FeedPost[]> {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const playlistId = process.env.YOUTUBE_PLAYLIST_ID; // optional: only show videos from this playlist (e.g. "Website Design Portfolio")
  if (!channelId && !playlistId) return [];
  try {
    const feedUrl = playlistId
      ? `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`
      : `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const res = await fetch(feedUrl, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { "User-Agent": "Mozilla/5.0 (portfolio feed)" },
    });
    if (!res.ok) throw new Error(`YouTube RSS ${res.status}`);
    const xml = await res.text();
    const entries = xml.split("<entry>").slice(1);
    return entries.slice(0, limit).map((e) => {
      const videoId = tag(e, "yt:videoId") || "";
      const thumb = e.match(/<media:thumbnail url="([^"]+)"/)?.[1];
      return {
        id: `yt-${videoId}`,
        platform: "youtube",
        title: tag(e, "title"),
        text: tag(e, "media:description"),
        image: thumb || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        date: tag(e, "published") || new Date().toISOString(),
        isVideo: true,
      };
    });
  } catch (err) {
    console.error("YouTube feed failed:", err);
    return [];
  }
}

/* ---------------- Instagram (Graph API) ---------------- */
export async function getInstagramPosts(limit = 12): Promise<FeedPost[]> {
  const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  // Option A (recommended): Instagram linked to a Facebook Page -> reuse the Page token.
  const igUserId = process.env.INSTAGRAM_USER_ID;
  const pageToken = process.env.FACEBOOK_PAGE_TOKEN;
  // Option B: token from "Instagram API with Instagram Login".
  const igToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  let url: string | null = null;
  if (igUserId && pageToken) {
    url = `https://graph.facebook.com/v19.0/${igUserId}/media?fields=${fields}&limit=${limit}&access_token=${pageToken}`;
  } else if (igToken) {
    url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${igToken}`;
  }
  if (!url) return [];
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) throw new Error(`Instagram API ${res.status}: ${await res.text()}`);
    const json = await res.json();
    return (json.data || []).map((p: any) => ({
      id: `ig-${p.id}`,
      platform: "instagram" as const,
      text: p.caption,
      image: p.media_type === "VIDEO" ? p.thumbnail_url : p.media_url,
      url: p.permalink,
      date: p.timestamp,
      isVideo: p.media_type === "VIDEO",
    }));
  } catch (err) {
    console.error("Instagram feed failed:", err);
    return [];
  }
}

/* ---------------- Facebook Page (Graph API) ---------------- */
export async function getFacebookPosts(limit = 12): Promise<FeedPost[]> {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_TOKEN;
  if (!pageId || !token) return [];
  try {
    const fields = "id,message,full_picture,permalink_url,created_time";
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}/posts?fields=${fields}&limit=${limit}&access_token=${token}`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
    if (!res.ok) throw new Error(`Facebook API ${res.status}: ${await res.text()}`);
    const json = await res.json();
    return (json.data || [])
      .filter((p: any) => p.message || p.full_picture)
      .map((p: any) => ({
        id: `fb-${p.id}`,
        platform: "facebook" as const,
        text: p.message,
        image: p.full_picture,
        url: p.permalink_url,
        date: p.created_time,
      }));
  } catch (err) {
    console.error("Facebook feed failed:", err);
    return [];
  }
}

/* ---------------- Hashtag filter for Facebook / Instagram ----------------
 * Only posts whose caption contains one of these hashtags are shown on the website.
 * YouTube is already limited by playlist, so it is not filtered.
 * Override with SOCIAL_HASHTAGS=tag1,tag2 in .env (without "#", since "#" starts a comment in env files);
 * set SOCIAL_HASHTAGS= (empty) to show everything.
 */
const DEFAULT_HASHTAGS = ["#rkprajapati", "#portfolio"];
export function getHashtagFilter(): string[] {
  const raw = process.env.SOCIAL_HASHTAGS;
  if (raw === undefined) return DEFAULT_HASHTAGS;
  return raw
    .split(",")
    .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
    .filter(Boolean)
    .map((t) => `#${t}`);
}
export function matchesHashtags(post: FeedPost, tags = getHashtagFilter()): boolean {
  if (post.platform === "youtube" || tags.length === 0) return true;
  const text = `${post.title || ""} ${post.text || ""}`.toLowerCase();
  return tags.some((t) => text.includes(t));
}

/* ---------------- Merged feed ---------------- */
export async function getSocialFeed(limitPerPlatform = 12): Promise<FeedPost[]> {
  // fetch more than needed from FB/IG since most posts will be filtered out by hashtag
  const results = await Promise.allSettled([
    getYouTubeVideos(limitPerPlatform),
    getInstagramPosts(50),
    getFacebookPosts(50),
  ]);
  const posts = results.flatMap((r) => (r.status === "fulfilled" ? r.value : [])).filter((p) => matchesHashtags(p));
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Which platforms are configured (used by the UI to show setup hints). */
export function getConfiguredPlatforms(): FeedPlatform[] {
  const list: FeedPlatform[] = [];
  if (process.env.YOUTUBE_CHANNEL_ID || process.env.YOUTUBE_PLAYLIST_ID) list.push("youtube");
  if ((process.env.INSTAGRAM_USER_ID && process.env.FACEBOOK_PAGE_TOKEN) || process.env.INSTAGRAM_ACCESS_TOKEN) list.push("instagram");
  if (process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_TOKEN) list.push("facebook");
  return list;
}
