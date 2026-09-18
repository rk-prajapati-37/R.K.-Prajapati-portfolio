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
    <div className="page-wrap">
      <div className="max-w-6xl w-full mx-auto">
        <SkillsHeaderClient />

        <div className="mt-6">
          <SkillsGridClient skills={skills} columns={2} />
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Skills",
  description: "Technologies and tools I use: WordPress, Elementor, React, Next.js, JavaScript, Tailwind CSS, Shopify and more.",
};
