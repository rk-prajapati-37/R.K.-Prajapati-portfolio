import Link from "next/link";
import { client } from "@/lib/sanityClient";

export default async function BlogListPage() {
  const blogs = await client.fetch(`
    *[_type == "blog"] | order(date desc) {
      title,
      "slug": slug.current,
      excerpt,
      "coverImage": coverImage.asset->url,
      date
    }
  `);

  return (
    <div className="max-w-6xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Latest Blogs</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog: any) => (
          <Link
            key={blog.slug}
            href={`/blog/${blog.slug}`}
            className="block bg-white shadow hover:shadow-lg rounded-lg overflow-hidden transition-all"
          >
            {blog.coverImage && (
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="h-48 w-full object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-500 text-sm mb-3">
                {new Date(blog.date).toLocaleDateString()}
              </p>
              <p className="text-gray-700 text-sm">{blog.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
