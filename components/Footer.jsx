import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61558068947419',
    icon: FaFacebookF,
    color: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/prajapa54879726',
    icon: FaTwitter,
    color: 'text-blue-400 hover:text-blue-500 hover:bg-blue-50',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/r.k.prajapati0307/',
    icon: FaInstagram,
    color: 'text-pink-500 hover:text-pink-600 hover:bg-pink-50',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/r-k-prajapati-2a5b4b169/',
    icon: FaLinkedinIn,
    color: 'text-blue-700 hover:text-blue-800 hover:bg-blue-50',
  },
];

export default function Footer() {
  return (
    <footer
      style={{ background: "var(--surface)", color: "var(--muted)" }}
      className="py-2 border-t border-gray-200"
    >
      <div className="site-container">
        {/* Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Links Left */}
          <div className="flex gap-4">
            {socialLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.name}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl border border-gray-200 ${link.color}`}
                >
                  <IconComponent className="text-lg" />
                </a>
              );
            })}
          </div>

          {/* Copyright Right */}
          <div>
            <p>© {new Date().getFullYear()} <b>R.K. Prajapati</b> Portfolio | All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
