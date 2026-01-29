export const socialMediaSchema = {
  name: 'socialMedia',
  title: 'Social Media Links',
  type: 'document',
  fields: [
    {
      name: 'platform',
      title: 'Platform Name',
      type: 'string',
      options: {
        list: [
          { title: 'Facebook', value: 'facebook' },
          { title: 'Twitter / X', value: 'twitter' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'GitHub', value: 'github' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'TikTok', value: 'tiktok' },
          { title: 'WhatsApp', value: 'whatsapp' },
          { title: 'Telegram', value: 'telegram' },
          { title: 'Pinterest', value: 'pinterest' },
          { title: 'Snapchat', value: 'snapchat' },
          { title: 'Discord', value: 'discord' },
          { title: 'Twitch', value: 'twitch' },
          { title: 'Reddit', value: 'reddit' },
          { title: 'Medium', value: 'medium' },
          { title: 'Dribbble', value: 'dribbble' },
          { title: 'Behance', value: 'behance' },
          { title: 'Figma', value: 'figma' },
          { title: 'Personal Website', value: 'website' },
          { title: 'Blog', value: 'blog' },
          { title: 'Email', value: 'email' },
          { title: 'Phone', value: 'phone' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'url',
      title: 'Profile URL / Link',
      type: 'url',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which to display the icon (1, 2, 3...)',
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Show this link on the website?',
    },
  ],
  preview: {
    select: {
      title: 'platform',
      url: 'url',
    },
    prepare({ title, url }: any) {
      return {
        title: `${title} - ${url}`,
        subtitle: url,
      };
    },
  },
};

export const socialProfileSchema = {
  name: 'socialProfile',
  title: 'Social Media Profile Details',
  type: 'document',
  fields: [
    {
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'Instagram', value: 'instagram' },
          { title: 'Twitter / X', value: 'twitter' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'Facebook', value: 'facebook' },
          { title: 'TikTok', value: 'tiktok' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'GitHub', value: 'github' },
          { title: 'Twitch', value: 'twitch' },
          { title: 'Medium', value: 'medium' },
          { title: 'Pinterest', value: 'pinterest' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'username',
      title: 'Username',
      type: 'string',
      description: 'Your username/handle (e.g., @terehandle)',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'profileUrl',
      title: 'Profile URL',
      type: 'url',
      description: 'Full profile link (e.g., https://instagram.com/terehandle)',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'profilePicture',
      title: 'Profile Picture',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Your profile/avatar image',
    },
    {
      name: 'bio',
      title: 'Bio / About',
      type: 'text',
      rows: 3,
      description: 'Your profile bio (e.g., Developer | Designer | Content Creator)',
    },
    {
      name: 'followers',
      title: 'Followers Count',
      type: 'number',
      description: 'Total number of followers',
    },
    {
      name: 'totalPosts',
      title: 'Total Posts',
      type: 'number',
      description: 'Total number of posts published',
    },
    {
      name: 'verified',
      title: 'Verified Badge',
      type: 'boolean',
      description: 'Is this account verified? ✓',
      initialValue: false,
    },
    {
      name: 'engagementRate',
      title: 'Engagement Rate (%)',
      type: 'number',
      description: 'Average engagement rate as percentage (e.g., 3.5)',
    },
    {
      name: 'description',
      title: 'Additional Description',
      type: 'text',
      rows: 4,
      description: 'Additional details about this profile',
    },
    {
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Display this profile on the website?',
    },
  ],
  preview: {
    select: {
      title: 'username',
      platform: 'platform',
      media: 'profilePicture',
    },
    prepare({ title, platform, media }: any) {
      return {
        title: `${platform?.toUpperCase()} - ${title}`,
        subtitle: `@${title}`,
        media: media,
      };
    },
  },
};

export const socialPostSchema = {
  name: 'socialPost',
  title: 'Social Media Posts',
  type: 'document',
  fields: [
    {
      name: 'postType',
      title: 'Post Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
          { title: 'Link', value: 'link' },
          { title: 'Text', value: 'text' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'platform',
      title: 'Posted On Platform',
      type: 'reference',
      to: [{ type: 'socialMedia' }],
      description: 'Which platform is this post from?',
    },
    {
      name: 'caption',
      title: 'Caption / Description',
      type: 'text',
      rows: 3,
      description: 'Short description or caption for the post',
    },
    {
      name: 'content',
      title: 'Full Content',
      type: 'text',
      rows: 5,
      description: 'Full text content of the post',
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Main image for the post (displayed prominently)',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }: any) => parent?.postType !== 'image',
    },
    {
      name: 'videoUrl',
      title: 'Video URL (YouTube/Vimeo embed)',
      type: 'url',
      hidden: ({ parent }: any) => parent?.postType !== 'video',
      description: 'YouTube or Vimeo embed URL',
    },
    {
      name: 'linkUrl',
      title: 'Post Link / URL',
      type: 'url',
      description: 'Add a link to this post (available for all post types)',
    },
    {
      name: 'hashtags',
      title: 'Hashtags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add hashtags without # symbol',
    },
    {
      name: 'createdAt',
      title: 'Posted Date',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Published', value: 'published' },
          { title: 'Draft', value: 'draft' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'published',
    },
  ],
  preview: {
    select: {
      title: 'caption',
      media: 'image',
      platform: 'platform.platform',
    },
    prepare({ title, media, platform }: any) {
      return {
        title: title || 'Untitled Post',
        subtitle: platform,
        media: media,
      };
    },
  },
};
