'use client';

import { useState, useEffect } from 'react';
import { sanityServerClient } from '@/lib/sanityServerClient';

interface SocialLink {
  _id: string;
  platform: string;
  url: string;
  displayOrder: number;
}

const query = `*[_type == "socialMedia" && active == true] | order(displayOrder asc) {
  _id,
  platform,
  url,
  displayOrder
}`;

const platformColors: { [key: string]: string } = {
  facebook: 'bg-blue-600 hover:bg-blue-700',
  twitter: 'bg-blue-400 hover:bg-blue-500',
  instagram: 'bg-pink-600 hover:bg-pink-700',
  linkedin: 'bg-blue-700 hover:bg-blue-800',
  github: 'bg-gray-800 hover:bg-gray-900',
  youtube: 'bg-red-600 hover:bg-red-700',
  tiktok: 'bg-black hover:bg-gray-800',
  whatsapp: 'bg-green-600 hover:bg-green-700',
  telegram: 'bg-blue-500 hover:bg-blue-600',
  pinterest: 'bg-red-700 hover:bg-red-800',
  snapchat: 'bg-yellow-400 hover:bg-yellow-500 text-black',
  discord: 'bg-indigo-600 hover:bg-indigo-700',
  twitch: 'bg-purple-600 hover:bg-purple-700',
  reddit: 'bg-orange-600 hover:bg-orange-700',
  medium: 'bg-gray-900 hover:bg-black',
  dribbble: 'bg-pink-500 hover:bg-pink-600',
  behance: 'bg-blue-600 hover:bg-blue-700',
  figma: 'bg-purple-500 hover:bg-purple-600',
  website: 'bg-gray-700 hover:bg-gray-800',
  blog: 'bg-purple-700 hover:bg-purple-800',
  email: 'bg-red-500 hover:bg-red-600',
  phone: 'bg-green-500 hover:bg-green-600',
};

const platformEmojis: { [key: string]: string } = {
  facebook: '📘',
  twitter: '𝕏',
  instagram: '📷',
  linkedin: '💼',
  github: '🐙',
  youtube: '📺',
  tiktok: '♪',
  whatsapp: '💬',
  telegram: '✈️',
  pinterest: '📌',
  snapchat: '👻',
  discord: '💬',
  twitch: '🎮',
  reddit: '🔗',
  medium: '📝',
  dribbble: '🎨',
  behance: '🎭',
  figma: '🎨',
  website: '🌐',
  blog: '📝',
  email: '✉️',
  phone: '📱',
};

export default function SocialLinks() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const data = await sanityServerClient.fetch(query);
        setSocialLinks(data);
      } catch (error) {
        console.error('Error fetching social links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading social links...</div>;
  }

  if (socialLinks.length === 0) {
    return <div className="text-center py-4 text-gray-500">No social media links added yet.</div>;
  }

  return (
    <div className="flex justify-center gap-4 my-8 flex-wrap">
      {socialLinks.map((link) => (
        <a
          key={link._id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          title={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
          className={`
            ${platformColors[link.platform] || 'bg-gray-600 hover:bg-gray-700'}
            text-white text-2xl w-12 h-12 
            rounded-full flex items-center justify-center 
            transition-transform duration-200 hover:scale-110
            shadow-lg
          `}
        >
          {platformEmojis[link.platform] || '🔗'}
        </a>
      ))}
    </div>
  );
}
