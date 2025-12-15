import { client } from "../../lib/sanityClient";
import AboutClient from "./AboutClient";
import { certificatesData } from "./data/certificatesData";

// Revalidate every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60;

export default async function AboutPage() {
  let skills: any[] = [];
  let experiences: any[] = [];
  let educations: any[] = [];
  let certificates: any[] = [];

  try {
    skills = await client.fetch(`*[_type == "skill"] | order(order asc){ _id, name, level, percent, "icon": icon.asset->url, order }`);
  } catch (err) {
    console.error("Failed to fetch skills:", err);
  }

  try {
    experiences = await client.fetch(`*[_type == "experience"] | order(order asc){ _id, position, company, location, startDate, endDate, isCurrent, "logo": logo.asset->url, description, companyUrl, order }`);
  } catch (err) {
    console.error("Failed to fetch experiences:", err);
  }

  try {
    educations = await client.fetch(`*[_type == "education"] | order(order asc){ _id, degree, institution, location, startDate, endDate, "logo": logo.asset->url, description, institutionUrl, order }`);
  } catch (err) {
    console.error("Failed to fetch educations:", err);
  }

  try {
    certificates = await client.fetch(`*[_type == "certificate"] | order(order asc){ _id, title, issuer, date, "certificateImage": certificateImage.asset->url, url, description, order }`);
  } catch (err) {
    console.error("Failed to fetch certificates:", err);
  }

  // Fallback to static data if no certificates from Sanity
  if (!certificates || certificates.length === 0) {
    certificates = certificatesData.map((cert, index) => ({
      _id: `fallback-${index}`,
      title: cert.title,
      certificateImage: cert.image,
      order: index,
    }));
  }

  return <AboutClient skills={skills} experiences={experiences} educations={educations} certificates={certificates} />;
}
