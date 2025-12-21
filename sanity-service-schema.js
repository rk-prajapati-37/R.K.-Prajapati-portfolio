// This is a Sanity schema file for Services
// Add this to your schemas folder in your Sanity project

export default {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Service Title',
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
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required()
    },
    {
      name: 'startingPrice',
      title: 'Starting Price',
      type: 'string',
      description: 'e.g., "$500", "₹10,000", "Contact for pricing"'
    },
    {
      name: 'deliveryTime',
      title: 'Delivery Time',
      type: 'string',
      description: 'e.g., "2-3 days", "1 week", "2 weeks"'
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of features included in this service'
    },
    {
      name: 'whatsappText',
      title: 'WhatsApp Message Text',
      type: 'text',
      rows: 2,
      description: 'Pre-filled message for WhatsApp contact'
    },
    {
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description: 'Select projects related to this service'
    }
  ],
  preview: {
    select: {
      title: 'title',
      price: 'startingPrice',
      description: 'shortDescription'
    },
    prepare({ title, price, description }) {
      return {
        title: title,
        subtitle: price ? `Starting at ${price}` : 'Price not set',
        description: description
      }
    }
  }
}