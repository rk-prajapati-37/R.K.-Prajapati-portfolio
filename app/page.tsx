import { getFeaturedProjects } from "../lib/queries";
import HeroSection from "../components/HeroSection";
import HomeProjectsSection from "../components/HomeProjectsSection";
import HireMeSection from "../components/HireMeSection";
import WhyChooseMe from "../components/WhyChooseMe";
import TrustedBy from "../components/TrustedBy";
import HomeTestimonials from "../components/HomeTestimonials";
import { client } from "../lib/sanityClient";

export const revalidate = 60;

export default async function HomePage() {
  const projects = await getFeaturedProjects(6);

  let heroBadges: { _id: string; name: string; icon?: string }[] = [];
  try {
    heroBadges = await client.fetch(
      `*[_type == "skill" && showInHero == true] | order(order asc, name asc)[0...6]{ _id, name, "icon": icon.asset->url }`
    );
  } catch (err) {
    console.error("Failed to fetch hero badges:", err);
  }

  let clients: { _id: string; name: string; logo?: string; website?: string }[] = [];
  try {
    clients = await client.fetch(
      `*[_type == "client" && active == true] | order(order asc, name asc){ _id, name, website, "logo": logo.asset->url }`
    );
  } catch (err) {
    console.error("Failed to fetch clients:", err);
  }

  let testimonials: any[] = [];
  try {
    testimonials = await client.fetch(
      `*[_type == "testimonial"] | order(_createdAt desc){ _id, name, feedback, role, company, "image": image.asset->url }`
    );
  } catch (err) {
    console.error("Failed to fetch testimonials:", err);
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection badges={heroBadges} />

      {/* Client names strip */}
      <TrustedBy clients={clients} />

      {/* Projects Section */}
      <HomeProjectsSection projects={projects} />

      {/* Testimonials */}
      <HomeTestimonials testimonials={testimonials} />

      {/* Hire Me CTA Section */}
      <HireMeSection />

      {/* Why Choose Me Section */}
      <WhyChooseMe />
    </div>
  );
}
