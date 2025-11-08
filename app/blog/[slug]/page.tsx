import BlogContent from "@/components/BlogContent";
import { notFound } from "next/navigation";

export default async function SingleBlogPage({
  params,
}: {
  // `params` may be a promise in Next 16 dev/RSC mode — await it below.
  params: { slug?: string } | Promise<{ slug?: string }>;
}) {
  // Resolve params in case Next provided them as a Promise. See:
  // https://nextjs.org/docs/messages/sync-dynamic-apis
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  // Avoid logging a console error during Next's server-side checks.
  // Use Next's `notFound()` helper so the route resolves to a 404 when
  // no slug was provided.
  if (!slug) {
    notFound();
  }

  return (
    <div>
      <BlogContent slug={slug} />
    </div>
  );
}
