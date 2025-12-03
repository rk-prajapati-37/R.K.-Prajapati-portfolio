import { client } from "@/lib/sanityClient";
import CertificateClient from "@/components/CertificateClient";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function CertificatesPage() {
  let certificates: any[] = [];
  try {
    certificates = await client.fetch(`*[_type == "certificate"] | order(order asc){ _id, title, issuer, date, "certificateImage": certificateImage.asset->url, url, description, order }`);
  } catch (err) {
    console.error("Failed to fetch certificates:", err);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  pt-12 pb-8 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Certificates</h2>
        <CertificateClient certificates={certificates} />
      </div>
    </div>
  );
}
