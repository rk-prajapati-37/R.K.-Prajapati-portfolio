import { client } from "../../../lib/sanityClient";
import BlogContentClient from "@/components/BlogContentClient";
import { notFound } from "next/navigation";

type Blog = {
  title: string;
  content: any;
  date: string;
  coverImage?: string;
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
  let error: string | null = null;

  try {
    blog = await client.fetch(
      `*[_type == "blog" && slug.current == $slug][0]{
        title,
        content,
        date,
        "coverImage": coverImage.asset->url
      }`,
      { slug }
    );
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load blog";
  }

  if (!blog && !error) {
    notFound();
  }

  return <BlogContentClient blog={blog} error={error} />;
}
