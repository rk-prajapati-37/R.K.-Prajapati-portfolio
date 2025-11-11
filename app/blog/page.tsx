import Link from "next/link";

export default async function BlogList() {
  // Avoid importing or initializing the Sanity client at module-eval time
  // because deployment/build environments may not have env vars configured yet.
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

  if (!projectId) {
    // Render a helpful message during build/dev when the env vars are missing.
    return (
      <div className="max-w-5xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="p-6 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-lg text-yellow-800">
            Sanity is not configured: <strong>NEXT_PUBLIC_SANITY_PROJECT_ID</strong> is missing.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Add the environment variables <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and
            <code> NEXT_PUBLIC_SANITY_DATASET</code> to your local <code>.env.local</code> and to
            your deployment (Vercel) settings, then rebuild the site.
          </p>
        </div>
      </div>
    );
  }

  // Dynamically import the Sanity client only after we've verified env vars.
  const { client } = await import("@/lib/sanityClient");

  const blogs = await client.fetch(`
    *[_type == "blog"]{
      title,
      slug,
      excerpt,
      "coverImage": coverImage.asset->url
    }
  `);

  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogs.map((blog: any) => (
          <Link key={blog.slug.current} href={`/blog/${blog.slug.current}`}>
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="h-64 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-gray-600">{blog.excerpt}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
