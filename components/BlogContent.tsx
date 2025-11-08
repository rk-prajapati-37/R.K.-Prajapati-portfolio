"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanityClient";
import PortableTextClient from "./PortableTextClient";

type Blog = {
  title: string;
  content: any;
  date: string;
  coverImage?: string;
};

export default function BlogContent({ slug }: { slug: string }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 🧠 Prevent fetch when slug is undefined or empty
    if (!slug) {
      console.warn("⚠️ BlogContent called without slug");
      setError("Invalid blog URL — no slug provided.");
      setLoading(false);
      return;
    }

    console.log("📡 Fetching blog with slug:", slug);

    client
      .fetch(
        `*[_type == "blog" && slug.current == $slug][0]{
          title,
          content,
          date,
          "coverImage": coverImage.asset->url
        }`,
        { slug } // ✅ make sure slug is sent here
      )
      .then((data) => {
        if (!data) {
          console.warn("⚠️ No blog found for slug:", slug);
          setError(`No blog found with slug: ${slug}`);
        } else {
          console.log("✅ Blog loaded successfully:", data.title);
          setBlog(data);
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching blog:", err);
        setError(
          `Error loading blog: ${
            err.message || "Unknown error"
          }. Please check your Sanity project ID and dataset.`
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-xl text-gray-600">
          {error || "Blog not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="rounded-lg mb-6 w-full h-[400px] object-cover"
        />
      )}

      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-500 mb-8">
        {new Date(blog.date).toLocaleDateString()}
      </p>

      <div className="prose max-w-none">
        <PortableTextClient value={blog.content} />
      </div>
    </div>
  );
}
