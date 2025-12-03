import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

export async function GET() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

  if (!projectId) {
    return NextResponse.json(
      { ok: false, error: "NEXT_PUBLIC_SANITY_PROJECT_ID not set" },
      { status: 500 }
    );
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: "2025-11-01",
      useCdn: false,
      token: process.env.SANITY_API_TOKEN,
    });

    // Try a tiny query to verify connectivity and permissions
    const sample = await client.fetch(`*[_type == "project"][0]{_id, title}`);

    return NextResponse.json({ ok: true, projectId, dataset, sample });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
