import { createClient } from "next-sanity";
import type { SanityClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_AUTH_TOKEN; // Server-side token for write operations

let sanityServerClient: SanityClient;

try {
  if (!projectId) {
    throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID not set");
  }

  if (!token) {
    throw new Error("SANITY_AUTH_TOKEN not set for server operations");
  }

  sanityServerClient = createClient({
    projectId,
    dataset,
    apiVersion: "2023-05-03",
    useCdn: false, // Server operations should not use CDN
    token, // Required for write operations
  });
} catch (error) {
  console.warn(
    "⚠️ Sanity server client not configured correctly. Server operations will fail."
  );

  // Create a dummy client that throws errors for write operations
  sanityServerClient = {
    create: async () => {
      throw new Error("Sanity server client not configured");
    },
  } as any;
}

export { sanityServerClient };