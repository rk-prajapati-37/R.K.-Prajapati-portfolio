import Link from "next/link";

export default function HireMeSection() {
  return (
    <section className="mt-16 mb-8 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="max-w-4xl mx-auto text-center px-6 md:px-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Ready to start your project?
        </h2>
        <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
          I design and develop fast, modern, and scalable websites that help businesses grow.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="inline-flex items-center bg-gray-800 dark:bg-gray-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-900 dark:hover:bg-gray-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            🔥 Hire Me
          </Link>

          <a
            href="https://wa.me/919876543210?text=Hi%20Rohit,%20I'm%20interested%20in%20your%20web%20development%20services"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            💬 WhatsApp
          </a>

          <Link
            href="/contact?type=quote"
            className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            📝 Get Free Quote
          </Link>
        </div>
      </div>
    </section>
  );
}