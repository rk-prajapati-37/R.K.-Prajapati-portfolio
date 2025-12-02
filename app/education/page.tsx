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
    <div className="min-h-screen bg-gradient-to-br py-10 ">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Education</h2>
        <EducationClient educations={educations} />
      </div>
    </div>
  );
}
