import { getFeaturedProjects } from "../lib/queries";
import HeroSection from "../components/HeroSection";
import HomeProjectsSection from "../components/HomeProjectsSection";
import HireMeSection from "../components/HireMeSection";
import WhyChooseMe from "../components/WhyChooseMe";

export default async function HomePage() {
  const projects = await getFeaturedProjects(6);

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Projects Section */}
      <HomeProjectsSection projects={projects} />

      {/* Hire Me CTA Section */}
      <HireMeSection />

      {/* Why Choose Me Section */}
      <WhyChooseMe />
    </div>
  );
}
