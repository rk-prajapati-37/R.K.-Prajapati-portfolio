import { NextResponse } from "next/server";
import { client } from "../../../lib/sanityClient";

export async function GET() {
  try {
    const testimonials = await client.fetch(`*[_type == "testimonial"][0]{
      _id,
      name,
      position,
      message,
      feedback,
      testimonial,
      comment,
      "image": image.asset->url
    }`);

    return NextResponse.json({ ok: true, sample: testimonials });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
