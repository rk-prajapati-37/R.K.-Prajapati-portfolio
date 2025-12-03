import { client } from "../../lib/sanityClient";
import TestimonialsSliderClient from "@/components/TestimonialsSliderClient";

type Testimonial = {
  _id: string;
  name: string;
  feedback?: string;
  role?: string;
  company?: string;
  image?: string;
};


export default async function Testimonials() {
  let testimonials: Testimonial[] = [];
  let error: string | null = null;

  try {
    testimonials = await client.fetch(`*[_type == "testimonial"]{
  _id,
  name,
  feedback,
  role,
  company,
  "image": image.asset->url
}`);

  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load testimonials";
  }

  return <TestimonialsSliderClient testimonials={testimonials} error={error} />;
}