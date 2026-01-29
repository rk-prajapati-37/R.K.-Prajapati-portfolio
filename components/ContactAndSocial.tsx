'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sanityServerClient } from '@/lib/sanityServerClient';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub, FaYoutube, FaTiktok, FaWhatsapp } from 'react-icons/fa';

interface FormData {
  name: string;
  email: string;
  mobile: string;
  message: string;
}

interface SocialMedia {
  _id: string;
  platform: string;
  url: string;
  displayOrder: number;
}

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

const socialLinksQuery = `*[_type == "socialMedia" && active == true] | order(displayOrder asc) {
  _id,
  platform,
  url,
  displayOrder
}`;

export default function ContactAndSocial() {
  const [socialLinks, setSocialLinks] = useState<SocialMedia[]>([]);
  const [loadingSocial, setLoadingSocial] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const data = await sanityServerClient.fetch(socialLinksQuery);
        setSocialLinks(data.slice(0, 4)); // Top 4 platforms
      } catch (error) {
        console.error('Error fetching social links:', error);
      } finally {
        setLoadingSocial(false);
      }
    };

    fetchSocialLinks();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', mobile: '', message: '' });
        
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        console.error('Error submitting form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  from-white via-gray-50 to-gray-100 py-6 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <p className="font-semibold text-lg mb-2 text-red-600 uppercase tracking-wide">CONTACT</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            GET IN TOUCH
          </h1>
        </motion.div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Phone Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Phone</h4>
            <p className="text-sm text-gray-600">+91 8082 06 8480</p>
          </motion.div>

          {/* Email Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8.25v7.5A2.25 2.25 0 005.25 18h13.5A2.25 2.25 0 0021 15.75v-7.5A2.25 2.25 0 0018.75 6H5.25A2.25 2.25 0 003 8.25z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25l-9 6-9-6" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
            <p className="text-sm text-gray-600">r.k.prajapati0307@gmail.com</p>
          </motion.div>

          {/* Address Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s8-4.5 8-10.5A8 8 0 004 10.5C4 16.5 12 21 12 21z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Address</h4>
            <p className="text-sm text-gray-600 text-center">Siddhivinayak Chawl, Sabe Gaon, Diva (E) - 400612</p>
          </motion.div>
        </div>

        {/* Follow Me On All Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Follow Me On All Platforms</h2>
          
          {!loadingSocial && socialLinks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {socialLinks.map((link) => {
                const IconComponent = platformIcons[link.platform] || FaFacebookF;
                const colorClass = platformColors[link.platform] || 'text-gray-600 hover:text-gray-700 hover:bg-gray-50';
                
                return (
                  <a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition-shadow group cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <IconComponent className="text-xl" />
                    </div>
                    <span className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition">
                      {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto text-gray-400 group-hover:text-red-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500">Loading social platforms...</p>
          )}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
        >
          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg animate-pulse">
              ✅ Thank you! Your message has been received. I'll get back to you soon!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition text-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number (Optional)</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Mobile"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Message"
                rows={6}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition text-gray-800 placeholder-gray-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  );
}
