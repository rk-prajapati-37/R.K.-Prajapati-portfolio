import { client } from "../../lib/sanityClient";
import SkillsGridClient from "@/components/SkillsGridClient";
import SkillsHeaderClient from "@/components/SkillsHeaderClient";

export default async function Skills() {
  let skills: any[] = [];

  try {
    skills = await client.fetch(`*[_type == "skill"]{ _id, name, level, percent, "icon": icon.asset->url }`);
  } catch (err) {
    console.error("Failed to fetch skills:", err);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br py-16 flex items-center justify-center px-6 md:px-10">
      <div className="max-w-6xl w-full">
        <SkillsHeaderClient />

        <div className="mt-6">
          <SkillsGridClient skills={skills} columns={2} />
        </div>
      </div>
    </div>
  );
}
