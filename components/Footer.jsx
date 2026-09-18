import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const socialLinks = [
  { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61558068947419", icon: FaFacebookF, color: "text-blue-600 hover:text-blue-700 hover:bg-blue-50" },
  { name: "X (Twitter)", url: "https://twitter.com/prajapa54879726", icon: FaXTwitter, color: "text-gray-800 hover:text-black hover:bg-gray-50" },
  { name: "Instagram", url: "https://www.instagram.com/r.k.prajapati0307/", icon: FaInstagram, color: "text-pink-500 hover:text-pink-600 hover:bg-pink-50" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/r-k-prajapati-2a5b4b169/", icon: FaLinkedinIn, color: "text-blue-700 hover:text-blue-800 hover:bg-blue-50" },
];

const quickLinks = [
  { href: "/services", label: "Services & Pricing" },
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/testimonials", label: "Testimonials" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--surface)", color: "var(--muted)" }} className="border-t border-gray-200 mt-8">
      <div className="site-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-6">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold" style={{ color: "var(--text)" }}>
              R.K. Prajapati
            </p>
            <p className="text-sm mt-1">Web Designer &amp; Frontend Developer</p>
            <p className="text-sm mt-3 leading-relaxed max-w-xs">
              Fast, responsive and business-focused websites built with WordPress, React and Next.js.
            </p>
            <div className="flex gap-3 mt-5">
              {socialLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.name}
                    aria-label={link.name}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow hover:shadow-lg border border-gray-200 ${link.color}`}
                  >
                    <IconComponent className="text-base" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-semibold mb-3" style={{ color: "var(--text)" }}>
              Quick Links
            </p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-red-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-semibold mb-3" style={{ color: "var(--text)" }}>
              Get in Touch
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:r.k.prajapati0307@gmail.com" className="inline-flex items-center gap-2 hover:text-red-600 transition-colors">
                  <FaEnvelope aria-hidden /> r.k.prajapati0307@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+918082068480" className="inline-flex items-center gap-2 hover:text-red-600 transition-colors">
                  <FaPhoneAlt aria-hidden /> +91 80820 68480
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <FaMapMarkerAlt aria-hidden /> Mumbai, Maharashtra, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 py-4 text-center text-xs">
          © {new Date().getFullYear()} <b>R.K. Prajapati</b>. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
