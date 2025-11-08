import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId) {
  console.error("❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
}
if (!dataset) {
  console.error("❌ Missing NEXT_PUBLIC_SANITY_DATASET in .env.local");
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-11-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});
