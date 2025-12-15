# Hire Me CTA Component

A reusable Call-To-Action component that can be managed through Sanity CMS.

## Features

- ✅ Reusable across all pages
- ✅ Sanity CMS integration for content management
- ✅ WhatsApp integration for direct contact
- ✅ Fallback to props if Sanity data unavailable
- ✅ Loading states

## Usage

### Basic Usage (with props)

```tsx
import HireMeCTA from "@/components/HireMeCTA";

<HireMeCTA text="Looking for a freelancer?" />
```

### Advanced Usage (with Sanity)

```tsx
// Uses the first active CTA from Sanity
<HireMeCTA />

// Uses a specific CTA by ID
<HireMeCTA ctaId="your-cta-document-id" />
```

### Props

- `text`: Default CTA text (fallback)
- `link`: Default link URL (fallback)
- `whatsappNumber`: WhatsApp number for direct contact
- `className`: CSS classes for styling
- `ctaId`: Specific Sanity document ID to fetch

## Sanity Schema Setup

1. Add the `sanity-cta-schema.js` file to your Sanity schemas folder
2. Create a new document of type "Hire Me CTA"
3. Fill in the fields:
   - **Title**: Internal name (not displayed)
   - **CTA Text**: Text before "Hire Me →"
   - **Link URL**: Where the link goes (/services, /contact, etc.)
   - **WhatsApp Number**: Number without + or spaces (e.g., 919876543210)
   - **Active**: Whether this CTA is currently active

## WhatsApp Integration

When a WhatsApp number is provided, clicking "Hire Me →" will:
1. Open WhatsApp with a pre-filled message
2. Message: "Hi! I'm interested in your freelance services."

## Examples

### Experience Section
```tsx
<HireMeCTA text="Looking for a reliable freelancer?" />
```

### Project Detail Page
```tsx
<HireMeCTA text="Want a similar project?" />
```

### About Page
```tsx
<HireMeCTA />
```

## Current Implementation

The component is currently used in:
- `ExperienceClient.tsx` - Experience section on About page
- `ProjectDetailClientFixed.tsx` - Individual project pages

## Adding to New Locations

Simply import and use the component:

```tsx
import HireMeCTA from "@/components/HireMeCTA";

// In your component
<HireMeCTA text="Custom message here" />
```