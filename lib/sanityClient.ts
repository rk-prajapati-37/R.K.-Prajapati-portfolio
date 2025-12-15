import { createClient, SanityClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

let client: SanityClient;

try {
  if (!projectId) {
    throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID not set");
  }

  client = createClient({
    projectId,
    dataset,
    apiVersion: "2023-05-03",
    useCdn: true, // ✅ CDN ON (IMPORTANT)
  });
} catch (error) {
  console.warn(
    "⚠️ Sanity client not configured correctly. Returning empty data."
  );

  client = {
    fetch: async () => [],
  } as unknown as SanityClient;
}

export { client };
