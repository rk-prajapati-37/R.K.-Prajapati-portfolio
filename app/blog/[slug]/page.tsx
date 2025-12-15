import { client } from "../../../lib/sanityClient";
import BlogContentClient from "@/components/BlogContentClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

// ✅ SEO METADATA
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;

  const blog = await client.fetch(
    `*[_type=="blog" && slug.current==$slug][0]{
      title,
      excerpt,
      seoTitle,
      seoDescription
    }`,
    { slug }
  );

  return {
    title: blog?.seoTitle || blog?.title,
    description: blog?.seoDescription || blog?.excerpt,
    openGraph: {
      title: blog?.seoTitle || blog?.title,
      description: blog?.seoDescription || blog?.excerpt,
      type: "article",
    },
  };
}

type Blog = {
  title: string;
  excerpt?: string;
  details: any;
  category?: string[];
  tags?: string[];
  date: string;
  coverImage?: {
    asset?: {
      url?: string;
      metadata?: {
        dimensions?: {
          height?: number;
          width?: number;
        };
      };
    };
    hotspot?: any;
    crop?: any;
  };
  slug?: string;
  author: string;
};

export default async function SingleBlogPage({
  params,
}: Props) {
  const { slug } = await params;

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
        coverImage {
          asset -> {
            url,
            metadata {
              dimensions {
                height,
                width
              }
            }
          },
          hotspot,
          crop
        },
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
