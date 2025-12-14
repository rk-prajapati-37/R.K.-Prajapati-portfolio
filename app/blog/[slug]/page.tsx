import { client } from "../../../lib/sanityClient";
import BlogContentClient from "@/components/BlogContentClient";
import { notFound } from "next/navigation";

type Blog = {
  title: string;
  excerpt?: string;
  details: any;
  category?: string[];
  tags?: string[];
  date: string;
  coverImage?: string;
  slug?: string;
  author: string;
};

export default async function SingleBlogPage({
  params,
}: {
  params: Promise<{ slug?: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    notFound();
  }

  let blog: Blog | null = null;
  let nextBlog: { title: string; slug: string } | null = null;
  let prevBlog: { title: string; slug: string } | null = null;
  let error: string | null = null;

  try {
    blog = await client.fetch(
      `*[_type == "blog" && slug.current == $slug][0]{
        title,
        excerpt,
        details[]{
          ...,
          _type == "image" => {
            ...,
            asset->{
              _id,
              url,
              metadata
            }
          }
        },
        category,
        tags,
        date,
        "coverImage": coverImage.asset->url,
        "slug": slug.current,
        author
      }`,
      { slug }
    );

    // Fetch all blogs for navigation
    const allBlogs = await client.fetch(`*[_type == "blog"] | order(date desc){ title, "slug": slug.current }`);
    const currentIndex = allBlogs.findIndex((b: any) => b.slug === slug);
    if (currentIndex !== -1) {
      if (currentIndex > 0) {
        prevBlog = allBlogs[currentIndex - 1];
      }
      if (currentIndex < allBlogs.length - 1) {
        nextBlog = allBlogs[currentIndex + 1];
      }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load blog';
  }

  if (!blog && !error) {
    notFound();
  }

  return <BlogContentClient blog={blog} nextBlog={nextBlog} prevBlog={prevBlog} error={error} />;
}
