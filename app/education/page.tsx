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
    <div className="page-wrap">
      <div className="max-w-6xl w-full mx-auto">
        <EducationClient educations={educations} />
      </div>
    </div>
  );
}

export const metadata = {
  title: "Education",
  description: "Academic background of R.K. Prajapati, BSc Computer Science, Mumbai University.",
};
