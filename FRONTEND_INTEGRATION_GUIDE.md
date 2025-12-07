# 🎨 Frontend Integration Guide - Portfolio Project

**यह guide आपके Sanity CMS से data fetch करके frontend में display करने के लिए है।**

---

## 📋 Table of Contents
1. [Sanity Client Setup](#sanity-client-setup)
2. [GROQ Queries](#groq-queries)
3. [React Hooks](#react-hooks)
4. [Components](#components)
5. [Complete Example](#complete-example)

---

## 🔧 Sanity Client Setup

### Step 1: Install Sanity Client
```bash
npm install @sanity/client @sanity/image-url
```

### Step 2: Create Sanity Client (`lib/sanityClient.ts`)
```typescript
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
})
```

### Step 3: Add Environment Variables (`.env.local`)
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

---

## 🔍 GROQ Queries

### Project के साथ Social Links fetch करो:
```groq
*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  description,
  "imageUrl": image.asset->url,
  clientName,
  date,
  techStack,
  github,
  demo,
  "extraImages": extraImages[].asset->url,
  socialLinks[] {
    platform,
    url
  }
}
```

### सभी Projects fetch करो (with Social Links):
```groq
*[_type == "project"]{
  _id,
  title,
  "slug": slug.current,
  "imageUrl": image.asset->url,
  clientName,
  date,
  techStack,
  socialLinks[] {
    platform,
    url
  }
}
```

---

## ⚙️ React Hooks

### Hook 1: useProjectData - Single Project Fetch करना
```typescript
// hooks/useProjectData.ts
import { useEffect, useState } from 'react'
import { client } from '@/lib/sanityClient'

export function useProjectData(slug: string) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchProject = async () => {
      try {
        setLoading(true)
        const data = await client.fetch(
          `*[_type == "project" && slug.current == $slug][0]{
            _id,
            title,
            description,
            "imageUrl": image.asset->url,
            clientName,
            date,
            techStack,
            github,
            demo,
            "extraImages": extraImages[].asset->url,
            socialLinks[] {
              platform,
              url
            }
          }`,
          { slug }
        )
        setProject(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch project')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [slug])

  return { project, loading, error }
}
```

### Hook 2: useAllProjects - सभी Projects Fetch करना
```typescript
// hooks/useAllProjects.ts
import { useEffect, useState } from 'react'
import { client } from '@/lib/sanityClient'

export function useAllProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "project"] | order(date desc){
            _id,
            title,
            "slug": slug.current,
            "imageUrl": image.asset->url,
            clientName,
            date,
            techStack,
            socialLinks[] {
              platform,
              url
            }
          }
        `)
        setProjects(data)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return { projects, loading }
}
```

---

## 🎯 Components

### Component 1: ProjectSocialLinks - Social Links Display करो
```typescript
// components/ProjectSocialLinks.tsx
import React from 'react'

interface SocialLink {
  platform: string
  url: string
}

const socialIcons: Record<string, { icon: string; color: string }> = {
  github: { icon: '🐙', color: '#333' },
  linkedin: { icon: '💼', color: '#0077b5' },
  twitter: { icon: '𝕏', color: '#000' },
  facebook: { icon: 'f', color: '#1877f2' },
  instagram: { icon: '📷', color: '#e1306c' },
  dribbble: { icon: '🏀', color: '#ea4c89' },
  behance: { icon: '🎨', color: '#1769ff' },
  website: { icon: '🌐', color: '#0066cc' },
  youtube: { icon: '▶️', color: '#ff0000' },
}

export default function ProjectSocialLinks({ 
  socialLinks 
}: { 
  socialLinks: SocialLink[] 
}) {
  if (!socialLinks?.length) return null

  return (
    <div className="flex gap-4 mt-6">
      {socialLinks.map((link, idx) => {
        const platform = link.platform.toLowerCase()
        const info = socialIcons[platform] || { 
          icon: '🔗', 
          color: '#666' 
        }

        return (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={link.platform}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:scale-110 transition"
            style={{ backgroundColor: info.color + '20', color: info.color }}
          >
            {info.icon}
          </a>
        )
      })}
    </div>
  )
}
```

### Component 2: ProjectCard - Grid में Projects Display करो
```typescript
// components/ProjectCard.tsx
import Link from 'next/link'
import ProjectSocialLinks from './ProjectSocialLinks'

export default function ProjectCard({ project }) {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
      <img 
        src={project.imageUrl} 
        alt={project.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{project.clientName}</p>
        
        {project.techStack && (
          <div className="flex flex-wrap gap-2 mb-3">
            {project.techStack.slice(0, 3).map((tech, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link href={`/projects/${project.slug}`}>
            <a className="text-blue-600 hover:underline">View Details →</a>
          </Link>
          
          <ProjectSocialLinks socialLinks={project.socialLinks} />
        </div>
      </div>
    </div>
  )
}
```

---

## 📱 Complete Example

### Full Project Detail Page (`app/projects/[slug]/page.tsx`)
```typescript
"use client"

import React from 'react'
import { useProjectData } from '@/hooks/useProjectData'
import ProjectSocialLinks from '@/components/ProjectSocialLinks'

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const { project, loading, error } = useProjectData(params.slug)

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (error || !project) return <div className="text-center py-12 text-red-600">{error || 'Project not found'}</div>

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-600 mb-6">{project.clientName}</p>

      {/* Main Image */}
      {project.imageUrl && (
        <img 
          src={project.imageUrl} 
          alt={project.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
      )}

      {/* Description */}
      <div className="prose max-w-none mb-8">
        <p className="text-lg leading-relaxed">{project.description}</p>
      </div>

      {/* Social Links */}
      <div className="mb-8">
        <h3 className="font-bold mb-4">Connect with this project:</h3>
        <ProjectSocialLinks socialLinks={project.socialLinks} />
      </div>

      {/* Tech Stack */}
      {project.techStack && (
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4">Tech Stack</h3>
          <div className="flex flex-wrap gap-3">
            {project.techStack.map((tech, idx) => (
              <span 
                key={idx}
                className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="flex gap-4">
        {project.github && (
          <a 
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            View on GitHub
          </a>
        )}
        {project.demo && (
          <a 
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Live Demo
          </a>
        )}
      </div>

      {/* Extra Images/Gallery */}
      {project.extraImages && project.extraImages.length > 0 && (
        <div className="mt-12">
          <h3 className="font-bold text-lg mb-6">Website Layout</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.extraImages.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`Layout ${idx + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

### Projects Grid Page (`app/projects/page.tsx`)
```typescript
"use client"

import React from 'react'
import { useAllProjects } from '@/hooks/useAllProjects'
import ProjectCard from '@/components/ProjectCard'

export default function ProjectsPage() {
  const { projects, loading } = useAllProjects()

  if (loading) return <div className="text-center py-12">Loading projects...</div>

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-12">Our Projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  )
}
```

---

## ✅ Checklist

- [ ] Sanity client installed and configured
- [ ] Environment variables set in `.env.local`
- [ ] Hooks created in `/hooks` folder
- [ ] Components created in `/components` folder
- [ ] Project pages created in `/app/projects`
- [ ] Social links data added in Sanity schema
- [ ] Test project detail page with images and social links

---

## 🚀 Next Steps

1. **Styling**: Tailwind CSS का use करके अपने हिसाब से style करो
2. **Icons**: react-icons library add कर सकते हो better icons के लिए
3. **SEO**: Next.js Metadata API use करो
4. **Animation**: Framer Motion add करो smooth animations के लिए

---

## 📞 Support

किसी भी issue के लिए:
- Sanity documentation: https://www.sanity.io/docs
- Next.js documentation: https://nextjs.org/docs

**Happy Coding! 🎉**
