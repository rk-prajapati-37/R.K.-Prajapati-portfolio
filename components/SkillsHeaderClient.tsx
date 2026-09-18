"use client";

import PageHeader from "./PageHeader";

export default function SkillsHeaderClient() {
  return (
    <PageHeader
      eyebrow="Skills"
      title="Technical Expertise"
      subtitle="Technologies and tools I use to bring ideas to life"
      crumbs={[{ label: "About", href: "/about" }, { label: "Skills" }]}
    />
  );
}
