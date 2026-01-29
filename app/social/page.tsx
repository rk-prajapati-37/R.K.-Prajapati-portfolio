'use client';

import { useState, useEffect } from 'react';
import { sanityServerClient } from '@/lib/sanityServerClient';
import { motion } from 'framer-motion';
import SocialPosts from '@/components/SocialPosts';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub, FaYoutube, FaTiktok, FaWhatsapp } from 'react-icons/fa';

interface SocialLink {
  _id: string;
  platform: string;
  url: string;
  displayOrder: number;
}

const socialLinksQuery = `*[_type == "socialMedia" && active == true] | order(displayOrder asc) {
  _id,
  platform,
  url,
  displayOrder
}`;

const platformIcons: { [key: string]: React.ComponentType<any> } = {
  facebook: FaFacebookF,
  twitter: FaTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  github: FaGithub,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  whatsapp: FaWhatsapp,
};

const platformColors: { [key: string]: string } = {
  facebook: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
  twitter: 'text-blue-400 hover:text-blue-500 hover:bg-blue-50',
  instagram: 'text-pink-500 hover:text-pink-600 hover:bg-pink-50',
  linkedin: 'text-blue-700 hover:text-blue-800 hover:bg-blue-50',
  github: 'text-gray-800 hover:text-gray-900 hover:bg-gray-50',
  youtube: 'text-red-600 hover:text-red-700 hover:bg-red-50',
  tiktok: 'text-black hover:text-gray-700 hover:bg-gray-50',
  whatsapp: 'text-green-600 hover:text-green-700 hover:bg-green-50',
};

export default function SocialMediaPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const data = await sanityServerClient.fetch(socialLinksQuery);
        setSocialLinks(data);
      } catch (error) {
        console.error('Error fetching social links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br py-12 text-gray-800 pt-12 pb-8 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="font-semibold text-lg mb-2 text-red-600 uppercase tracking-wide">SOCIAL MEDIA</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Stay Connected
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Follow me on social media for updates, projects, and daily insights
          </p>
        </motion.div>

        {/* Social Links Section First */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Follow Me On All Platforms
          </h2>

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading social links...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {socialLinks.length > 0 ? (
                socialLinks.map((link, idx) => {
                  const IconComponent = platformIcons[link.platform] || FaFacebookF;
                  const colorClass = platformColors[link.platform] || 'text-gray-600';
                  
                  return (
                    <motion.a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: idx * 0.06 }}
                      whileHover={{ translateY: -6, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
                      className="group relative bg-transparent p-6 rounded-xl hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                          <IconComponent className="text-xl" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-gray-800 text-base group-hover:text-red-600 transition-colors">
                            {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                          </span>
                        </div>
                        <span className="text-lg text-gray-400 group-hover:text-red-600 transition-colors">
                          ↗
                        </span>
                      </div>
                    </motion.a>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No social links available
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Social Posts Section After */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <SocialPosts />
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center py-16 mt-20 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <h3 className="text-2xl font-bold mb-4">Want to Connect?</h3>
          <p className="text-lg mb-6">
            Click on any social media link above or send me a direct message
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors"
          >
            Contact Me →
          </a>
        </motion.div>
      </div>
    </div>
  );
}
