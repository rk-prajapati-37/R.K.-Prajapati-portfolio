"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus(null);

    // Validation: name, relatedTo, and message required; both email and mobile must be valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileClean = form.mobile ? form.mobile.replace(/\s|-/g, "") : "";
    const mobileValid = mobileClean && /^\d{7,15}$/.test(mobileClean);
    const emailValid = form.email && emailRegex.test(form.email);

    if (!form.name || form.name.trim().length < 2) {
      setStatus({ ok: false, msg: "Please enter your name (min 2 characters)." });
      return;
    }

    // relatedTo removed per request

    if (!form.message || form.message.trim().length < 10) {
      setStatus({ ok: false, msg: "Message must be at least 10 characters." });
      return;
    }

    if (!emailValid || !mobileValid) {
      setStatus({ ok: false, msg: "Please provide a valid email address AND a valid mobile number." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok) {
        setStatus({ ok: true, msg: json?.message || "Message sent." });
        setForm({ name: "", email: "", mobile: "", message: "" });
      } else {
        setStatus({ ok: false, msg: json?.error || "Failed to send." });
      }
    } catch (err: any) {
      setStatus({ ok: false, msg: err?.message || "Failed to send." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br py-16 flex items-center justify-center px-6 md:px-10">
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="font-semibold text-lg mb-2 text-red-600 uppercase tracking-wide">CONTACT</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            GET IN TOUCH
          </h1>
        </motion.div>

        {/* Contacts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              {/* Phone icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5.75A2.75 2.75 0 015.75 3h1.5A2.75 2.75 0 0010 5.75v1.5A2.75 2.75 0 017.25 10H6a.75.75 0 00-.75.75v1.5c0 1.24.5 2.42 1.38 3.29L9.5 18.5a3 3 0 003.54.44l1.2-.8A3 3 0 0016.5 17l.75-.75A2.75 2.75 0 0020 13.5V12a.75.75 0 00-.75-.75H18a2.75 2.75 0 01-2.75-2.75V6.25A2.75 2.75 0 0016.25 3h1.5A2.75 2.75 0 0020.5 6.25v1.5" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-700 mb-1">Phone</h4>
            <p className="text-sm text-gray-500">+91 8082 06 8480</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              {/* Mail icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8.25v7.5A2.25 2.25 0 005.25 18h13.5A2.25 2.25 0 0021 15.75v-7.5A2.25 2.25 0 0018.75 6H5.25A2.25 2.25 0 003 8.25z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25l-9 6-9-6" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-700 mb-1">Email</h4>
            <p className="text-sm text-gray-500">r.k.prajapati0307@gmail.com</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              {/* Location icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s8-4.5 8-10.5A8 8 0 004 10.5C4 16.5 12 21 12 21z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-700 mb-1">Address</h4>
            <p className="text-sm text-gray-500 text-center">Siddhivinayak Chawl, Sabe Gaon, Diva (E) - 400612</p>
          </div>
        </div>

        {/* Form and message area */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-4 rounded-full border border-gray-100 shadow-inner"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-4 rounded-full border border-gray-100 shadow-inner"
                />
                <input
                  type="text"
                  placeholder="Mobile"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="w-full p-4 rounded-full border border-gray-100 shadow-inner"
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <textarea
                placeholder="Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full h-full min-h-[220px] p-6 rounded-2xl border border-gray-100 shadow-inner resize-none"
                required
              />

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </form>

          {status && (
            <div
              className={`mt-6 p-4 rounded-md border-l-4 ${
                status.ok
                  ? 'bg-green-50 text-green-800 border-l-green-500'
                  : 'bg-red-50 text-red-800 border-l-red-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{status.ok ? '✅' : '❌'}</span>
                <span>{status.msg}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
