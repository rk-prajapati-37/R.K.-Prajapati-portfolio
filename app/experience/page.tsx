import { client } from "@/lib/sanityClient";
import ExperienceClient from "@/components/ExperienceClient";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function ExperiencePage() {
  let experiences: any[] = [];
  try {
    experiences = await client.fetch(`*[_type == "experience"] | order(order asc){ _id, position, company, location, startDate, endDate, isCurrent, "logo": logo.asset->url, description, companyUrl, order }`);
  } catch (err) {
    console.error("Failed to fetch experiences:", err);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br py-16 flex items-center justify-center px-6 md:px-10">
      <div className="max-w-6xl w-full">
        <ExperienceClient experiences={experiences} />
      </div>
    </div>
  );
}
