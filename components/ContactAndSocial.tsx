'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sanityServerClient } from '@/lib/sanityServerClient';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub, FaYoutube, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import PageHeader from '@/components/PageHeader';
import LiveSocialFeed from '@/components/LiveSocialFeed';

interface FormData {
  name: string;
  email: string;
  mobile: string;
  projectType: string;
  budget: string;
  message: string;
}

const PROJECT_TYPES = [
  'Business / Company Website',
  'Landing Page',
  'E-commerce / Shopify Store',
  'Portfolio / Personal Brand',
  'Website Redesign',
  'Website Maintenance / Fixes',
  'Other',
];

const BUDGETS = ['Under ₹10,000', '₹10,000 – ₹25,000', '₹25,000 – ₹50,000', '₹50,000+', 'Not sure yet'];

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
    projectType: '',
    budget: '',
    message: ''
  });
  const [honeypot, setHoneypot] = useState(''); // hidden field: real users never fill this, bots often do
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // /contact?type=quote -> jump straight to the form
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const type = new URLSearchParams(window.location.search).get('type');
    if (type === 'quote') {
      setFormData(prev => ({ ...prev, message: prev.message || 'Hi Rohit, I would like a quote for my website. Here are the details: ' }));
      setTimeout(() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    }
  }, []);
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (honeypot) {
      // Bot filled the hidden field: pretend success, don't actually submit.
      setSubmitted(true);
      setFormData({ name: '', email: '', mobile: '', projectType: '', budget: '', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, honeypot })
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', mobile: '', projectType: '', budget: '', message: '' });

        setTimeout(() => setSubmitted(false), 6000);
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMsg(data?.error || 'Something went wrong. Please try again or message me on WhatsApp.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMsg('Network error. Please try again or message me on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="max-w-6xl mx-auto">
        
        <PageHeader
          eyebrow="Contact"
          title="Get in Touch"
          subtitle="Tell me about your project and I will reply with a quote and timeline."
          crumbs={[{ label: "Contact" }]}
        />

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
            <a href="tel:+918082068480" className="text-sm text-gray-600 hover:text-red-600 transition-colors">+91 80820 68480</a>
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
            <a href="mailto:r.k.prajapati0307@gmail.com" className="text-sm text-gray-600 hover:text-red-600 transition-colors break-all">r.k.prajapati0307@gmail.com</a>
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
            <h4 className="font-semibold text-gray-800 mb-1">Location</h4>
            <p className="text-sm text-gray-600 text-center">Mumbai, Maharashtra, India</p>
            <p className="text-xs text-gray-500 mt-1">Available for remote work worldwide</p>
          </motion.div>
        </div>

        {/* Follow Me On All Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6"
        >
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-6">
            Follow Me On All Platforms
          </p>

          {!loadingSocial && socialLinks.length > 0 ? (
            <div
              className="relative overflow-hidden"
              style={{
                maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
                WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
              }}
            >
              <motion.div
                className="flex gap-4 w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
              >
                {[...socialLinks, ...socialLinks].map((link, i) => {
                  const IconComponent = platformIcons[link.platform] || FaFacebookF;
                  const colorClass = platformColors[link.platform] || 'text-gray-600 hover:text-gray-700 hover:bg-gray-50';

                  return (
                    <a
                      key={`${link._id}-${i}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-3 pl-3 pr-5 py-2.5 rounded-full border bg-white text-sm font-semibold whitespace-nowrap hover:border-red-400 hover:shadow-md transition group"
                      style={{ borderColor: 'var(--card-border, #e5e7eb)' }}
                    >
                      <span className={`w-7 h-7 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <IconComponent className="text-xs" />
                      </span>
                      <span className="text-gray-800 group-hover:text-red-600 transition">
                        {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                      </span>
                    </a>
                  );
                })}
              </motion.div>
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
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 scroll-mt-28"
          id="contact-form"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Tell me about your project</h2>
          <p className="text-sm text-gray-500 mb-6">Fill this in and I will reply with a rough quote and timeline, usually within a few hours.</p>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg" role="alert">
              {errorMsg}
            </div>
          )}

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg animate-pulse">
              ✅ Thank you! Your message has been received. I'll get back to you soon!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot: hidden from real visitors, bots often auto-fill every field */}
            <input
              type="text"
              name="company"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
            />

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

            {/* Project type + budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">What do you need?</label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition text-gray-800"
                >
                  <option value="">Select project type</option>
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Approximate budget</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition text-gray-800"
                >
                  <option value="">Select budget (optional)</option>
                  {BUDGETS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Tell me about your business, what the website should do, and any deadline."
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

        {/* Latest posts from my channels */}
        <div className="mt-20">
          <LiveSocialFeed limit={6} />
        </div>
      </div>
    </div>
  );
}
