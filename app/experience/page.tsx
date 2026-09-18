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
    <div className="page-wrap">
      <div className="max-w-6xl w-full mx-auto">
        <ExperienceClient experiences={experiences} />
      </div>
    </div>
  );
}

export const metadata = {
  title: "Experience",
  description: "My work history as a freelance web developer and WordPress specialist, including clients like IndiaSpend, BoomLive and India Food Network.",
};
