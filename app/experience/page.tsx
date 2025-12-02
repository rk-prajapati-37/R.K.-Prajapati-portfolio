import { client } from "@/lib/sanityClient";
import ExperienceClient from "@/components/ExperienceClient";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function ExperiencePage() {
  let experiences: any[] = [];
  try {
    experiences = await client.fetch(`*[_type == "experience"] | order(order asc){ _id, position, company, location, startDate, endDate, isCurrent, "logo": logo.asset->url, description, order }`);
  } catch (err) {
    console.error("Failed to fetch experiences:", err);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  pt-12 pb-8 px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Experience</h2>
        <ExperienceClient experiences={experiences} />
      </div>
    </div>
  );
}
