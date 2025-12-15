import { client } from "@/lib/sanityClient";
import CertificateClient from "@/components/CertificateClient";
import { certificatesData } from "../about/data/certificatesData";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function CertificatesPage() {
  let certificates: any[] = [];
  try {
    certificates = await client.fetch(`*[_type == "certificate"] | order(order asc){ _id, title, issuer, date, "certificateImage": certificateImage.asset->url, url, description, order }`);
  } catch (err) {
    console.error("Failed to fetch certificates:", err);
  }

  // Fallback to static data if no certificates from Sanity
  if (!certificates || certificates.length === 0) {
    certificates = certificatesData.map((cert, index) => ({
      _id: `fallback-${index}`,
      title: cert.title,
      certificateImage: cert.image,
      order: index,
    }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br py-16 flex items-center justify-center px-6 md:px-10">
      <div className="max-w-6xl w-full">
        <CertificateClient certificates={certificates} />
      </div>
    </div>
  );
}
