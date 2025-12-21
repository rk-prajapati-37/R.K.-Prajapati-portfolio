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
  relatedProjects?: Array<{
    _id: string;
    title: string;
    description?: string;
    techStack?: string[];
    github?: string;
    demo?: string;
    slug?: string;
    imageUrl?: string;
  }>;
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
      whatsappText,
      relatedProjects[]->{
        _id,
        title,
        description,
        techStack,
        github,
        demo,
        "slug": slug.current,
        "imageUrl": image.asset->url
      }
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

      {service.relatedProjects && service.relatedProjects.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {service.relatedProjects.map((project) => (
              <div key={project._id} className="bg-white rounded-lg shadow-md p-6 border">
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-32 object-cover rounded mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                {project.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {project.description}
                  </p>
                )}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.techStack.slice(0, 3).map((tech, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Live Demo →
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      GitHub →
                    </a>
                  )}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
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
