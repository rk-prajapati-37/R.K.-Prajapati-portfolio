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
    <div className="page-wrap">
      <div className="max-w-6xl w-full mx-auto">
        <CertificateClient certificates={certificates} />
      </div>
    </div>
  );
}

export const metadata = {
  title: "Certificates",
  description: "Professional certifications in React, WordPress, HTML, CSS, JavaScript and UI/UX.",
};
