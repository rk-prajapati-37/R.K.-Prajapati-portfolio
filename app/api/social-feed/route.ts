import { NextResponse } from "next/server";
import { getSocialFeed, getConfiguredPlatforms, REVALIDATE_SECONDS } from "@/lib/socialFeeds";

/**
 * GET /api/social-feed
 * Merged latest posts from YouTube / Instagram / Facebook (whichever are configured).
 * Upstream fetches are cached for an hour, so this is cheap to call from the client.
 */
export const revalidate = 3600;

export async function GET() {
  const [posts, platforms] = await Promise.all([getSocialFeed(12), Promise.resolve(getConfiguredPlatforms())]);
  return NextResponse.json(
    { posts, platforms, refreshedAt: new Date().toISOString() },
    { headers: { "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=600` } }
  );
}
