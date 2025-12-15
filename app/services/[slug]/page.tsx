import { client } from "@/lib/sanityClient";
import Link from "next/link";
import { Metadata } from "next";

type Service = {
  title: string;
  startingPrice?: string;
  deliveryTime?: string;
  shortDescription?: string;
  features?: string[];
  whatsappText?: string;
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;

  const service = await client.fetch(
    `*[_type=="service" && slug.current==$slug][0]{
      title,
      shortDescription,
      seoTitle,
      seoDescription
    }`,
    { slug }
  );

  return {
    title: service?.seoTitle || service?.title,
    description: service?.seoDescription || service?.shortDescription,
    openGraph: {
      title: service?.seoTitle || service?.title,
      description: service?.seoDescription || service?.shortDescription,
    },
  };
}

async function getService(slug: string): Promise<Service | null> {
  return await client.fetch(
    `
    *[_type == "service" && slug.current == $slug][0] {
      title,
      startingPrice,
      deliveryTime,
      shortDescription,
      features,
      whatsappText
    }
    `,
    { slug }
  );
}

export default async function ServiceDetailPage({
  params,
}: Props) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return <div className="text-center py-20">Service not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">{service.title}</h1>

      {service.shortDescription && (
        <p className="text-gray-600 mb-6">{service.shortDescription}</p>
      )}

      <div className="flex gap-6 mb-8">
        {service.startingPrice && (
          <p className="text-xl font-bold text-red-600">
            Starting at {service.startingPrice}
          </p>
        )}
        {service.deliveryTime && (
          <p className="text-gray-700">
            ⏱ {service.deliveryTime}
          </p>
        )}
      </div>

      {service.features && (
        <ul className="list-disc pl-5 space-y-2 mb-10">
          {service.features.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}

      <a
        href={`https://wa.me/918082068480?text=${encodeURIComponent(
          service.whatsappText || `Hi, I want to hire you for ${service.title}`
        )}`}
        target="_blank"
        className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700"
      >
        💬 Hire on WhatsApp
      </a>

      <div className="mt-10">
        <Link href="/services" className="text-red-600 font-semibold">
          ← Back to Services
        </Link>
      </div>
    </div>
  );
}
