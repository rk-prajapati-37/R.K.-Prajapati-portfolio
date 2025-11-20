import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

const SANITY_REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
  // Verify the request is coming from Sanity
  const secret = req.headers.get('x-sanity-webhook-secret');

  if (secret !== SANITY_REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: 'Invalid secret' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    // Revalidate cache for affected content types
    revalidateTag('blog');
    revalidateTag('projects');
    revalidateTag('skills');
    revalidateTag('experience');
    revalidateTag('education');
    revalidateTag('certificates');
    revalidateTag('testimonials');
    revalidateTag('contact');

    return NextResponse.json(
      { message: 'Revalidated successfully', body },
      { status: 200 }
    );
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    );
  }
}
