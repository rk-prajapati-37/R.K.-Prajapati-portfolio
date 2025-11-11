import { createClient, SanityClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

let client: SanityClient;

// Only create the client if projectId is available
// This prevents build-time errors when env vars are missing
try {
  if (projectId) {
    client = createClient({
      projectId,
      dataset,
      apiVersion: "2025-11-01",
      useCdn: false,
      token: process.env.SANITY_API_TOKEN
    });
  } else {
    throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID not set");
  }
} catch (error) {
  // Create a mock client that warns when used but doesn't crash at module load
  console.warn("⚠️  Sanity client not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID to enable content fetching.");
  
  client = {
    fetch: async (query: string) => {
      throw new Error(
        "Sanity client is not configured. Make sure NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are set in environment variables."
      );
    }
  } as unknown as SanityClient;
}

export { client };
