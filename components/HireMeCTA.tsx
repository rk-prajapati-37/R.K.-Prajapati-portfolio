import Link from "next/link";

type Props = {
  text?: string;
};

export default function HireMeCTA({
  text = "Available for freelance work."
}: Props) {
  return (
    <div className="py-16 mt-20 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: 'color-mix(in oklab, white 90%, transparent)' }}>
      <div className="max-w-4xl mx-auto text-center px-6 md:px-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          {text}
        </h2>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Let's discuss how I can help bring your ideas to life with modern web technologies.
        </p>
        <Link
          href="/services"
          className="inline-flex items-center bg-red-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          View My Services →
        </Link>
      </div>
    </div>
  );
}