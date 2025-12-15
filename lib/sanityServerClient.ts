// lib/sanityServerClient.ts
import { createClient } from '@sanity/client'

export const sanityServerClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // 🔥 REQUIRED
  useCdn: false, // ❌ WRITE ke liye CDN off
})
