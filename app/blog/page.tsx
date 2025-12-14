"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Blog = {
  _id: string;
  title: string;
  excerpt?: string;
  slug: { current: string };
  date: string;
  coverImage?: string;
  category?: string[];
  tags?: string[];
  author?: string;
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Temporary static data until Sanity blog schema is set up
    const staticBlogs: Blog[] = [
      {
        _id: "1",
        title: "Getting Started with Next.js 14",
        excerpt: "Learn how to build modern web applications with Next.js 14, including the new app router and server components.",
        slug: { current: "getting-started-nextjs-14" },
        date: "2024-01-15",
        coverImage: "/images/project1.jpg",
        category: ["Web Development", "React"],
        tags: ["nextjs", "react", "javascript"],
        author: "R.K. Prajapati"
      },
      {
        _id: "2",
        title: "Building Responsive UIs with Tailwind CSS",
        excerpt: "Discover the power of utility-first CSS with Tailwind CSS and how it can speed up your development process.",
        slug: { current: "responsive-ui-tailwind-css" },
        date: "2024-01-10",
        coverImage: "/images/project1.jpg",
        category: ["CSS", "Frontend"],
        tags: ["tailwind", "css", "responsive"],
        author: "R.K. Prajapati"
      },
      {
        _id: "3",
        title: "The Future of Web Development",
        excerpt: "Exploring upcoming trends and technologies that will shape the future of web development.",
        slug: { current: "future-web-development" },
        date: "2024-01-05",
        coverImage: "/images/project1.jpg",
        category: ["Technology", "Trends"],
        tags: ["webdev", "future", "technology"],
        author: "R.K. Prajapati"
      }
    ];

    setBlogs(staticBlogs);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="text-center text-red-600">
            <h1 className="text-2xl font-bold mb-4">Error Loading Blogs</h1>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Blog</h1>
          <p className="text-gray-600 text-lg">Insights, tutorials, and thoughts on web development</p>
        </motion.div>

        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No blogs published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <Link href={`/blog/${blog.slug.current}`}>
                  {blog.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Categories */}
                    {blog.category && blog.category.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {blog.category.slice(0, 2).map((category, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-red-600 transition-colors">
                      {blog.title}
                    </h2>

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
      </div>
    </div>
  );
}