import React from 'react'

interface SocialLink {
  platform: string
  url: string
}

interface ProjectSocialLinksProps {
  socialLinks?: SocialLink[]
}

// Platform ke liye icons aur colors
const socialIconsMap: Record<string, { icon: string; color: string; label: string }> = {
  github: { 
    icon: '🐙', 
    color: '#333333',
    label: 'GitHub'
  },
  linkedin: { 
    icon: '💼', 
    color: '#0077b5',
    label: 'LinkedIn'
  },
  twitter: { 
    icon: '𝕏', 
    color: '#000000',
    label: 'Twitter/X'
  },
  x: { 
    icon: '𝕏', 
    color: '#000000',
    label: 'Twitter/X'
  },
  facebook: { 
    icon: 'f', 
    color: '#1877f2',
    label: 'Facebook'
  },
  instagram: { 
    icon: '📷', 
    color: '#e1306c',
    label: 'Instagram'
  },
  dribbble: { 
    icon: '🏀', 
    color: '#ea4c89',
    label: 'Dribbble'
  },
  behance: { 
    icon: '🎨', 
    color: '#1769ff',
    label: 'Behance'
  },
  website: { 
    icon: '🌐', 
    color: '#0066cc',
    label: 'Website'
  },
  portfolio: { 
    icon: '🌐', 
    color: '#0066cc',
    label: 'Portfolio'
  },
  youtube: { 
    icon: '▶️', 
    color: '#ff0000',
    label: 'YouTube'
  },
  figma: { 
    icon: '🎨', 
    color: '#f24e1e',
    label: 'Figma'
  },
  codepen: { 
    icon: '✏️', 
    color: '#000000',
    label: 'CodePen'
  },
}

/**
 * ProjectSocialLinks Component
 * 
 * Sanity se aane wale social links ko display karta hai
 * Har platform ke liye custom icon aur color
 * 
 * @param socialLinks - Sanity se aane wala array
 * @example
 * <ProjectSocialLinks socialLinks={[
 *   { platform: 'github', url: 'https://github.com/...' },
 *   { platform: 'linkedin', url: 'https://linkedin.com/...' }
 * ]} />
 */
export default function ProjectSocialLinks({ 
  socialLinks = [] 
}: ProjectSocialLinksProps) {
  // Agar koi social link nahi hai toh nothing return karo
  if (!socialLinks || socialLinks.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-3">
      {socialLinks.map((link, idx) => {
        // Platform name ko lowercase karo matching ke liye
        const platformKey = link.platform?.toLowerCase().trim() || ''
        
        // Default icon agar platform match nahi ho
        const linkInfo = socialIconsMap[platformKey] || {
          icon: '🔗',
          color: '#666666',
          label: link.platform || 'Link'
        }

        return (
          <a
            key={`${link.platform}-${idx}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={linkInfo.label}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg"
            style={{
              backgroundColor: linkInfo.color + '15', // 15% opacity background
              color: linkInfo.color,
              border: `2px solid ${linkInfo.color}40`, // 40% opacity border
            }}
            aria-label={`Visit on ${linkInfo.label}`}
          >
            <span className="text-lg">{linkInfo.icon}</span>
          </a>
        )
      })}
    </div>
  )
}

/**
 * Sanity Schema Example:
 * 
 * {
 *   name: 'socialLinks',
 *   title: 'Social Links',
 *   type: 'array',
 *   of: [
 *     {
 *       type: 'object',
 *       fields: [
 *         {
 *           name: 'platform',
 *           title: 'Platform',
 *           type: 'string',
 *           options: {
 *             list: [
 *               { title: 'GitHub', value: 'github' },
 *               { title: 'LinkedIn', value: 'linkedin' },
 *               { title: 'Twitter', value: 'twitter' },
 *               { title: 'Facebook', value: 'facebook' },
 *               { title: 'Instagram', value: 'instagram' },
 *               { title: 'Dribbble', value: 'dribbble' },
 *               { title: 'Behance', value: 'behance' },
 *               { title: 'Website', value: 'website' },
 *               { title: 'YouTube', value: 'youtube' },
 *               { title: 'Figma', value: 'figma' },
 *               { title: 'CodePen', value: 'codepen' },
 *             ]
 *           }
 *         },
 *         {
 *           name: 'url',
 *           title: 'URL',
 *           type: 'url',
 *           validation: (Rule: any) => Rule.uri({ 
 *             scheme: ['http', 'https'] 
 *           })
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
