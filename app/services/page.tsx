import { client } from "@/lib/sanityClient";
import ServicesView, { type Service } from "@/components/ServicesView";

// Refresh every minute so Studio edits show up quickly
export const revalidate = 60;

export default async function ServicesPage() {
  let services: Service[] = [];
  let testimonials: any[] = [];

  try {
    services = await client.fetch(`
      *[_type == "service"] | order(order asc, _createdAt asc) {
        _id,
        title,
        "slug": slug.current,
        startingPrice,
        deliveryTime,
        shortDescription,
        features,
        whatsappText,
        popular
      }
    `);
  } catch (err) {
    console.error("Failed to fetch services:", err);
  }

  try {
    testimonials = await client.fetch(
      `*[_type == "testimonial"] | order(_createdAt desc)[0...3]{ _id, name, feedback, role, company, "image": image.asset->url }`
    );
  } catch (err) {
    console.error("Failed to fetch testimonials:", err);
  }

  return <ServicesView services={services} testimonials={testimonials} />;
}
