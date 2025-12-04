export const runtime = "nodejs";

import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Support both Sanity webhook secret and a generic revalidate token
    const sanitySecret = process.env.SANITY_REVALIDATE_SECRET;
    const vercelToken = process.env.REVALIDATE_TOKEN;

    const sanityHeader = request.headers.get("x-sanity-webhook-secret") || request.headers.get("x-sanity-secret");
    const vercelHeader = request.headers.get("x-vercel-revalidate-token") || request.headers.get("x-revalidate-token");

    let authorized = false;
    if (!sanitySecret && !vercelToken) {
      // No secrets configured, allow (use with caution)
      authorized = true;
    }
    if (sanitySecret && sanityHeader === sanitySecret) authorized = true;
    if (vercelToken && vercelHeader === vercelToken) authorized = true;

    if (!authorized) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // If the webhook supplies explicit paths, revalidate those
    const paths: string[] = body?.paths || [];
    paths.forEach((p) => {
      try {
        revalidatePath(p);
      } catch (e) {
        // continue on error for individual paths
        console.error("Failed to revalidate path", p, e);
      }
    });

    // If the webhook supplies tags to revalidate, use revalidateTag
    const tags: string[] = body?.tags || [];
    tags.forEach((t) => {
      try {
        // @ts-ignore - signature differs across Next versions; call with single tag
        revalidateTag(t);
      } catch (e) {
        console.error("Failed to revalidate tag", t, e);
      }
    });

    // Backwards-compatible: if no paths or tags provided, revalidate common pages/tags
    if (paths.length === 0 && tags.length === 0) {
      // revalidate a set of common paths and tags used by the site
      const defaultPaths = ["/", "/about", "/experience", "/education", "/certificates", "/skills", "/projects", "/blog", "/contact", "/testimonials"];
      defaultPaths.forEach((p) => {
        try {
          revalidatePath(p);
        } catch (e) {
          console.error("Failed to revalidate default path", p, e);
        }
      });

      const defaultTags = ["blog", "projects", "skills", "experience", "education", "certificates", "testimonials", "contact"];
      defaultTags.forEach((t) => {
        try {
          // @ts-ignore - signature differs across Next versions; call with single tag
          revalidateTag(t);
        } catch (e) {
          console.error("Failed to revalidate default tag", t, e);
        }
      });
    }

    return NextResponse.json({ message: "Revalidation successful", revalidatedPaths: paths, revalidatedTags: tags }, { status: 200 });
  } catch (error) {
    console.error("Revalidation failed:", error);
    return NextResponse.json(
      {
        message: "Revalidation failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
