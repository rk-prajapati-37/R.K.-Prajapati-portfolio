import { NextResponse } from "next/server";
import { client } from "../../..//lib/sanityClient";

export async function GET() {
  try {
    const projects = await client.fetch(`*[_type == "project"]{
      _id,
      title,
      "slug": slug.current,
      _createdAt,
      _updatedAt,
      "imageUrl": image.asset->url
    }`);

    return NextResponse.json({ ok: true, count: projects.length, projects });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
