'use client';

import { useState, useEffect } from 'react';
import { client } from '@/lib/sanityClient';
import { createImageUrlBuilder } from '@sanity/image-url';

interface SocialPost {
  _id: string;
  postType: 'image' | 'video' | 'link' | 'text';
  content?: string;
  caption?: string;
  image?: any;
  featuredImage?: any;
  videoUrl?: string;
  linkUrl?: string;
  hashtags?: string[];
  createdAt: string;
  scheduledDate?: string;
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  platform?: {
    platform: string;
    url: string;
  };
}

const postsQuery = `*[_type == "socialPost" && status == "published"] | order(createdAt desc) {
  _id,
  postType,
  content,
  caption,
  title,
  // include nested asset refs for debugging
  featuredImage{..., asset->{_id, _ref, url}},
  image{..., asset->{_id, _ref, url}},
  videoUrl,
  linkUrl,
  hashtags,
  status,
  createdAt,
  scheduledDate,
  platform -> {
    platform,
    url
  }
}`;

const builder = createImageUrlBuilder(client);

const urlFor = (source: any) => {
  if (!source) return null;
  // If the source already contains a direct URL (asset.url), use it
  if (source?.asset?.url && typeof source.asset.url === 'string') {
    return source.asset.url;
  }
  // If the source is already a full URL string, return it as-is
  if (typeof source === 'string' && (source.startsWith('http') || source.startsWith('//'))) {
    return source;
  }

  try {
    return builder.image(source);
  } catch (err) {
    console.warn('Could not build image URL for source:', source, err);
    return null;
  }
};

export default function SocialPosts() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await client.fetch(postsQuery);
        console.log('SocialPosts: fetched posts', data);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching social posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const platforms = ['all', ...new Set(posts.map(p => p.platform?.platform).filter(Boolean))];

  const filteredPosts = selectedPlatform === 'all' 
    ? posts 
    : posts.filter(p => p.platform?.platform === selectedPlatform);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'draft':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      case 'scheduled':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'archived':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const truncateContent = (text: string, minWords: number = 50, maxWords: number = 75) => {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const formatUrlForDisplay = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url.substring(0, 50) + '...';
    }
  };

  const renderPostContent = (post: SocialPost) => {
    switch (post.postType) {
      case 'image': {
        const imgBuilder = urlFor(post.image);
        const src = typeof imgBuilder === 'string' ? imgBuilder : imgBuilder?.width?.(400)?.url?.();
        if (!src) return null;

        return (
          <div className="mb-4">
            <img
              src={src}
              alt="Post"
              className="w-full rounded-lg object-cover max-h-96"
            />
          </div>
        );
      }
      case 'video':
        return (
          <div className="mb-4 aspect-video rounded-lg overflow-hidden">
            <iframe
              src={post.videoUrl}
              title="Social media video"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        );
      case 'link':
        return null;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading posts...</div>;
  }

  return (
    <div className="py-16 ">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <p className="text-red-600 font-bold text-sm tracking-widest uppercase">
              Latest Posts & Updates
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-white">
            Social Media Feed
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Follow my latest social media posts and updates from various platforms
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-12 flex-wrap justify-center items-center">
          {platforms.map((platform) => (
            <button
              key={platform || 'all'}
              onClick={() => setSelectedPlatform(platform || 'all')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedPlatform === platform
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-red-600 dark:hover:border-red-500'
              }`}
            >
              {(platform || 'all').charAt(0).toUpperCase() + (platform || 'all').slice(1)}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No posts found for this platform.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="card h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Featured / fallback Image */}
                {(() => {
                  const displayImage = post.featuredImage || (post.postType === 'image' ? post.image : null);
                  if (!displayImage) return (
                    <div className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 h-48 flex-shrink-0">
                      <img src="/images/project1.jpg" alt="Placeholder" className="w-full h-full object-cover" />
                    </div>
                  );

                  const imgBuilder = urlFor(displayImage);
                  const src = typeof imgBuilder === 'string' ? imgBuilder : imgBuilder?.width?.(800)?.url?.();

                  if (!src) {
                    console.warn('SocialPosts: could not build image src for post', post._id, displayImage);
                    return (
                      <div className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 h-48 flex-shrink-0">
                        <img src="/images/project1.jpg" alt="Placeholder" className="w-full h-full object-cover" />
                      </div>
                    );
                  }

                  // If link exists, wrap with anchor
                  const Wrapper: any = (props: any) => (
                    post.linkUrl || post.platform?.url
                      ? <a href={post.linkUrl || post.platform?.url || '#'} target="_blank" rel="noopener noreferrer" className="block relative overflow-hidden h-48 flex-shrink-0 hover:opacity-90 transition-opacity">{props.children}</a>
                      : <div className="relative overflow-hidden h-48 flex-shrink-0">{props.children}</div>
                  );

                  return (
                    <Wrapper>
                      <img src={src} alt={post.caption || 'Featured'} className="w-full h-full object-cover" />
                    </Wrapper>
                  );
                })()}

                {/* Content Container */}
                <div className="p-2 flex-grow flex flex-col">
                  {/* Platform Badge */}
                  <div className="mb-3">
                    {post.platform?.platform && (
                      <a
                        href={post.platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 text-xs px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer border border-red-200 dark:border-red-700"
                      >
                        {post.platform.platform.toUpperCase()}
                      </a>
                    )}
                  </div>

                  {/* Caption */}
                  {post.caption && (
                    <a
                      href={post.linkUrl || post.platform?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-bold text-gray-800 dark:text-white mb-2 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                        lineHeight: '1.25rem',
                        maxHeight: '2.6rem'
                      }}
                    >
                      {post.caption}
                    </a>
                  )}

                  {/* Content */}
                  {post.content && (
                    <p
                      className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                        lineHeight: '1.25rem',
                        maxHeight: '3.9rem'
                      }}
                    >
                      {truncateContent(post.content)}
                    </p>
                  )}

                  {/* Hashtags */}
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 line-clamp-2 overflow-hidden">
                      {post.hashtags.slice(0, 4).map((tag, idx) => (
                        <a
                          key={idx}
                          href={`https://instagram.com/explore/tags/${tag.replace('#', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors whitespace-nowrap"
                        >
                          #{tag.replace('#', '')}
                        </a>
                      ))}
                      {post.hashtags.length > 4 && (
                        <span className="px-3 py-1 text-gray-400 dark:text-gray-500 text-xs font-semibold whitespace-nowrap">
                          +{post.hashtags.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-4 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(post.createdAt)}
                    </div>
                    {(post.linkUrl || post.platform?.url) && post.platform && (
                      <a
                        href={post.linkUrl || post.platform?.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                      >
                        View on {post.platform.platform} →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
