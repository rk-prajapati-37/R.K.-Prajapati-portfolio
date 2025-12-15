"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { client } from "@/lib/sanityClient";

type Blog = {
  _id: string;
  title: string;
  excerpt?: string;
  slug: { current: string };
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
  categories?: { title: string; slug: { current: string } }[];
  tags?: string[];
  author?: string;
};

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const data = await client.fetch(`
  *[_type == "blog"]
  | order(coalesce(date, _createdAt) desc)[0...3] {
    _id,
    title,
    excerpt,
    slug,
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
    categories[]->{
      title,
      slug
    },
    tags,
    author
  }
`);

        setBlogs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="text-center text-red-600">
            <h2 className="text-2xl font-bold mb-4">Error Loading Blogs</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Latest Blog Posts</h2>
          <p className="text-gray-600 text-lg">Insights and thoughts on web development</p>
        </motion.div>

        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No blogs published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogs.map((blog, index) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <Link href={`/blog/${blog.slug.current}`}>
                  {blog.coverImage?.asset?.url && (
                    <div className="relative h-48 overflow-hidden rounded-lg">
                      <Image
                        src={blog.coverImage.asset.url}
                        alt={blog.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Categories */}
                    {blog.categories && blog.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {blog.categories.slice(0, 2).map((category, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium"
                          >
                            {category.title}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-red-600 transition-colors">
                      {blog.title}
                    </h3>

                    {blog.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {new Date(blog.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {blog.author && (
                        <span className="text-red-600 font-medium">
                          {blog.author}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {blog.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/blog"
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-full font-medium hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
          >
            View All Blogs
          </Link>
        </motion.div>
      </div>
    </section>
  );
}