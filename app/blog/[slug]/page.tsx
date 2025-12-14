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

// Static blog data
const getStaticBlogs = () => [
  {
    title: "Getting Started with Next.js 14",
    excerpt: "Learn how to build modern web applications with Next.js 14, including the new app router and server components.",
    details: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Next.js 14 introduces several exciting features that make building web applications even more powerful. In this post, we'll explore the new app router and how it changes the way we structure our applications."
          }
        ]
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "The app router provides a more intuitive way to organize your routes and components. With nested layouts and server components, you can create more efficient and maintainable applications."
          }
        ]
      }
    ],
    category: ["Web Development", "React"],
    tags: ["nextjs", "react", "javascript"],
    date: "2024-01-15",
    coverImage: "/images/project1.jpg",
    slug: "getting-started-nextjs-14",
    author: "R.K. Prajapati"
  },
  {
    title: "Building Responsive UIs with Tailwind CSS",
    excerpt: "Discover the power of utility-first CSS with Tailwind CSS and how it can speed up your development process.",
    details: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Tailwind CSS has revolutionized the way we approach styling in modern web development. Its utility-first approach allows for rapid prototyping and consistent design systems."
          }
        ]
      }
    ],
    category: ["CSS", "Frontend"],
    tags: ["tailwind", "css", "responsive"],
    date: "2024-01-10",
    coverImage: "/images/project1.jpg",
    slug: "responsive-ui-tailwind-css",
    author: "R.K. Prajapati"
  },
  {
    title: "The Future of Web Development",
    excerpt: "Exploring upcoming trends and technologies that will shape the future of web development.",
    details: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Web development is constantly evolving. From new frameworks to emerging technologies, staying ahead of the curve is essential for developers."
          }
        ]
      }
    ],
    category: ["Technology", "Trends"],
    tags: ["webdev", "future", "technology"],
    date: "2024-01-05",
    coverImage: "/images/project1.jpg",
    slug: "future-web-development",
    author: "R.K. Prajapati"
  }
];

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

  const allBlogs = getStaticBlogs();
  const blog = allBlogs.find(b => b.slug === slug);
  const currentIndex = allBlogs.findIndex(b => b.slug === slug);

  let nextBlog: { title: string; slug: string } | null = null;
  let prevBlog: { title: string; slug: string } | null = null;

  if (currentIndex !== -1) {
    if (currentIndex > 0) {
      prevBlog = { title: allBlogs[currentIndex - 1].title, slug: allBlogs[currentIndex - 1].slug! };
    }
    if (currentIndex < allBlogs.length - 1) {
      nextBlog = { title: allBlogs[currentIndex + 1].title, slug: allBlogs[currentIndex + 1].slug! };
    }
  }

  if (!blog) {
    notFound();
  }

  return <BlogContentClient blog={blog} nextBlog={nextBlog} prevBlog={prevBlog} error={null} />;
}
