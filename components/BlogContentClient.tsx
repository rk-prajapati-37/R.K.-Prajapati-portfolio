"use client";

import PortableTextClient from "./PortableTextClient";

type Blog = {
  title: string;
  content: any;
  date: string;
  coverImage?: string;
};

export default function BlogContentClient({
  blog,
  error,
}: {
  blog: Blog | null;
  error: string | null;
}) {
  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-xl text-gray-600 text-red-600">
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
