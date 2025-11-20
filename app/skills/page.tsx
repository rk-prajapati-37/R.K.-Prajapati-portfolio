import { client } from "../../lib/sanityClient";
import SkillsListClient from "@/components/SkillsListClient";
import SkillsHeaderClient from "@/components/SkillsHeaderClient";

export default async function Skills() {
  let skills: any[] = [];

  try {
    skills = await client.fetch(`*[_type == "skill"]{ _id, name, level, percent, "icon": icon.asset->url }`);
  } catch (err) {
    console.error("Failed to fetch skills:", err);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br py-10 ">
      <SkillsHeaderClient />

      <div className="max-w-3xl mx-auto space-y-4">
        <SkillsListClient skills={skills} />
      </div>
    </div>
  );
}
