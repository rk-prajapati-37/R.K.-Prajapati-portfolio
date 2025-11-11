import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

let client;

// Only create the client if projectId is available
// This prevents build-time errors when env vars are missing
if (projectId) {
  client = createClient({
    projectId,
    dataset,
    apiVersion: "2025-11-01",
    useCdn: false,
    token: process.env.SANITY_API_TOKEN
  });
} else {
  // Create a mock/proxy client that warns when used but doesn't crash at module load
  console.warn("⚠️  Sanity client not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID to enable content fetching.");
  
  client = {
    fetch: async () => {
      throw new Error(
        "Sanity client is not configured. Make sure NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are set in environment variables."
      );
    }
  };
}

export { client };
