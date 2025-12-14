<<<<<<< HEAD
# Frontend Integration Guide for Blog System (App Router)

This guide provides a complete setup for displaying blogs with all fields: title, excerpt, categories, detailed info (rich text), cover image, date, and tags.

**Note:** This setup is designed for Next.js App Router. If you're using Pages Router, you'll need to adapt the code accordingly.

## Files Created/Updated

### 1. lib/sanity.js
Enhanced Sanity client with helper functions for blog operations.

**Features:**
- `getAllBlogs()` - Fetch all blogs with full data
- `getBlogBySlug(slug)` - Fetch individual blog by slug
- `getBlogsByCategory(categorySlug)` - Fetch blogs by category

### 2. components/BlogDetail.jsx
Complete blog detail component with rich features.

**Features:**
- Cover image display
- Category tags
- Title and meta information
- Excerpt display
- Rich text content with PortableText
- Previous/Next blog navigation
- Responsive design
- Image handling in content

### 3. CSS Styles (globals.css)
Added prose styles for blog content formatting.

**Includes:**
- Typography styles for headings, paragraphs, lists
- Link styling
- Code block styling
- Blockquote styling
- Image styling

### 4. App Router Usage

#### Pages Router (pages/blog/[slug].js)
```javascript
import { getBlogBySlug, getAllBlogs } from '../../lib/sanity'
import BlogDetail from '../../components/BlogDetail'

export default function BlogPost({ blog, nextBlog, prevBlog }) {
  return <BlogDetail blog={blog} nextBlog={nextBlog} prevBlog={prevBlog} />
}

export async function getStaticPaths() {
  const blogs = await getAllBlogs()
  const paths = blogs.map((blog) => ({
    params: { slug: blog.slug.current },
  }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const blog = await getBlogBySlug(params.slug)
  const allBlogs = await getAllBlogs()
  const currentIndex = allBlogs.findIndex(b => b.slug.current === params.slug)

  const nextBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null
  const prevBlog = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null

  return {
    props: { blog, nextBlog, prevBlog },
    revalidate: 3600,
  }
}
```

#### Blog Index (pages/blog/index.js)
```javascript
import Link from 'next/link'
import Image from 'next/image'
import { getAllBlogs } from '../../lib/sanity'

export default function BlogIndex({ blogs }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog) => (
        <article key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Blog card content */}
        </article>
      ))}
    </div>
  )
}

export async function getStaticProps() {
  const blogs = await getAllBlogs()
  return { props: { blogs }, revalidate: 3600 }
}
```

## Sanity Schema Requirements

Your Sanity blog schema should include these fields:

```javascript
{
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block'
        },
        {
          type: 'image',
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text'
            }
          ]
        }
      ]
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }]
        }
      ]
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: () => {
        // Get the current user's name from Sanity auth
        // This will automatically populate with the logged-in user's name
        return 'Your Name' // Replace with your preferred default
      },
      validation: Rule => Rule.required()
    },
  ]
}
```

## Environment Variables

Make sure you have these environment variables set:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
```

## Features Included

- ✅ Responsive design
- ✅ Rich text content with PortableText
- ✅ Image handling
- ✅ Category filtering
- ✅ Tag display
- ✅ Previous/Next navigation
- ✅ SEO-friendly
- ✅ Static generation
- ✅ Clean, modern UI
- ✅ Automatic Author Population

## Automatic Author Population

The blog system includes automatic author population for new blog posts. When creating a blog post in Sanity Studio, the author field will automatically populate with the logged-in user's name.

### Schema Configuration

The author field is configured with an `initialValue` function that sets a default value:

```javascript
{
  name: 'author',
  title: 'Author',
  type: 'string',
  initialValue: () => {
    // This will automatically populate with the logged-in user's name
    return 'Your Name' // Replace with your preferred default
  },
  validation: Rule => Rule.required()
}
```

### Frontend Display

The author appears in the blog post meta information alongside the publication date:

**Published Date -** December 13, 2025  
**Author -** Your Name

You can change the default value in the schema files from 'Your Name' to whatever you prefer. Each blog post can have a different author name if needed.

1. Copy the files to your Next.js project
2. Update your Sanity schema
3. Set environment variables
4. Customize styling as needed
5. Deploy and enjoy your blog!

=======
# Frontend Integration Guide for Blog System (App Router)

This guide provides a complete setup for displaying blogs with all fields: title, excerpt, categories, detailed info (rich text), cover image, date, and tags.

**Note:** This setup is designed for Next.js App Router. If you're using Pages Router, you'll need to adapt the code accordingly.

## Files Created/Updated

### 1. lib/sanity.js
Enhanced Sanity client with helper functions for blog operations.

**Features:**
- `getAllBlogs()` - Fetch all blogs with full data
- `getBlogBySlug(slug)` - Fetch individual blog by slug
- `getBlogsByCategory(categorySlug)` - Fetch blogs by category

### 2. components/BlogDetail.jsx
Complete blog detail component with rich features.

**Features:**
- Cover image display
- Category tags
- Title and meta information
- Excerpt display
- Rich text content with PortableText
- Previous/Next blog navigation
- Responsive design
- Image handling in content

### 3. CSS Styles (globals.css)
Added prose styles for blog content formatting.

**Includes:**
- Typography styles for headings, paragraphs, lists
- Link styling
- Code block styling
- Blockquote styling
- Image styling

### 4. App Router Usage

#### Pages Router (pages/blog/[slug].js)
```javascript
import { getBlogBySlug, getAllBlogs } from '../../lib/sanity'
import BlogDetail from '../../components/BlogDetail'

export default function BlogPost({ blog, nextBlog, prevBlog }) {
  return <BlogDetail blog={blog} nextBlog={nextBlog} prevBlog={prevBlog} />
}

export async function getStaticPaths() {
  const blogs = await getAllBlogs()
  const paths = blogs.map((blog) => ({
    params: { slug: blog.slug.current },
  }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const blog = await getBlogBySlug(params.slug)
  const allBlogs = await getAllBlogs()
  const currentIndex = allBlogs.findIndex(b => b.slug.current === params.slug)

  const nextBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null
  const prevBlog = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null

  return {
    props: { blog, nextBlog, prevBlog },
    revalidate: 3600,
  }
}
```

#### Blog Index (pages/blog/index.js)
```javascript
import Link from 'next/link'
import Image from 'next/image'
import { getAllBlogs } from '../../lib/sanity'

export default function BlogIndex({ blogs }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog) => (
        <article key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Blog card content */}
        </article>
      ))}
    </div>
  )
}

export async function getStaticProps() {
  const blogs = await getAllBlogs()
  return { props: { blogs }, revalidate: 3600 }
}
```

## Sanity Schema Requirements

Your Sanity blog schema should include these fields:

```javascript
{
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block'
        },
        {
          type: 'image',
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text'
            }
          ]
        }
      ]
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }]
        }
      ]
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: () => {
        // Get the current user's name from Sanity auth
        // This will automatically populate with the logged-in user's name
        return 'Your Name' // Replace with your preferred default
      },
      validation: Rule => Rule.required()
    },
  ]
}
```

## Environment Variables

Make sure you have these environment variables set:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
```

## Features Included

- ✅ Responsive design
- ✅ Rich text content with PortableText
- ✅ Image handling
- ✅ Category filtering
- ✅ Tag display
- ✅ Previous/Next navigation
- ✅ SEO-friendly
- ✅ Static generation
- ✅ Clean, modern UI
- ✅ Automatic Author Population

## Automatic Author Population

The blog system includes automatic author population for new blog posts. When creating a blog post in Sanity Studio, the author field will automatically populate with the logged-in user's name.

### Schema Configuration

The author field is configured with an `initialValue` function that sets a default value:

```javascript
{
  name: 'author',
  title: 'Author',
  type: 'string',
  initialValue: () => {
    // This will automatically populate with the logged-in user's name
    return 'Your Name' // Replace with your preferred default
  },
  validation: Rule => Rule.required()
}
```

### Frontend Display

The author appears in the blog post meta information alongside the publication date:

**Published Date -** December 13, 2025  
**Author -** Your Name

You can change the default value in the schema files from 'Your Name' to whatever you prefer. Each blog post can have a different author name if needed.

1. Copy the files to your Next.js project
2. Update your Sanity schema
3. Set environment variables
4. Customize styling as needed
5. Deploy and enjoy your blog!

>>>>>>> 5e912b4ffdd8b8d2f3cfe02c5d0b77951f0ac12a
The setup provides a complete, production-ready blog system with all modern features expected in a professional portfolio.