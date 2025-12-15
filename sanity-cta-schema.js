// This is a Sanity schema file that you can add to your Sanity studio
// Add this to your schemas folder in your Sanity project

export default {
  name: 'hireMeCTA',
  title: 'Hire Me CTA',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal title for this CTA (not displayed)'
    },
    {
      name: 'text',
      title: 'CTA Text',
      type: 'string',
      description: 'The text that appears before "Hire Me →"',
      initialValue: 'Available for freelance work.'
    },
    {
      name: 'link',
      title: 'Link URL',
      type: 'string',
      description: 'URL to link to (e.g., /services, /contact)',
      initialValue: '/services'
    },
    {
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'WhatsApp number for direct contact (without + or spaces, e.g., 919876543210)',
      placeholder: '919876543210'
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Whether this CTA is currently active',
      initialValue: true
    }
  ],
  preview: {
    select: {
      title: 'title',
      text: 'text',
      isActive: 'isActive'
    },
    prepare({ title, text, isActive }) {
      return {
        title: title || 'Hire Me CTA',
        subtitle: `${text} ${isActive ? '(Active)' : '(Inactive)'}`
      }
    }
  }
};