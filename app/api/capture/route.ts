import { NextResponse, type NextRequest } from "next/server";
// @ts-ignore - plain ESM helper shared with the CLI script
import { captureProject } from "@/lib/captureProject.mjs";

/**
 * POST /api/capture
 * Headers: x-capture-secret: <CAPTURE_SECRET>
 * Body:    { url, clientName?, category?, date?, title?, tech?: string[], demoUrl? }
 *
 * Creates/updates a Sanity project from a live URL with permanent screenshots.
 * Can be called from a Sanity webhook or any HTTP client.
 */
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const secret = process.env.CAPTURE_SECRET;
  if (!secret || req.headers.get("x-capture-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body?.url) return NextResponse.json({ error: "url is required" }, { status: 400 });
    const logs: string[] = [];
    const r = await captureProject({ ...body, log: (m: string) => logs.push(m) });
    const { screenshots, ...rest } = r;
    return NextResponse.json({ ok: true, ...rest, logs });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Capture failed" }, { status: 500 });
  }
}
