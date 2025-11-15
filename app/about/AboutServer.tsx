import { client } from "../../lib/sanityClient";
import AboutClient from "./AboutClient";

export default async function AboutPage() {
  let skills: any[] = [];
  try {
    skills = await client.fetch(`*[_type == "skill"]{ _id, name, level, percent, "icon": icon.asset->url }`);
  } catch (err) {
    console.error("Failed to fetch skills:", err);
  }

  return <AboutClient skills={skills} />;
}
