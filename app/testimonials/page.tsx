import { client } from "../../lib/sanityClient";
import TestimonialsSliderClient from "@/components/TestimonialsSliderClient";

type Testimonial = {
  _id: string;
  name: string;
  text?: string;
  position: string;
  image?: string;
};

export default async function Testimonials() {
  let testimonials: Testimonial[] = [];
  let error: string | null = null;

  try {
    testimonials = await client.fetch(`*[_type == "testimonial"]{
      _id,
      name,
      position,
      "image": image.asset->url,
      "text": feedback
    }`);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load testimonials";
  }

  return <TestimonialsSliderClient testimonials={testimonials} error={error} />;
}