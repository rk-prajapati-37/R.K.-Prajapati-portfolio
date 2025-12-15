import { client } from "@/lib/sanityClient";
import EducationClient from "@/components/EducationClientFixed";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function EducationPage() {
  let educations: any[] = [];
  try {
    educations = await client.fetch(`*[_type == "education"] | order(order asc){ _id, degree, institution, location, startDate, endDate, "logo": logo.asset->url, description, order }`);
  } catch (err) {
    console.error("Failed to fetch educations:", err);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br py-16 flex items-center justify-center px-6 md:px-10">
      <div className="max-w-6xl w-full">
        <EducationClient educations={educations} />
      </div>
    </div>
  );
}
