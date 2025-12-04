import { NextResponse } from "next/server";
import { client } from "../../../lib/sanityClient";

export async function GET() {
  try {
    const skills = await client.fetch(`*[_type == "skill"]{ _id, name, level, percent, "icon": icon.asset->url }`);
    return NextResponse.json({ ok: true, count: skills.length, skills });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
