// lib/queries.ts
import { client } from './sanityClient';

const options = { next: { revalidate: 3600 } }; // Optional fallback

export async function getAllBlogs() {
  return client.fetch(
    `*[_type == "blog"] | order(_createdAt desc)`,
    {},
    { ...options, next: { tags: ['blog'] } }
  );
}

export async function getAllProjects() {
  return client.fetch(
    `*[_type == "project"] | order(_createdAt desc)`,
    {},
    { ...options, next: { tags: ['projects'] } }
  );
}